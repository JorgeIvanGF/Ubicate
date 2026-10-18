-- Datos de prueba totalmente ficticios. No crea registros en auth.users.
-- Ejecutar solo después de la migración y de una autorización de escritura.

INSERT INTO public.ubicate_poc_advertisers (id, display_name) VALUES
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Anunciante Ficticio A'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Anunciante Ficticio B');

INSERT INTO public.ubicate_poc_properties (id, owner_id, title, sector, public_location) VALUES
  ('10000000-0000-4000-8000-000000000001', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Casa de prueba A', 'Centro', extensions.st_setsrid(extensions.st_makepoint(-73.3671, 5.5351), 4326)::extensions.geography),
  ('10000000-0000-4000-8000-000000000002', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Casa de prueba B Norte', 'Norte', extensions.st_setsrid(extensions.st_makepoint(-73.3672, 5.5451), 4326)::extensions.geography),
  ('10000000-0000-4000-8000-000000000003', 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'Casa de prueba B Sur', 'Sur', extensions.st_setsrid(extensions.st_makepoint(-73.3671, 5.5251), 4326)::extensions.geography);

INSERT INTO public.ubicate_poc_publication_status (property_id, status) VALUES
  ('10000000-0000-4000-8000-000000000001', 'published'),
  ('10000000-0000-4000-8000-000000000002', 'draft'),
  ('10000000-0000-4000-8000-000000000003', 'published');

INSERT INTO public.ubicate_poc_units (id, property_id, label, unit_type, monthly_price_cop, capacity) VALUES
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Habitación A1', 'private_room', 650000, 1),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Habitación A2', 'shared_room', 480000, 2),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'Habitación B Norte', 'private_room', 600000, 1),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000003', 'Habitación B Sur', 'private_room', 720000, 1);

INSERT INTO public.ubicate_poc_shared_spaces (id, property_id, name, space_type, description) VALUES
  ('30000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Cocina compartida A', 'kitchen', 'Espacio de prueba sin domicilio real.'),
  ('30000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000002', 'Sala de estudio B Norte', 'study', 'Espacio de prueba no publicado.'),
  ('30000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000003', 'Cocina compartida B Sur', 'kitchen', 'Espacio de prueba sin domicilio real.');

INSERT INTO public.ubicate_poc_availability (id, unit_id, available_from, available_until, status) VALUES
  ('40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', DATE '2027-01-01', DATE '2027-06-30', 'available'),
  ('40000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000002', DATE '2027-01-01', DATE '2027-06-30', 'unavailable'),
  ('40000000-0000-4000-8000-000000000003', '20000000-0000-4000-8000-000000000003', DATE '2027-01-01', DATE '2027-06-30', 'available'),
  ('40000000-0000-4000-8000-000000000004', '20000000-0000-4000-8000-000000000004', DATE '2027-01-01', DATE '2027-06-30', 'available');
