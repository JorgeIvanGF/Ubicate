# Revisión de seguridad: helper de propiedad

**Fecha:** 2026-10-16

**Estado vigente:** el helper privado propuesto en esta revisión fue aplicado en la PoC bajo autorización específica y sus propiedades/privilegios se verificaron por lectura; la suite fue confirmada por dirección. La última verificación visual documentada encontró `private` fuera de los esquemas expuestos por Data API (véase la [PoC Auth](../poc-auth-data-api-rls/README.md)). No autoriza nuevas escrituras. La restauración integral no se probó. Evidencia vigente: [informe consolidado](README.md).

Las secciones siguientes conservan la revisión estática y propuesta originales previas a la PoC. Las frases que describen ausencia de objetos o ejecución pendiente reflejan ese momento histórico, no el estado vigente.

## Hallazgos de la revisión original previa a la PoC

La migración `migrations/20261016_01_postgis_listing_rls.sql` crea `public.ubicate_poc_is_property_owner(uuid)` como función SQL `STABLE SECURITY DEFINER`, con `SET search_path = ''` y referencias cualificadas. Revoca `EXECUTE` a `PUBLIC`, `anon` y `authenticated`, y vuelve a concederlo a `authenticated`. Las policies de estado, unidades, espacios comunes y disponibilidad invocan el helper.

El helper consulta `ubicate_poc_properties` para decidir si `auth.uid()` es propietario. Se incluyó para evitar recursión entre policies que consultan la tabla de propiedades y la tabla de estado editorial. Como la consulta debe poder comprobar propiedad sin quedar sometida a la misma RLS que activa la policy, `SECURITY INVOKER` no se considera sustituto equivalente sin una prueba SQL que demuestre ausencia de recursión y preservación del aislamiento. Esta conclusión es una evaluación estática, no un resultado de ejecución.

La sesión MCP de solo lectura observó PostgreSQL 17.11, `current_user = session_user = supabase_read_only_user` y `pg_roles.rolbypassrls = true` para `postgres`, con `rolsuper = false`. Esto confirma que el rol `postgres` está disponible como propietario con bypass RLS según el catálogo consultado, pero no confirma que la migración se ejecute efectivamente bajo ese rol. La migración no fija el propietario de la función.

Al estar el helper en `public`, su ejecución está concedida a `authenticated`. Aunque solo devuelve si el UUID consultado pertenece al usuario autenticado, `public` puede estar expuesto a la Data API. La disponibilidad exacta depende de la configuración de esquemas expuestos del proyecto, que no se verificó en esta revisión. El `search_path` vacío y los nombres cualificados reducen el riesgo de sustitución de objetos.

Los `REVOKE` de la migración quitan privilegios de las tres tablas a `PUBLIC`, `anon` y `authenticated` antes de conceder las operaciones específicas. La revisión estática encuentra grants de columnas limitadas para propiedades y estado editorial; las tablas hijas permiten `SELECT` a `anon`/`authenticated`, con filtrado previsto mediante RLS. No se ha ejecutado una verificación remota de ACL porque los objetos no existen todavía.

## Cambio material que se propuso y luego se aplicó en la PoC

1. Crear el helper en un esquema privado, por ejemplo `private`, separado de los seis objetos `public.ubicate_poc_*`.
2. Exigir al comienzo de la transacción `current_user = 'postgres'`, para que el propietario de tablas y esquema sea controlado y la propuesta no cree objetos bajo un rol distinto.
3. Confirmar antes de migrar que `private` no está incluido en los esquemas expuestos por la Data API. No cambiar esa configuración como parte de la PoC.
4. Mantener `SECURITY DEFINER`, `STABLE`, `SET search_path = ''` y referencias totalmente cualificadas a tablas y funciones.
5. Fijar explícitamente el propietario del helper a `postgres` y abortar si la sesión de migración no tiene facultades para hacerlo. El propietario esperado debe conservar `BYPASSRLS`; no otorgar ese atributo a roles nuevos.
6. Revocar `ALL` sobre el esquema a `PUBLIC`, `anon` y `authenticated`; conceder `USAGE` del esquema y `EXECUTE` del helper únicamente a `authenticated`, porque las policies ejecutan con el rol autenticado. No conceder `EXECUTE` a `anon`.
7. Actualizar todas las policies para usar `private.ubicate_poc_is_property_owner(uuid)` y actualizar la guarda de colisión.
8. Añadir una comprobación posterior reproducible que inspeccione propietario, `prosecdef`, `proconfig`, ACL de función y privilegios de esquema para `anon` y `authenticated`. Debe fallar si el propietario no es `postgres`, si no hay `BYPASSRLS`, si `search_path` no está vacío o si los grants exceden lo descrito.
9. Añadir pruebas negativas para llamada directa a la función por `anon`, aislamiento entre dos anunciantes y operación de las policies cuando `authenticated` puede ejecutar el helper.

