-- PoC experimental de Ubícate. No es migración de producto.
-- Aplicación remota requiere autorización de escritura específica.
-- No utilizar en otro proyecto. No agregar CASCADE ni quitar los guardas.

BEGIN;

DO $guard$
BEGIN
  IF to_regnamespace('extensions') IS NULL THEN
    RAISE EXCEPTION 'STOP: schema extensions no existe';
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname LIKE 'ubicate_poc\_%' ESCAPE '\'
  ) THEN
    RAISE EXCEPTION 'STOP: at least one ubicate_poc_* table already exists; inspect, do not overwrite';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'postgis') THEN
    RAISE EXCEPTION 'STOP: PostGIS already exists; inspect provenance and do not alter it';
  END IF;

  IF to_regprocedure('public.ubicate_poc_is_property_owner(uuid)') IS NOT NULL THEN
    RAISE EXCEPTION 'STOP: ownership helper already exists; inspect, do not overwrite';
  END IF;
END
$guard$;

CREATE EXTENSION postgis WITH SCHEMA extensions;

CREATE TABLE public.ubicate_poc_advertisers (
  id uuid PRIMARY KEY,
  display_name text NOT NULL CHECK (length(btrim(display_name)) BETWEEN 1 AND 80),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ubicate_poc_properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  title text NOT NULL CHECK (length(btrim(title)) BETWEEN 1 AND 120),
  sector text NOT NULL CHECK (length(btrim(sector)) BETWEEN 1 AND 60),
  public_location extensions.geography(Point, 4326) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ubicate_poc_publication_status (
  property_id uuid PRIMARY KEY REFERENCES public.ubicate_poc_properties(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'paused')),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ubicate_poc_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.ubicate_poc_properties(id) ON DELETE RESTRICT,
  label text NOT NULL CHECK (length(btrim(label)) BETWEEN 1 AND 80),
  unit_type text NOT NULL CHECK (unit_type IN ('private_room', 'shared_room', 'studio')),
  monthly_price_cop integer NOT NULL CHECK (monthly_price_cop > 0),
  capacity smallint NOT NULL DEFAULT 1 CHECK (capacity BETWEEN 1 AND 8),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (property_id, label)
);

CREATE TABLE public.ubicate_poc_shared_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid NOT NULL REFERENCES public.ubicate_poc_properties(id) ON DELETE RESTRICT,
  name text NOT NULL CHECK (length(btrim(name)) BETWEEN 1 AND 80),
  space_type text NOT NULL CHECK (space_type IN ('kitchen', 'living_room', 'study', 'laundry', 'bathroom', 'other')),
  description text NOT NULL DEFAULT '' CHECK (length(description) <= 240),
  UNIQUE (property_id, name)
);

CREATE TABLE public.ubicate_poc_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.ubicate_poc_units(id) ON DELETE RESTRICT,
  available_from date NOT NULL,
  available_until date NOT NULL,
  status text NOT NULL CHECK (status IN ('available', 'unavailable')),
  CHECK (available_until >= available_from),
  UNIQUE (unit_id, available_from, available_until)
);

CREATE INDEX ubicate_poc_properties_location_gix
  ON public.ubicate_poc_properties USING gist (public_location);
CREATE INDEX ubicate_poc_properties_owner_idx
  ON public.ubicate_poc_properties (owner_id);
CREATE INDEX ubicate_poc_publication_status_idx
  ON public.ubicate_poc_publication_status (status, property_id);
CREATE INDEX ubicate_poc_units_property_idx
  ON public.ubicate_poc_units (property_id, id);
CREATE INDEX ubicate_poc_spaces_property_idx
  ON public.ubicate_poc_shared_spaces (property_id, id);
CREATE INDEX ubicate_poc_availability_search_idx
  ON public.ubicate_poc_availability (unit_id, status, available_from, available_until);

-- Evita recursión entre policies de inmuebles, estado editorial y unidades hijas.
-- La función solo responde si el inmueble pertenece al usuario autenticado.
CREATE FUNCTION public.ubicate_poc_is_property_owner(target_property_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.ubicate_poc_properties p
    WHERE p.id = target_property_id AND p.owner_id = (SELECT auth.uid())
  );
