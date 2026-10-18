-- Suite de lectura/RLS y cambios transaccionales de prueba.
-- Requiere ejecutar como postgres en el proyecto aislado, después de migration + seed.
-- Todas las mutaciones de aserción quedan dentro de la transacción y se revierten.

BEGIN;

-- Static effective-privilege and owner postconditions for the private helper.
DO $helper_privileges$
DECLARE helper_oid oid; helper_owner text; owner_bypass boolean; helper_definer boolean; helper_config text[];
BEGIN
  SELECT p.oid, pg_get_userbyid(p.proowner), r.rolbypassrls, p.prosecdef, p.proconfig
    INTO helper_oid, helper_owner, owner_bypass, helper_definer, helper_config
  FROM pg_proc p
  JOIN pg_namespace n ON n.oid = p.pronamespace
  JOIN pg_roles r ON r.oid = p.proowner
  WHERE n.nspname = 'private'
    AND p.proname = 'ubicate_poc_is_property_owner'
    AND pg_get_function_identity_arguments(p.oid) = 'target_property_id uuid';

  IF helper_oid IS NULL OR helper_owner <> 'postgres' OR owner_bypass IS NOT TRUE
     OR helper_definer IS NOT TRUE
     OR NOT (COALESCE(helper_config, ARRAY[]::text[]) @> ARRAY['search_path=""']) THEN
    RAISE EXCEPTION 'FAIL helper owner / BYPASSRLS / SECURITY DEFINER / empty search_path';
  END IF;
  IF has_schema_privilege('anon', 'private', 'USAGE')
     OR has_function_privilege('anon', helper_oid, 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL anon has access to private helper';
  END IF;
  IF NOT has_schema_privilege('authenticated', 'private', 'USAGE')
     OR NOT has_function_privilege('authenticated', helper_oid, 'EXECUTE') THEN
    RAISE EXCEPTION 'FAIL authenticated lacks the helper privileges required by RLS';
  END IF;
  IF EXISTS (
    SELECT 1
    FROM aclexplode(COALESCE((SELECT p.proacl FROM pg_proc p WHERE p.oid = helper_oid), acldefault('f', (SELECT p.proowner FROM pg_proc p WHERE p.oid = helper_oid)))) a
    WHERE a.privilege_type = 'EXECUTE'
      AND a.grantee NOT IN ((SELECT oid FROM pg_roles WHERE rolname = 'postgres'), (SELECT oid FROM pg_roles WHERE rolname = 'authenticated'))
  ) THEN
    RAISE EXCEPTION 'FAIL unexpected EXECUTE grantee on helper';
  END IF;
END
$helper_privileges$;

-- anon direct invocation must fail at schema/function permissions.
SET LOCAL ROLE anon;
DO $anon_helper_denied$
BEGIN
  BEGIN
    EXECUTE 'SELECT private.ubicate_poc_is_property_owner(''10000000-0000-4000-8000-000000000001''::uuid)';
    RAISE EXCEPTION 'FAIL anon invoked private helper';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
END
$anon_helper_denied$;
RESET ROLE;

-- anon: solo anuncios publicados y columnas públicas; ningún acceso a perfiles.
SET LOCAL ROLE anon;
DO $test$
DECLARE n bigint;
BEGIN
  SELECT count(id) INTO n FROM public.ubicate_poc_properties;
  IF n <> 2 THEN RAISE EXCEPTION 'FAIL anon published properties: expected 2, got %', n; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_properties
  WHERE id = '10000000-0000-4000-8000-000000000002';
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL anon can see draft property'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_units;
  IF n <> 3 THEN RAISE EXCEPTION 'FAIL anon units of published properties: expected 3, got %', n; END IF;
  SELECT count(id) INTO n FROM public.ubicate_poc_units
  WHERE id = '20000000-0000-4000-8000-000000000003';
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL anon can read unit belonging to draft property'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_availability;
  IF n <> 2 THEN RAISE EXCEPTION 'FAIL anon available rows of published properties: expected 2, got %', n; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_shared_spaces;
  IF n <> 2 THEN RAISE EXCEPTION 'FAIL anon spaces of published properties: expected 2, got %', n; END IF;
  SELECT count(id) INTO n FROM public.ubicate_poc_shared_spaces
  WHERE id = '30000000-0000-4000-8000-000000000002';
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL anon can read shared space belonging to draft property'; END IF;

  IF has_table_privilege(current_user, 'public.ubicate_poc_advertisers', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL anon can read advertiser profiles';
  END IF;
  IF has_column_privilege('anon', 'public.ubicate_poc_properties', 'owner_id', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL anon has SELECT on owner_id';
  END IF;
  IF has_table_privilege(current_user, 'public.ubicate_poc_properties', 'UPDATE') THEN
    RAISE EXCEPTION 'FAIL anon can update properties';
  END IF;
  IF has_table_privilege(current_user, 'public.ubicate_poc_properties', 'INSERT') THEN
    RAISE EXCEPTION 'FAIL anon can insert properties';
  END IF;
END
$test$;

-- Geographic public search: published + available within radius; no drafts or duplicates.
DO $geo$
DECLARE unit_ids uuid[];
BEGIN
  SELECT array_agg(q.unit_id ORDER BY q.unit_id) INTO unit_ids
  FROM (
    SELECT DISTINCT u.id AS unit_id
    FROM public.ubicate_poc_properties p
    JOIN public.ubicate_poc_publication_status s ON s.property_id = p.id AND s.status = 'published'
    JOIN public.ubicate_poc_units u ON u.property_id = p.id
    JOIN public.ubicate_poc_availability a ON a.unit_id = u.id
    WHERE a.status = 'available'
      AND a.available_from <= DATE '2027-01-10'
      AND a.available_until >= DATE '2027-01-10'
      AND extensions.st_dwithin(
        p.public_location,
        extensions.st_setsrid(extensions.st_makepoint(-73.3670, 5.5350), 4326)::extensions.geography,
        1000
      )
  ) AS q;

  IF unit_ids IS DISTINCT FROM ARRAY['20000000-0000-4000-8000-000000000001'::uuid] THEN
    RAISE EXCEPTION 'FAIL 1km center search expected unit A1 only, got %', unit_ids;
  END IF;

  SELECT array_agg(q.unit_id ORDER BY q.unit_id) INTO unit_ids
  FROM (
    SELECT DISTINCT u.id AS unit_id
    FROM public.ubicate_poc_properties p
    JOIN public.ubicate_poc_publication_status s ON s.property_id = p.id AND s.status = 'published'
    JOIN public.ubicate_poc_units u ON u.property_id = p.id
    JOIN public.ubicate_poc_availability a ON a.unit_id = u.id
    WHERE a.status = 'available'
      AND extensions.st_dwithin(
        p.public_location,
        extensions.st_setsrid(extensions.st_makepoint(-73.3670, 5.5450), 4326)::extensions.geography,
        1000
      )
  ) AS q;

  IF unit_ids IS NOT NULL THEN
    RAISE EXCEPTION 'FAIL public north search exposed a draft or unexpected unit: %', unit_ids;
  END IF;

  SELECT array_agg(q.unit_id ORDER BY q.unit_id) INTO unit_ids
  FROM (
    SELECT DISTINCT u.id AS unit_id
    FROM public.ubicate_poc_properties p
    JOIN public.ubicate_poc_publication_status s ON s.property_id = p.id AND s.status = 'published'
    JOIN public.ubicate_poc_units u ON u.property_id = p.id
    JOIN public.ubicate_poc_availability a ON a.unit_id = u.id
    WHERE a.status = 'available'
      AND extensions.st_dwithin(
        p.public_location,
        extensions.st_setsrid(extensions.st_makepoint(-73.3670, 5.5250), 4326)::extensions.geography,
        1000
      )
  ) AS q;

  IF unit_ids IS DISTINCT FROM ARRAY['20000000-0000-4000-8000-000000000004'::uuid] THEN
    RAISE EXCEPTION 'FAIL 1km south search expected unit B south only, got %', unit_ids;
  END IF;

  SELECT array_agg(q.unit_id ORDER BY q.unit_id) INTO unit_ids
  FROM (
    SELECT DISTINCT u.id AS unit_id
    FROM public.ubicate_poc_properties p
    JOIN public.ubicate_poc_publication_status s ON s.property_id = p.id AND s.status = 'published'
    JOIN public.ubicate_poc_units u ON u.property_id = p.id
    JOIN public.ubicate_poc_availability a ON a.unit_id = u.id
    WHERE a.status = 'available'
      AND a.available_from <= DATE '2027-01-10'
      AND a.available_until >= DATE '2027-01-10'
      AND extensions.st_dwithin(
        p.public_location,
        extensions.st_setsrid(extensions.st_makepoint(-73.3670, 5.5350), 4326)::extensions.geography,
        250
      )
  ) AS q;

  IF unit_ids IS DISTINCT FROM ARRAY['20000000-0000-4000-8000-000000000001'::uuid] THEN
    RAISE EXCEPTION 'FAIL 250m center search expected unit A1 only, got %', unit_ids;
  END IF;
END
$geo$;

RESET ROLE;
SELECT set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', true);
SELECT set_config('request.jwt.claims', '{"sub":"aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1","role":"authenticated","app_metadata":{"ubicate_role":"advertiser"}}', true);
SET LOCAL ROLE authenticated;

-- Advertiser A: own profile and draft are available; B's draft and private profile are not.
DO $owner_a$
DECLARE n bigint; changed bigint;
BEGIN
  SELECT count(id) INTO n FROM public.ubicate_poc_advertisers;
  IF n <> 1 THEN RAISE EXCEPTION 'FAIL advertiser A profile isolation: expected 1, got %', n; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_properties
  WHERE id = '10000000-0000-4000-8000-000000000001';
  IF n <> 1 THEN RAISE EXCEPTION 'FAIL advertiser A cannot read own published property'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_properties
  WHERE id = '10000000-0000-4000-8000-000000000002';
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL advertiser A can read B draft'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_units
  WHERE id = '20000000-0000-4000-8000-000000000003';
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL advertiser A can read B draft unit by known UUID'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_shared_spaces
  WHERE id = '30000000-0000-4000-8000-000000000002';
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL advertiser A can read B draft shared space by known UUID'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_availability
  WHERE id = '40000000-0000-4000-8000-000000000003';
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL advertiser A can read B draft availability by known UUID'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_advertisers
  WHERE id = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1';
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL advertiser A can read B private profile by known UUID'; END IF;

  SELECT count(property_id) INTO n FROM public.ubicate_poc_publication_status
  WHERE property_id = '10000000-0000-4000-8000-000000000001' AND status = 'published';
  IF n <> 1 THEN RAISE EXCEPTION 'FAIL advertiser A cannot read own publication status'; END IF;

  UPDATE public.ubicate_poc_properties SET title = 'Cambio de prueba A'
  WHERE id = '10000000-0000-4000-8000-000000000002';
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 0 THEN RAISE EXCEPTION 'FAIL advertiser A changed B property'; END IF;

  UPDATE public.ubicate_poc_units SET monthly_price_cop = 1
  WHERE id = '20000000-0000-4000-8000-000000000003';
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 0 THEN RAISE EXCEPTION 'FAIL advertiser A changed B unit'; END IF;

  DELETE FROM public.ubicate_poc_availability
  WHERE id = '40000000-0000-4000-8000-000000000003';
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 0 THEN RAISE EXCEPTION 'FAIL advertiser A deleted B availability'; END IF;

  UPDATE public.ubicate_poc_publication_status SET status = 'published'
  WHERE property_id = '10000000-0000-4000-8000-000000000002';
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 0 THEN RAISE EXCEPTION 'FAIL advertiser A changed publication status'; END IF;

  UPDATE public.ubicate_poc_properties SET title = 'Título temporal propio A'
  WHERE id = '10000000-0000-4000-8000-000000000001';
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 1 THEN RAISE EXCEPTION 'FAIL advertiser A could not update own property'; END IF;

  IF has_column_privilege(current_user, 'public.ubicate_poc_properties', 'owner_id', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL advertiser has SELECT on owner_id';
  END IF;
  IF has_table_privilege(current_user, 'public.ubicate_poc_properties', 'DELETE') THEN
    RAISE EXCEPTION 'FAIL advertiser has DELETE on property table';
  END IF;
END
$owner_a$;

RESET ROLE;
SELECT set_config('request.jwt.claim.sub', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', true);
SELECT set_config('request.jwt.claims', '{"sub":"bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1","role":"authenticated","app_metadata":{"ubicate_role":"advertiser"}}', true);
SET LOCAL ROLE authenticated;

DO $owner_b$
DECLARE n bigint;
BEGIN
  SELECT count(id) INTO n FROM public.ubicate_poc_properties
  WHERE id = '10000000-0000-4000-8000-000000000002';
  IF n <> 1 THEN RAISE EXCEPTION 'FAIL advertiser B cannot read own draft'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_units
  WHERE id = '20000000-0000-4000-8000-000000000003';
  IF n <> 1 THEN RAISE EXCEPTION 'FAIL advertiser B cannot read own draft unit'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_shared_spaces
  WHERE id = '30000000-0000-4000-8000-000000000002';
  IF n <> 1 THEN RAISE EXCEPTION 'FAIL advertiser B cannot read own draft shared space'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_availability
  WHERE id = '40000000-0000-4000-8000-000000000003';
  IF n <> 1 THEN RAISE EXCEPTION 'FAIL advertiser B cannot read own draft availability'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_availability
  WHERE id = '40000000-0000-4000-8000-000000000004';
  IF n <> 1 THEN RAISE EXCEPTION 'FAIL advertiser B cannot read own published availability'; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_availability
  WHERE id = '40000000-0000-4000-8000-000000000002';
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL advertiser B can read A unavailable availability by known UUID'; END IF;
END
$owner_b$;

RESET ROLE;
SELECT set_config('request.jwt.claim.sub', 'cccccccc-cccc-4ccc-8ccc-ccccccccccc1', true);
SELECT set_config('request.jwt.claims', '{"sub":"cccccccc-cccc-4ccc-8ccc-ccccccccccc1","role":"authenticated","app_metadata":{"ubicate_role":"admin"}}', true);
SET LOCAL ROLE authenticated;

-- Admin may inspect listing content and change publication status, but cannot see owner_id or profiles.
DO $admin$
DECLARE n bigint; changed bigint;
BEGIN
  SELECT count(id) INTO n FROM public.ubicate_poc_properties;
  IF n <> 3 THEN RAISE EXCEPTION 'FAIL admin should see all 3 properties, got %', n; END IF;

  SELECT count(property_id) INTO n FROM public.ubicate_poc_publication_status;
  IF n <> 3 THEN RAISE EXCEPTION 'FAIL admin should see all 3 moderation states, got %', n; END IF;

  SELECT count(id) INTO n FROM public.ubicate_poc_advertisers;
  IF n <> 0 THEN RAISE EXCEPTION 'FAIL admin RLS exposes advertiser profile rows: expected 0, got %', n; END IF;

  UPDATE public.ubicate_poc_publication_status SET status = 'published'
  WHERE property_id = '10000000-0000-4000-8000-000000000002';
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 1 THEN RAISE EXCEPTION 'FAIL admin cannot publish test listing'; END IF;

  IF has_column_privilege(current_user, 'public.ubicate_poc_properties', 'owner_id', 'SELECT') THEN
    RAISE EXCEPTION 'FAIL admin test role can SELECT owner_id';
  END IF;
  IF has_table_privilege(current_user, 'public.ubicate_poc_properties', 'DELETE') THEN
    RAISE EXCEPTION 'FAIL admin test role can DELETE properties';
  END IF;

  UPDATE public.ubicate_poc_properties SET title = 'Cambio admin no permitido'
  WHERE id = '10000000-0000-4000-8000-000000000001';
  GET DIAGNOSTICS changed = ROW_COUNT;
  IF changed <> 0 THEN RAISE EXCEPTION 'FAIL admin changed listing content'; END IF;
END
$admin$;

RESET ROLE;
SET LOCAL ROLE anon;
DO $admin_visibility$
DECLARE n bigint;
BEGIN
  SELECT count(id) INTO n FROM public.ubicate_poc_properties
  WHERE id = '10000000-0000-4000-8000-000000000002';
  IF n <> 1 THEN RAISE EXCEPTION 'FAIL admin publication state did not make listing public inside test transaction'; END IF;
END
$admin_visibility$;

ROLLBACK;
