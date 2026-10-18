# Verificación de recuperación del baseline

**Fecha:** 2026-10-16, 23:40 COT
**Proyecto fuente:** `ubicate-f01h00-pruebas` (`ivzjijagahkczdghoqkz`)
**Alcance:** restauración local selectiva de los seis objetos de datos de la PoC.

## Archivo de origen

- Ruta: `%LOCALAPPDATA%\Ubicate\F01-H00\backups\auth-baseline-20261016-231105\ubicate-f01h00-before-auth-tests.dump`
- Tamaño: 639.718 bytes.
- Atributo: EFS `Encrypted`; se mantuvo cifrado y no se cambiaron ACL o certificados.
- SHA-256 medido desde el proceso autorizado: `711DA57ADA40954174225612F4581FEB3F5C00C039672B96239ECC5A17C4EFB2`.
- `pg_restore --list` 17.11: código 0; 1.393 entradas.

## Entorno aislado

Se utilizó Docker Desktop 29.8.2 y la imagen [`postgis/postgis:17-3.5`](https://hub.docker.com/r/postgis/postgis), digest `sha256:01a6a70e41e6c4467c8f55f6063555ed72db2d6662cd0d571040d42eadaeb6f6`. El servidor de la imagen reportó PostgreSQL 17.5 y PostGIS 3.5.2. La base fuente reportó PostgreSQL 17.11 y PostGIS 3.3.7; por tanto, es una comprobación de restauración lógica con la misma versión mayor de PostgreSQL, no una reproducción binaria exacta. El formato de archivo también fue leído por `pg_restore` 17.11 del host.

El contenedor tenía nombre único `ubicate-f01h00-restore-2ba3c314f0`, red `none`, sin puertos publicados, un montaje de dump de solo lectura y `PGDATA` en `tmpfs`. Se usó autenticación `trust` únicamente dentro del contenedor aislado sin conectividad; no se usó una contraseña. El contenedor y el tag de imagen descargado se eliminaron al terminar. No se inspeccionaron, detuvieron ni modificaron otros contenedores.

## Restauración ejecutada

En una base local nueva `ubicate_restore` se creó el esquema `extensions` y PostGIS 3.5.2. Con `pg_restore --exit-on-error --no-owner --no-acl` se restauraron desde el archivo 25 entradas TOC asociadas exclusivamente a las seis tablas `ubicate_poc_*`: definición, datos, índices y restricciones. No se cargaron políticas RLS ni el helper; la prueba mide recuperabilidad del esquema y datos principales.

Resultado: `pg_restore` código 0. Las consultas posteriores confirmaron:

| Tabla | Filas restauradas |
|---|---:|
| `ubicate_poc_advertisers` | 2 |
| `ubicate_poc_properties` | 3 |
| `ubicate_poc_publication_status` | 3 |
| `ubicate_poc_units` | 4 |
| `ubicate_poc_shared_spaces` | 3 |
| `ubicate_poc_availability` | 4 |

También coincidieron los tres títulos y sectores ficticios (`Casa de prueba A` / Centro, `Casa de prueba B Norte` / Norte, `Casa de prueba B Sur` / Sur), los cuatro precios `480000`, `600000`, `650000`, `720000`, y los estados (2 `published`, 1 `draft`). Las tres ubicaciones restauradas conservaron SRID 4326 y pudieron convertirse con PostGIS a sus puntos ficticios esperados.

## Alcance y conclusión

La restauración acredita que el dump es legible y que las seis tablas, restricciones, índices y datos persistentes de la PoC pueden recuperarse en un PostgreSQL 17 con PostGIS. Esto cubre el baseline de datos que la prueba Auth añadirá y protegerá.

No se probó la restauración íntegra de toda la base Supabase. El dump enumera extensiones `pg_stat_statements`, `pgcrypto`, `postgis`, `supabase_vault` y `uuid-ossp`; la imagen estándar elegida no contiene `supabase_vault`, y ofrece PostGIS 3.5.2 en vez de 3.3.7. Se omitieron deliberadamente objetos no pertenecientes a las seis tablas, incluidos esquemas gestionados por Supabase, roles globales, políticas RLS, helper y datos de `auth.users`. No se interpreta esa incompatibilidad de plataforma como corrupción del archivo.

**Evaluación para F01-H00:** la restauración está suficientemente acreditada para iniciar la PoC acotada de identidades temporales y filas paralelas, porque los fixtures base se recuperaron desde el dump y no hay usuarios de prueba preexistentes esperados. No certifica recuperación integral de un proyecto Supabase ni reemplaza una prueba de restauración completa antes de producción.

## Estado del proyecto remoto después de restaurar

No se ejecutó ninguna escritura remota durante esta verificación. La relectura por `supabase_ubicate` confirmó PostgreSQL 17.11, PostGIS 3.3.7, las seis tablas ordinarias con RLS, 31 políticas, helper en `private` con propietario `postgres`, `SECURITY DEFINER`, `search_path` vacío y los privilegios previstos, además de recuentos persistentes 2/3/3/4/3/4. `transaction_read_only=on`.

El Dashboard mostró organización `Ubicate-Evaluacion-F01H00` en plan Free y la lista Auth indicó `Total: 10 users (estimated)`. Una estimación visual no proporciona el inventario exacto. El ejecutor registrará en memoria el inventario real de IDs, sin emails ni IDs en el log; solo creará dos direcciones sintéticas `.invalid` si no existe colisión y comprobará que el inventario vuelva exactamente al conjunto inicial al limpiar.

El ejecutor temporal de la PoC Auth pasó el análisis sintáctico de PowerShell 7, pero no se ejecutó contra Supabase. Su código se excluye de la instantánea pública por ser un harness operativo temporal; las pruebas esenciales posteriores se ejecutaron desde la página HTML local con clave publicable y JWT de usuario, según el [informe vigente](README.md#repetición-authjwtrls-2026-10-17). No se debe utilizar el antiguo harness que solicitaba `service_role`.