$function$;
REVOKE ALL ON FUNCTION public.ubicate_poc_is_property_owner(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.ubicate_poc_is_property_owner(uuid) TO authenticated;

ALTER TABLE public.ubicate_poc_advertisers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ubicate_poc_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ubicate_poc_publication_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ubicate_poc_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ubicate_poc_shared_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ubicate_poc_availability ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.ubicate_poc_advertisers FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.ubicate_poc_properties FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.ubicate_poc_publication_status FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.ubicate_poc_units FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.ubicate_poc_shared_spaces FROM PUBLIC, anon, authenticated;
REVOKE ALL ON TABLE public.ubicate_poc_availability FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE ON public.ubicate_poc_advertisers TO authenticated;
GRANT SELECT (id, title, sector, public_location, created_at)
  ON public.ubicate_poc_properties TO anon, authenticated;
GRANT INSERT (id, owner_id, title, sector, public_location)
  ON public.ubicate_poc_properties TO authenticated;
GRANT UPDATE (title, sector, public_location)
  ON public.ubicate_poc_properties TO authenticated;
GRANT SELECT (property_id, status, updated_at)
  ON public.ubicate_poc_publication_status TO anon, authenticated;
GRANT INSERT ON public.ubicate_poc_publication_status TO authenticated;
GRANT UPDATE (status, updated_at)
  ON public.ubicate_poc_publication_status TO authenticated;
GRANT SELECT ON public.ubicate_poc_units TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ubicate_poc_units TO authenticated;
GRANT SELECT ON public.ubicate_poc_shared_spaces TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ubicate_poc_shared_spaces TO authenticated;
GRANT SELECT ON public.ubicate_poc_availability TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ubicate_poc_availability TO authenticated;

CREATE POLICY ubicate_poc_advertiser_self_select
  ON public.ubicate_poc_advertisers FOR SELECT TO authenticated
  USING (id = (SELECT auth.uid()));
CREATE POLICY ubicate_poc_advertiser_self_insert
  ON public.ubicate_poc_advertisers FOR INSERT TO authenticated
  WITH CHECK (id = (SELECT auth.uid()));
CREATE POLICY ubicate_poc_advertiser_self_update
  ON public.ubicate_poc_advertisers FOR UPDATE TO authenticated
  USING (id = (SELECT auth.uid()))
  WITH CHECK (id = (SELECT auth.uid()));

CREATE POLICY ubicate_poc_properties_public_read
  ON public.ubicate_poc_properties FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ubicate_poc_publication_status s
    WHERE s.property_id = ubicate_poc_properties.id AND s.status = 'published'
  ));
CREATE POLICY ubicate_poc_properties_owner_read
  ON public.ubicate_poc_properties FOR SELECT TO authenticated
  USING (owner_id = (SELECT auth.uid()));
CREATE POLICY ubicate_poc_properties_owner_insert
  ON public.ubicate_poc_properties FOR INSERT TO authenticated
  WITH CHECK (owner_id = (SELECT auth.uid()));
CREATE POLICY ubicate_poc_properties_owner_update
  ON public.ubicate_poc_properties FOR UPDATE TO authenticated
  USING (owner_id = (SELECT auth.uid()))
  WITH CHECK (owner_id = (SELECT auth.uid()));
CREATE POLICY ubicate_poc_properties_admin_read
  ON public.ubicate_poc_properties FOR SELECT TO authenticated
  USING (COALESCE((SELECT auth.jwt() -> 'app_metadata' ->> 'ubicate_role') = 'admin', false));

CREATE POLICY ubicate_poc_status_public_read
  ON public.ubicate_poc_publication_status FOR SELECT TO anon, authenticated
  USING (status = 'published');
CREATE POLICY ubicate_poc_status_owner_read
  ON public.ubicate_poc_publication_status FOR SELECT TO authenticated
  USING (public.ubicate_poc_is_property_owner(property_id));
CREATE POLICY ubicate_poc_status_admin_read
  ON public.ubicate_poc_publication_status FOR SELECT TO authenticated
  USING (COALESCE((SELECT auth.jwt() -> 'app_metadata' ->> 'ubicate_role') = 'admin', false));
CREATE POLICY ubicate_poc_status_admin_insert
  ON public.ubicate_poc_publication_status FOR INSERT TO authenticated
  WITH CHECK (COALESCE((SELECT auth.jwt() -> 'app_metadata' ->> 'ubicate_role') = 'admin', false));
CREATE POLICY ubicate_poc_status_admin_update
  ON public.ubicate_poc_publication_status FOR UPDATE TO authenticated
  USING (COALESCE((SELECT auth.jwt() -> 'app_metadata' ->> 'ubicate_role') = 'admin', false))
  WITH CHECK (COALESCE((SELECT auth.jwt() -> 'app_metadata' ->> 'ubicate_role') = 'admin', false));

CREATE POLICY ubicate_poc_units_public_read
  ON public.ubicate_poc_units FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ubicate_poc_properties p
    JOIN public.ubicate_poc_publication_status s ON s.property_id = p.id
    WHERE p.id = ubicate_poc_units.property_id AND s.status = 'published'
  ));
CREATE POLICY ubicate_poc_units_owner_read
  ON public.ubicate_poc_units FOR SELECT TO authenticated
  USING (public.ubicate_poc_is_property_owner(property_id));