Este cambio altera el esquema donde vive una función de seguridad, las policies que la referencian y los grants asociados. Es una modificación material. La dirección aceptó el enfoque, revisó la candidata concreta y autorizó su aplicación solo en la PoC aislada. La migración original se conserva; no se selecciona por ello la arquitectura productiva.

## Consultas de comprobación propuestas para después de la creación

```sql
SELECT n.nspname AS function_schema,
       p.proname,
       pg_get_userbyid(p.proowner) AS owner,
       r.rolbypassrls AS owner_bypasses_rls,
       p.prosecdef AS security_definer,
       p.proconfig AS function_config,
       p.proacl AS function_acl
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
JOIN pg_roles r ON r.oid = p.proowner
WHERE n.nspname = 'private'
  AND p.proname = 'ubicate_poc_is_property_owner'
  AND pg_get_function_identity_arguments(p.oid) = 'target_property_id uuid';

SELECT has_schema_privilege('anon', 'private', 'USAGE') AS anon_schema_usage,
       has_schema_privilege('authenticated', 'private', 'USAGE') AS authenticated_schema_usage,
       has_function_privilege('anon', 'private.ubicate_poc_is_property_owner(uuid)', 'EXECUTE') AS anon_execute,
       has_function_privilege('authenticated', 'private.ubicate_poc_is_property_owner(uuid)', 'EXECUTE') AS authenticated_execute;
```

Resultado esperado: una sola función, propietario `postgres`, `owner_bypasses_rls = true`, `security_definer = true`, `function_config` incluye `search_path=""`, `anon_schema_usage = false`, `authenticated_schema_usage = true`, `anon_execute = false`, `authenticated_execute = true`. El formato real de `proconfig` y ACL debe interpretarse según el resultado del servidor; la suite debe comprobar los valores semánticos, no comparar texto incidental.

## Estado de las puertas de seguridad

- Confirmar en Supabase API Settings que `private` no está entre los esquemas expuestos por la Data API. La consulta SQL de solo lectura no pudo verificar esa configuración.
- La candidata concreta fue revisada antes de la autorización; la migración original en `migrations/` se conserva intacta para trazabilidad.
- La candidata y la suite fueron ejecutadas bajo autorización expresa solo en el proyecto aislado. No volver a aplicarlas como parte de esta evaluación.
- La restauración del respaldo no se ha probado; requeriría destino separado y autorización propia.
- Nota histórica: el MCP permaneció de solo lectura durante algunas consultas; la PoC se ejecutó después bajo autorización específica. Este documento no autoriza nuevas escrituras.

## Registro histórico de actualización local previo a la ejecución, 2026-10-16

La correlación en las policies públicas de unidades y espacios se corrigió en la migración local y en la copia de revisión; se probó en la instancia PostgreSQL de evaluación como parte de la suite confirmada. El detalle y el estado del respaldo están en [`README.md`](README.md).

El respaldo pre-PoC se conserva fuera del repositorio con ACL privada, checksum confirmado y listado `pg_restore` legible. Su encabezado muestra 566 entradas TOC y el listado 559 objetos numerados. No se explica aún esa discrepancia. La restauración no fue probada; no hay autorización de escritura ni se abrió canal MCP de escritura.

La comprobación posterior confirmó el helper `SECURITY DEFINER` dentro de `private`, propietario `postgres`, `search_path` vacío, y `USAGE`/`EXECUTE` limitados a `authenticated`; la suite comprobó su uso en las policies y denegación directa a `anon`. `private` fuera de Data API sigue siendo una verificación manual pendiente. No se actualizó la migración original ni se autoriza su repetición.

## Ajuste RLS de lectura propia, 2026-10-16

La candidata vigente evita leer `ubicate_poc_properties.owner_id` mediante subqueries ejecutados como `authenticated`: las policies de espacios y de lectura/actualización de inmuebles delegan la comprobación al helper `SECURITY DEFINER`; disponibilidad resuelve la unidad asociada y pasa su `property_id` al helper. Se mantiene sin `SELECT` sobre `owner_id`. Las policies de INSERT/UPDATE conservan `owner_id = auth.uid()` en `WITH CHECK` sobre la fila propuesta, y la policy de INSERT tiene privilegio de inserción de esa columna. La suite incluye accesos propios positivos y denegaciones cruzadas para filas de borrador y disponibilidad no pública.

La suite PostgreSQL confirmó el comportamiento descrito en esta sección, incluidos accesos propios y denegaciones cruzadas. La evidencia vigente, la limitación de `pgrst.db_schemas` y el alcance SQL están en el `README.md` del paquete.