CREATE POLICY ubicate_poc_units_admin_read
  ON public.ubicate_poc_units FOR SELECT TO authenticated
  USING (COALESCE((SELECT auth.jwt() -> 'app_metadata' ->> 'ubicate_role') = 'admin', false));
CREATE POLICY ubicate_poc_units_owner_insert
  ON public.ubicate_poc_units FOR INSERT TO authenticated
  WITH CHECK (public.ubicate_poc_is_property_owner(property_id));
CREATE POLICY ubicate_poc_units_owner_update
  ON public.ubicate_poc_units FOR UPDATE TO authenticated
  USING (public.ubicate_poc_is_property_owner(property_id))
  WITH CHECK (public.ubicate_poc_is_property_owner(property_id));
CREATE POLICY ubicate_poc_units_owner_delete
  ON public.ubicate_poc_units FOR DELETE TO authenticated
  USING (public.ubicate_poc_is_property_owner(property_id));

CREATE POLICY ubicate_poc_spaces_public_read
  ON public.ubicate_poc_shared_spaces FOR SELECT TO anon, authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ubicate_poc_properties p
    JOIN public.ubicate_poc_publication_status s ON s.property_id = p.id
    WHERE p.id = ubicate_poc_shared_spaces.property_id AND s.status = 'published'
  ));
CREATE POLICY ubicate_poc_spaces_owner_read
  ON public.ubicate_poc_shared_spaces FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ubicate_poc_properties p
    WHERE p.id = ubicate_poc_shared_spaces.property_id AND p.owner_id = (SELECT auth.uid())
  ));
CREATE POLICY ubicate_poc_spaces_admin_read
  ON public.ubicate_poc_shared_spaces FOR SELECT TO authenticated
  USING (COALESCE((SELECT auth.jwt() -> 'app_metadata' ->> 'ubicate_role') = 'admin', false));
CREATE POLICY ubicate_poc_spaces_owner_insert
  ON public.ubicate_poc_shared_spaces FOR INSERT TO authenticated
  WITH CHECK (public.ubicate_poc_is_property_owner(property_id));
CREATE POLICY ubicate_poc_spaces_owner_update
  ON public.ubicate_poc_shared_spaces FOR UPDATE TO authenticated
  USING (public.ubicate_poc_is_property_owner(property_id))
  WITH CHECK (public.ubicate_poc_is_property_owner(property_id));
CREATE POLICY ubicate_poc_spaces_owner_delete
  ON public.ubicate_poc_shared_spaces FOR DELETE TO authenticated
  USING (public.ubicate_poc_is_property_owner(property_id));

CREATE POLICY ubicate_poc_availability_public_read
  ON public.ubicate_poc_availability FOR SELECT TO anon, authenticated
  USING (status = 'available' AND EXISTS (
    SELECT 1 FROM public.ubicate_poc_units u
    JOIN public.ubicate_poc_properties p ON p.id = u.property_id
    JOIN public.ubicate_poc_publication_status s ON s.property_id = p.id
    WHERE u.id = ubicate_poc_availability.unit_id AND s.status = 'published'
  ));
CREATE POLICY ubicate_poc_availability_owner_read
  ON public.ubicate_poc_availability FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ubicate_poc_units u
    JOIN public.ubicate_poc_properties p ON p.id = u.property_id
    WHERE u.id = ubicate_poc_availability.unit_id AND p.owner_id = (SELECT auth.uid())
  ));
CREATE POLICY ubicate_poc_availability_admin_read
  ON public.ubicate_poc_availability FOR SELECT TO authenticated
  USING (COALESCE((SELECT auth.jwt() -> 'app_metadata' ->> 'ubicate_role') = 'admin', false));
CREATE POLICY ubicate_poc_availability_owner_insert
  ON public.ubicate_poc_availability FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.ubicate_poc_units u
    WHERE u.id = ubicate_poc_availability.unit_id AND public.ubicate_poc_is_property_owner(u.property_id)
  ));
CREATE POLICY ubicate_poc_availability_owner_update
  ON public.ubicate_poc_availability FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ubicate_poc_units u
    WHERE u.id = ubicate_poc_availability.unit_id AND public.ubicate_poc_is_property_owner(u.property_id)
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.ubicate_poc_units u
    WHERE u.id = ubicate_poc_availability.unit_id AND public.ubicate_poc_is_property_owner(u.property_id)
  ));
CREATE POLICY ubicate_poc_availability_owner_delete
  ON public.ubicate_poc_availability FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ubicate_poc_units u
    WHERE u.id = ubicate_poc_availability.unit_id AND public.ubicate_poc_is_property_owner(u.property_id)
  ));

COMMIT;
