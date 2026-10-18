# PoC Auth + Data API + RLS

**Estado vigente, 2026-10-17:** las pruebas esenciales Auth/JWT/Data API/RLS A/B pasaron con JWT auténticos, incluidas lectura propia, aislamiento cruzado y modificación temporal autorizada con reversión. La evidencia vigente está en [repetición Auth/JWT/RLS](#repetición-authjwtrls-2026-10-17). La restauración selectiva de las seis tablas y datos PoC en un contenedor local quedó documentada en [restauracion-respaldo.md](restauracion-respaldo.md); no es un restore integral de Supabase. Los primeros párrafos y ejecuciones fallidas que siguen son antecedentes históricos y no describen el estado actual. No se deben volver a ejecutar los harnesses temporales.

## Propósito

Extender la evidencia de la PoC PostgreSQL/PostGIS/RLS ya confirmada con una evaluación acotada de Supabase Auth real y solicitudes HTTP a la Data API, conservando los datos ficticios base y probando controles positivos y negativos. El resultado será evidencia para la evaluación arquitectónica, no selección de Supabase ni implementación del MVP.

## Documentos

- [Spec de esta propuesta](spec.md)
- [Matriz de pruebas HTTP y Auth](matriz-pruebas.md)
- [Plan de preparación, ejecución y reversión](plan.md)
- [Riesgos, condiciones y decisiones pendientes](riesgos-decisiones.md)
- [Tareas verificables](tasks.md)

## Base verificada y diferencias documentales

La consolidación de la PoC PostgreSQL/PostGIS/RLS reporta migración aplicada, fixtures ficticios persistentes, 31 políticas y suite SQL `CONFIRMED` con `ROLLBACK`. El archivo de suite usa `SET LOCAL ROLE` y claims configurados con `set_config`; por ello valida el comportamiento SQL bajo identidades simuladas, no tokens emitidos por Supabase Auth ni solicitudes HTTP.

Se corrigió el resumen vigente de `poc-postgis-rls/README.md` para reflejar migración, fixtures y suite confirmados. Se conservaron las entradas históricas de preflight para mantener la trazabilidad. Esta propuesta toma como base la confirmación de dirección y la evidencia posterior revisada.

El candidato SQL otorga lectura pública de `public_location`, cuyo valor actual es un punto ficticio exacto. Esto no demuestra que publicar coordenadas exactas sea aceptable para inmuebles reales. La precisión y el momento de exposición requieren decisión humana antes de incorporar ubicaciones reales. No se propone alterar la política ni el esquema aquí.

## Alcance de la evaluación

- Solicitudes HTTP anónimas y evaluación de casos de sesión/JWT solo si pueden prepararse con identidad autorizada sin cambiar ajustes ni eludir confirmación.
- REST de la Data API con clave publicable y bearer JWT real, comprobando cuerpo, filas visibles, efecto de escrituras, encabezados y errores SQL/RLS.
- Roles públicos, anunciante A, anunciante B y administrador con procedencia de autorización confiable.
- Datos Auth de prueba vinculados por UUID sin cambiar los fixtures base.
- Integridad antes/después, permisos del helper, límites gratuitos y evidencia saneada sin secretos.

Quedan fuera la implementación de producto, cambios a políticas o permisos, correo externo, compras, billing, despliegue y pruebas con datos reales.

## Base oficial consultada

Consulta documental realizada el 2026-10-16. Las condiciones de cuenta y proyecto no se deducen de las páginas públicas y deben comprobarse de nuevo antes de cualquier ejecución.

- [Supabase Auth: correo SMTP](https://supabase.com/docs/guides/auth/auth-smtp): SMTP predeterminado restringido a correos de integrantes autorizados del equipo, límite publicado actualmente de 2 mensajes por hora y servicio best-effort sin SLA. No es adecuado como correo productivo.
- [Supabase Password Auth](https://supabase.com/docs/guides/auth/passwords): confirmación de correo está activada por defecto en proyectos alojados; confirmación y recuperación requieren entrega de correo. La documentación ofrece Mailpit para desarrollo local mediante Supabase CLI.
- [Supabase Free pricing](https://supabase.com/pricing): muestra USD 0/mes, 50.000 MAU, 500 MB de base, 1 GB Storage, cuotas de egress, sin backups automáticos, pausa por inactividad después de una semana y 1 hora de retención de Auth Audit Logs. Son cuotas publicadas sujetas a cambios; no certifican el estado de facturación o elegibilidad de esta cuenta.
- [Securing your API](https://supabase.com/docs/guides/api/securing-your-api): grants PostgreSQL deciden si el rol alcanza el objeto y RLS decide las filas; un grant ausente produce `42501`, mientras una policy puede filtrar filas. Los defaults de grants están cambiando para proyectos nuevos, así que deben inspeccionarse en el proyecto y no asumirse.
- [API keys](https://supabase.com/docs/guides/getting-started/api-keys): claves publicables son identificadores de aplicación públicos, no secretos; claves secret/service_role omiten RLS y solo deben estar en entornos servidor controlados. Supabase documenta una transición de `anon`/`service_role` hacia publishable/secret durante 2026; el tipo de clave a usar debe confirmarse en el proyecto en el momento de la prueba.
- [Supabase Auth users](https://supabase.com/docs/guides/auth/users): `user_metadata` es modificable por el usuario y no debe usarse para autorización; `app_metadata` no es modificable mediante la API normal del usuario. Las policies actuales usan `app_metadata.ubicate_role`; sus cambios requieren operación de confianza y renovación del JWT para reflejarse.
- [Supabase PostGIS Geo queries](https://supabase.com/docs/guides/database/extensions/postgis): documenta funciones de base invocables mediante RPC para búsquedas por geometría. La PoC actual ejecuta búsquedas geográficas en SQL, pero no contiene una RPC de búsqueda HTTP aprobada. Exponer una RPC sería un cambio de esquema/permisos a revisar por separado.

## Decisión de alcance sobre correo, 2026-10-16

Dirección decidió dejar fuera de F01-H00 las pruebas que envían correo real de confirmación y recuperación. No se requiere incorporar las direcciones de prueba al equipo de Supabase ni configurar SMTP externo para esta evaluación. La matriz marca esos casos como diferidos y no bloqueantes para continuar el análisis arquitectónico. La entrega real de correo, confirmación y recuperación no queda validada y deberá probarse antes de operar con usuarios reales. No se cambió esta configuración ni se enviaron mensajes.

## Estado histórico al 2026-10-16

### Preflight remoto Auth/Data API, 2026-10-16

Comprobación de solo lectura mediante el MCP `supabase_ubicate` y revisión visual del dashboard del proyecto `ivzjijagahkczdghoqkz`. El MCP continúa en `read_only=true`; no se crearon usuarios, no se enviaron correos, no se modificaron datos ni se cambió la configuración.

- Proyecto `ubicate-f01h00-pruebas`, plan Free visible en el dashboard; base `postgres`; transacción de lectura confirmada.
- PostGIS 3.3.7 está instalado en `extensions`.
- Las seis tablas PoC exactas existen como tablas ordinarias y tienen RLS habilitado; se observaron las 31 políticas esperadas.
- El helper `private.ubicate_poc_is_property_owner` mantiene propietario `postgres`, `SECURITY DEFINER`, `search_path` vacío, `anon` sin `USAGE`/`EXECUTE` y `authenticated` con el permiso previsto.
- Los fixtures existentes conservan los recuentos 2 anunciantes, 3 inmuebles, 3 estados de publicación, 4 unidades, 3 espacios comunes y 4 disponibilidades.
- Dashboard Data API: `public` y `extensions` figuran entre los esquemas expuestos; `private` no. Ninguna de las seis tablas PoC ni la función figuran actualmente expuestas (0/6 tablas, 0/1 función).
- La consulta de catálogo para `pgrst.db_schemas` devolvió `NULL`; la exposición se comprobó visualmente en Data API Settings.
- Dashboard Authentication > Sign In / Providers: registro de nuevos usuarios habilitado, confirmación de correo habilitada; proveedor Email habilitado. No se cambiaron ajustes. La pantalla de usuarios mostró una lista en carga; no se inspeccionaron identidades ni se modificaron usuarios existentes.
- Organización > Team: un único integrante visible. Las dos direcciones proporcionadas para esta PoC no aparecen como integrantes. El formulario de invitación solo ofreció Owner, Administrator y Developer; Developer puede borrar datos, usuarios, archivos y Edge Functions. No se envió ninguna invitación porque no se ofreció el rol de solo lectura autorizado. El formulario quedó cerrado y el equipo no cambió.
- Security Advisor consultado el 2026-10-16: 0 errores, 0 advertencias y 0 sugerencias informativas.
- El dump existente corresponde al respaldo anterior a la PoC inicial, no al baseline posterior con fixtures. El intento de lectura desde esta sesión recibió `Access denied`; no se abrió ni modificó. No es evidencia suficiente para respaldar el baseline Auth/Data API actual, y el cifrado en reposo del volumen sigue sin confirmarse.

### Backup baseline de Auth, 2026-10-16 23:11 (hora local reportada)

El operador ejecutó un lanzador PowerShell temporal en una sesión visible. El archivo reportó `DUMP_EXIT_CODE=0`, `PG_RESTORE_LIST_EXIT_CODE=0`, 1.393 entradas, 639.718 bytes y SHA-256 `711DA57ADA40954174225612F4581FEB3F5C00C039672B96239ECC5A17C4EFB2`; indicó `EFS_ENCRYPTED=true` y `RESTORE_TESTED=false`. Ruta local: `%LOCALAPPDATA%\Ubicate\F01-H00\backups\auth-baseline-20261016-231105\ubicate-f01h00-before-auth-tests.dump`. El lanzador y el dump no se incluyen en la instantánea pública.

En la inspección inicial, esta sesión recibió `Access denied` por ejecutarse con otra identidad Windows. Después de obtener acceso autorizado de solo lectura, se comprobó SHA-256 y se restauraron las seis tablas de la PoC y sus datos. La restauración selectiva no cubre roles globales, configuración Dashboard, bytes de Storage, `auth.users`, políticas RLS ni todos los esquemas gestionados. Ver [restauracion-respaldo.md](restauracion-respaldo.md). EFS depende de la identidad/certificado Windows local y no es independiente ante la pérdida de esa identidad.

### Revalidación remota de solo lectura, 2026-10-16

Mediante exclusivamente `supabase_ubicate`, la consulta reportó base `postgres`, rol `supabase_read_only_user`, `transaction_read_only=on`, PostgreSQL 17.11 y PostGIS 3.3.7 en `extensions`. Se confirmaron los conteos persistentes 2/3/3/4/3/4, títulos y sectores originales, dos estados `published` y uno `draft`, además de helper con propietario `postgres`, `SECURITY DEFINER`, `search_path` vacío y ACL `postgres=X/postgres,authenticated=X/postgres`. `list_tables` mostró RLS habilitado en las seis tablas y precios ficticios esperados. Una consulta exploratoria falló por usar la columna inexistente `monthly_price`; la consulta corregida usó `monthly_price_cop` y fue solo lectura. No se hicieron escrituras.

### Verificación anónima HTTP de solo lectura, 2026-10-16

Se hicieron solicitudes GET desde el origen del proyecto usando solo la clave publicable en `apikey`, sin bearer ni clave secreta. La página estaba en `https://ivzjijagahkczdghoqkz.supabase.co`; no se cambiaron ajustes, grants ni policies. El MCP `supabase_ubicate` confirmó por separado que la base consultada era `postgres` y la lectura de privilegios se limitó a las tablas PoC.

| Endpoint | Resultado observado | Lectura acotada |
|---|---|---|
| `ubicate_poc_advertisers` | HTTP 401, SQLSTATE `42501` | Acceso anónimo denegado por privilegio de tabla. |
| `ubicate_poc_properties` | HTTP 200, 2 filas | Solo columnas concedidas; ambas filas visibles corresponden a propiedades publicadas. |
| `ubicate_poc_publication_status` | HTTP 200, 2 filas | Solo estados `published`; borradores no visibles. |
| `ubicate_poc_units` | HTTP 200, 3 filas | Filas asociadas a propiedades publicadas según la policy vigente. |
| `ubicate_poc_shared_spaces` | HTTP 200, 2 filas | Filas asociadas a propiedades publicadas según la policy vigente. |
| `ubicate_poc_availability` | HTTP 200, 2 filas | Filas disponibles asociadas a propiedades publicadas según la policy vigente. |

La comprobación adicional de privilegios confirmó que `anon` no tiene SELECT de tabla sobre properties, pero sí SELECT por columna en los campos públicos necesarios (`id`, `title`, entre otros); para advertisers no tiene SELECT. Esto explica la diferencia respecto al indicador visual 0/6 del panel: ese indicador no predice por sí solo el resultado de cada endpoint cuando existen grants por columna previos. No se activó la opción de exposición del dashboard ni se alteraron permisos. La prueba no ejercitó JWT real, escrituras, correo, enumeración entre cuentas Auth ni geobúsqueda HTTP.

Una primera consulta exploratoria solicitó la columna `id` en `ubicate_poc_publication_status`, donde la clave correcta es `property_id`; la API respondió HTTP 400 / `42703`. Se corrigió la selección y la consulta válida posterior devolvió 2 estados publicados. El error de columna no cambió datos ni permisos.

El intento de realizar estas solicitudes desde PowerShell/curl de esta sesión falló durante la negociación TLS del cliente de Windows (`SEC_E_NO_CREDENTIALS`). No se relajó TLS; las lecturas HTTP anteriores se completaron desde el navegador con HTTPS. La salida se redujo a estado HTTP, conteos y categorías de estado para no registrar filas ni identificadores.

**Estado de Data API:** el panel continúa mostrando 0/6 tablas y `private` permanece fuera de los esquemas expuestos. Sin embargo, las solicitudes anónimas de solo lectura anteriores alcanzaron los seis endpoints: cinco de seis devolvieron filas, de acuerdo con los GRANT por tabla/columna existentes y filtradas por RLS; `advertisers` fue denegado. Por tanto, no se requiere cambiar la exposición del panel para documentar este subconjunto HTTP, y no se tocó el ajuste. La matriz completa Auth/JWT sigue sin ejecutar: requiere identidades de prueba y escrituras temporales controladas con un backup/baseline actual verificable. La autorización previa de exposición temporal no se usó. Las pruebas de correo real quedaron diferidas fuera de F01-H00 por decisión de dirección.

**Correo real:** la limitación del SMTP predeterminado y los roles disponibles siguen documentados como condiciones del proveedor, pero ya no bloquean F01-H00 por decisión de dirección. No se enviaron invitaciones ni mensajes, no se añadieron miembros y no se cambió la configuración Auth. Confirmación y recuperación real quedan pendientes para una fase previa a usuarios reales.

### Preflight de solo lectura tras autorización A/B, 2026-10-16

Dirección respondió «sí autorizo» al paquete de prueba autenticada A/B y acceso cruzado descrito en la conversación, limitado al proyecto de evaluación y condicionado a respaldo y reversión. Este permiso no cambia Auth, habilita correo, otorga permisos de administrador ni amplía el alcance a otros proyectos. No se han iniciado escrituras.

Se consultó exclusivamente `supabase_ubicate`, configurado para `ivzjijagahkczdghoqkz` en solo lectura. `current_database()` devolvió `postgres`; `current_user` y `session_user` devolvieron `supabase_read_only_user`; la versión fue PostgreSQL 17.11 y `transaction_read_only=on`. El catálogo mostró las seis tablas esperadas como tablas ordinarias (`relkind=r`), todas con RLS, y 31 políticas. PostGIS 3.3.7 está instalado en `extensions`. El helper `private.ubicate_poc_is_property_owner` existe como `SECURITY DEFINER`, pertenece a `postgres`, fija `search_path` vacío y su ACL observada es `{postgres=X/postgres,authenticated=X/postgres}`. Los recuentos persistentes son 2 anunciantes, 3 inmuebles, 3 estados, 4 unidades, 3 espacios comunes y 4 disponibilidades.

La lectura de `current_setting('pgrst.db_schemas', true)` devolvió `NULL`; esa sesión no permite verificar con ello la lista efectiva de esquemas de Data API. La revisión previa del dashboard registró `private` como no expuesto; debe confirmarse manualmente en dashboard antes de nuevas escrituras, si el panel o su configuración pudieron cambiar.

El dump local inspeccionado es el archivo pre-PoC `ubicate-f01h00-before-poc-20261016.dump`, con SHA-256 `7905DD49059109D2F5E16E59B958B69A1EA39DB5D37C89F119D3782155F96928`. `pg_restore --list` 17.11 terminó con código 0 y el TOC contiene 559 entradas; no contiene objetos `ubicate_poc_*`. Por ser anterior a la migración y los fixtures, **no sirve como respaldo/baseline actual** para este paquete. No se intentó restaurarlo. La protección/cifrado del archivo tampoco está certificada por esta comprobación.

**Resultado del preflight:** lectura de estructura y recuentos conforme; precondición de backup/baseline actual protegido no satisfecha. No crear identidades ni escribir datos hasta producirlo. Esa operación requiere introducir la contraseña PostgreSQL mediante un prompt interactivo local; no hay credenciales disponibles en esta sesión y no se solicitaron ni guardaron.

**Intento de backup del 2026-10-16, 23:08 local:** se detuvo con `pg_dump_exit_code=1` antes de conectarse. libpq interpretó las barras invertidas de la ruta del CA dentro del conninfo como escapes y buscó `%LOCALAPPDATA%\Temp\...`, que no existe. El script se corrigió para convertir esa ruta a separadores `/`. El archivo generado por el intento fallido mide 0 bytes, está cifrado por EFS y no es un backup válido; su eliminación desde el sandbox fue denegada por ACL, por lo que se conservó intacto y marcado como inválido. El script corregido crea una carpeta nueva con marca de tiempo al volver a ejecutarse.

El lanzador temporal de backup validaba PostgreSQL 17.11 y el checksum del CA conocido, TLS `verify-full`, cifrado EFS previo y listado/checksum del dump; no restauraba el dump. El archivo ejecutable no se incluye en la instantánea pública y las instrucciones para volver a lanzarlo se retiran de este registro. Esta nota histórica no es autorización para generar otra copia.

El archivo custom pretende cubrir la base PostgreSQL completa, incluidos esquemas/datos y objetos de base de datos accesibles a `pg_dump`. No cubre roles globales del clúster, ajustes de organización/proyecto del Dashboard ni bytes de objetos de Storage. `pg_restore --list` solo verifica el listado/legibilidad del archivo, no una restauración integral. La protección EFS depende de la cuenta/clave del Windows donde se generó y no es una copia independiente apta para recuperación ante pérdida de esa cuenta.

### Revisión local de consistencia con el SQL vigente

La matriz se contrastó con la migración privada y fixtures existentes. La relación entre UUID de Auth y los UUID de las tablas es una convención de prueba, ya que `ubicate_poc_advertisers.id` y `ubicate_poc_properties.owner_id` no tienen FK hacia `auth.users`. Además, el grant de INSERT para `ubicate_poc_publication_status` no permite por sí solo crear estados: la policy vigente reserva esa operación al administrador. El anunciante tampoco tiene DELETE sobre properties ni sobre publication status. Estos casos ahora se registran como resultados negativos o límites funcionales esperados; no se cambió SQL ni se propone eludir las policies.

Las búsquedas geoespaciales HTTP siguen bloqueadas por falta de RPC aprobada. Las pruebas de asignación de administrador requieren mecanismo confiable para `app_metadata`, no `user_metadata`. Todos estos puntos quedan pendientes de decisión de diseño antes de una prueba remota Auth/Data API.

La preparación documental y las lecturas anónimas HTTP están completadas. Se comprobó restauración selectiva de las tablas y los datos de la PoC. El ejecutor PowerShell 7 está preparado y pasó análisis sintáctico. La pantalla Auth indicó diez usuarios estimados; el ejecutor compara el inventario real sin guardar emails/IDs y detiene la prueba ante colisión de las cuentas sintéticas. Las pruebas JWT/HTTP siguen pendientes de ejecución con el `service_role` introducido por entrada oculta en PowerShell visible. No se enviarán correos. La geobúsqueda HTTP permanece fuera del alcance por falta de RPC aprobada. El hito sigue abierto y ninguna arquitectura o proveedor queda seleccionado.

## Relación con aceptación de F01-H00

Esta PoC, si se aprueba y pasa, aportaría evidencia delimitada para parte del **AC-03** (Auth real y acceso cruzado HTTP). No satisface por sí sola todo AC-03 ni los demás criterios del hito. **AC-04** requiere backup independiente y restauración real; AC-05 fotos; AC-06 geografía Tunja y fallback; AC-07 resiliencia; AC-08 escenarios/cuotas/costos; AC-09 términos, privacidad y condiciones; AC-01/02 trazabilidad y comparación de arquitecturas; AC-10 recomendación/decisión humana. Esos resultados no se infieren de esta propuesta ni de la suite SQL confirmada. H00 permanece ABIERTO.

### Diagnóstico del HTTP 401, 2026-10-17

El log EFS `auth-data-api-20261017-110200.log` registra `auth-health-project-endpoint | FAIL | HTTP 401` y `remote_mutations_started=False`. El chequeo ocurrió antes del inventario Auth, la creación de identidades y cualquier escritura de filas. El fallo no modificó el proyecto. El log no contiene encabezados ni cuerpos HTTP.

La URL se forma con el ref fijo del proyecto y la ruta `/auth/v1/health`; `Invoke-Api` añade el encabezado `apikey` y no envía bearer en ese GET. La forma de la URL y del encabezado es coherente con la API de Supabase, que requiere una API key por solicitud ([documentación de API keys](https://supabase.com/docs/guides/getting-started/api-keys)). Una comparación de huellas entre la clave publicable fijada en el ejecutor y la única clave `sb_publishable_` visible actualmente en Settings > API Keys no coincidió. Esto demuestra que el valor fijado no coincide con el que muestra ahora el dashboard; sin un cuerpo de respuesta ni un historial de rotación, no permite determinar si fue incorrecto desde el inicio o si se rotó/revocó después.

El ejecutor ya no contiene una clave publicable fija: la solicita en memoria por entrada oculta y comprueba primero el endpoint. Solo si obtiene HTTP 200 solicita `service_role`. Ante HTTP 401 registra una categoría saneada, nunca el cuerpo. No se modificaron configuración, claves, RLS, permisos ni servicios.

El proceso PowerShell de esta sesión no pudo completar una petición HTTPS por un error TLS de Windows; no se desactivó la validación. La comprobación segura del endpoint y la reanudación de la PoC deben hacerse desde PowerShell 7 visible. El respaldo EFS se revalidó localmente: 639.718 bytes, SHA-256 esperado. La restauración selectiva efectiva ya está documentada en [restauracion-respaldo.md](restauracion-respaldo.md).

### Diagnóstico del HTTP 400 en publication_status, 2026-10-17

El log EFS `auth-data-api-20261017-155007.log` contiene `PASS auth-health-project-endpoint`, `PASS auth-baseline-snapshotted-without-disclosing-users`, el fallo HTTP 400 al leer `ubicate_poc_publication_status` y `remote_mutations_started=False`. La ejecución se detuvo durante las lecturas del baseline, antes de crear identidades o filas. El archivo no guarda el cuerpo JSON de PostgREST, por lo que el código y mensaje históricos no pueden recuperarse de ese log.

La consulta de solo lectura a `information_schema.columns` en el proyecto autorizado confirmó las columnas `property_id` (uuid, NOT NULL), `status` (text, NOT NULL) y `updated_at` (timestamptz, NOT NULL). El ejecutor solicitaba `select=property_id,status&order=id.asc` antes de reemplazar el filtro por `order=property_id.asc`; la primera petición inválida causaba el 400. Se corrigió para escoger el orden correcto antes de enviar un único GET.

La ejecución reportada por dirección el 2026-10-17 confirmó el diagnóstico de solo lectura: `HTTP 400`, PostgREST `42703`, `column ubicate_poc_publication_status.id does not exist`. La barrera local rechazó la credencial legacy ingresada porque conserva el marcador de emisión conocido de la credencial comprometida, antes de iniciar una llamada privilegiada. Log reportado por el operador: `auth-data-api-20261017-161616.log`, SHA-256 `4BDC9A9B4626A868A9E9B9B07B9DE9C7B4CD47388EDDFE62917D490C186D2A7E`; no se revalidó localmente en esta sesión.

El ejecutor local se actualizó para usar una nueva API Secret `sb_secret_` en el encabezado `apikey` para solicitudes privilegiadas, y reservar `Authorization: Bearer` para JWT de usuario. Supabase documenta que las claves API Secret no son JWT y deben enviarse en `apikey`; tienen acceso privilegiado equivalente a `service_role` y omiten RLS ([API keys](https://supabase.com/docs/guides/getting-started/api-keys), [API routes](https://supabase.com/docs/guides/api/creating-routes)). Antes de solicitarla, el ejecutor exige que el operador confirme haber desactivado la clave legacy expuesta en Settings > API Keys. Esa confirmación es humana, no comprueba remotamente el estado de revocación. No se proporcionó ni utilizó una nueva API Secret en esta sesión.

El error histórico con `order=id.asc` queda registrado como evidencia; el ejecutor actualizado no repite esa solicitud inválida y verifica directamente la consulta válida con `order=property_id.asc`. Según la salida compartida por dirección, no hubo llamada privilegiada ni escritura en esta ejecución. La continuación requiere desactivar la clave comprometida en el dashboard y volver a ejecutar el instrumento actualizado con claves actuales del mismo proyecto.

Identificadores de evidencia: SHA-256 del log original `0DE86555C533BD7BEE1E4AE23D6C4EA5F0D94C321A18CE8F5FA506F525EC3740`; SHA-256 del ejecutor corregido `7A0E5814269360B756B50B8D2B9913C833D13CC41E458B4CDE36A8F2B4D1AAE4`.

El ejecutor vigente dejó de repetir la petición inválida y realiza una lectura válida con `order=property_id.asc`. Verificación local: parseo PowerShell mediante `[scriptblock]::Create` aprobado, `git diff --check` aprobado. SHA-256 del ejecutor vigente: `69557CDECEC447E94050E4457F0C03F0B955F981D2C3A3E1D0046E6ED7BB8BC2`. No se ejecutó el script ni se hicieron solicitudes remotas durante esta corrección.

### Preparación de inmuebles Auth A/B mediante MCP Ubícate, 2026-10-17

**Resultado: dos propiedades y dos estados `draft` creados y verificados.** Se usó exclusivamente el MCP conectado `supabase_ubicate` (`mcp__supabase_ubicate__list_tables` y `mcp__supabase_ubicate__execute_sql`). Este conector sí respondió con lectura y escritura. La comprobación SQL reportó base `postgres`, rol `postgres`, y dos usuarios Auth para los UUID objetivo. No se usaron las herramientas genéricas `mcp__codex_apps__supabase_*` ni se buscó otro acceso. El MCP no ofrece en esta sesión una herramienta de metadatos de proyecto que devuelva el project ref; la asociación del conector con el proyecto esperado se tomó de su configuración/nombre y de los datos Auth/PoC encontrados. La verificación SQL por sí sola no demuestra el ref.

#### Preflight y baseline

`list_tables(schemas: ["public"], verbose: true)` enumeró las seis tablas PoC con RLS habilitado y las columnas, defaults, checks, PK/FK. `ubicate_poc_properties` tiene `id` UUID con `gen_random_uuid()`, `owner_id`, `title` (1-120 caracteres), `sector` (1-60), `public_location` geography y `created_at`; `ubicate_poc_publication_status` referencia `property_id`, usa `status` con default `draft` y check en `draft/published/paused`. No se modificó esquema ni políticas.

Las lecturas previas a escritura dieron: Auth objetivo 2; anunciantes A/B 2 presentes; UUID reservados `20000000-0000-4000-8000-000000000001` y `...0002` libres; conteos de baseline: advertisers 4, properties 3, publication_status 3, units 4, shared_spaces 3, availability 4. Se observaron los tres inmuebles originales `10000000-0000-4000-8000-000000000001` a `...0003` y cuatro anunciantes, incluidos los dos de Auth A/B y los dos ficticios originales. Estos cuatro anunciantes permanecieron intactos.

Consultas de preflight ejecutadas por `execute_sql`:

1. `select current_database(), current_user` y conteo de `auth.users` para A/B más conteos de advertisers, properties, units y publication_status.
2. Conteos de cada una de las seis tablas PoC.
3. Lectura de `id, owner_id, title, sector, status` de propiedades con su estado.
4. Conteo de anunciantes con IDs A/B.
5. Conteo de colisión para los dos UUID reservados.

#### Escritura

Una sentencia SQL con CTE insertó únicamente dos filas en `public.ubicate_poc_properties` y los dos registros relacionados en `public.ubicate_poc_publication_status`. Usó IDs deterministas, `ON CONFLICT (id) DO NOTHING` y `ON CONFLICT (property_id) DO NOTHING`, lo que permite repetir la misma inserción sin duplicar filas. Las ubicaciones son puntos sintéticos de Tunja. El resultado de la sentencia reportó `properties_inserted_now=2`, `statuses_inserted_now=2`.

| Propiedad | UUID | owner_id Auth | Sector | Estado |
|---|---|---|---|---|
| Alojamiento temporal Auth A | `20000000-0000-4000-8000-000000000001` | `7a9a8ef6-be8e-44fd-9d1b-439b3c4bb510` | Centro | draft |
| Alojamiento temporal Auth B | `20000000-0000-4000-8000-000000000002` | `28c82625-77f6-435b-bc38-43a0e2e1a91e` | Norte | draft |

#### Verificación independiente

Después de escribir se ejecutaron lecturas independientes:

- Propiedades por los dos UUID con `owner_id`, título, sector, estado y geometría WKT. Los propietarios coinciden con A/B y ambos estados son `draft`.
- Conteo de las seis tablas: advertisers 4, properties 5, publication_status 5, units 4, shared_spaces 3, availability 4.
- Relectura de los tres UUID originales y sus propietarios/títulos/sectores: coinciden con el baseline.
- Relectura de los cuatro anunciantes: los IDs y nombres coinciden con el baseline.
- Recuento de `auth.users` para A/B: 2.

La evidencia corresponde a lecturas/escrituras administrativas mediante MCP con rol `postgres`. No constituye prueba de RLS ni acceso HTTP autenticado. No se ejecutaron llamadas con JWT reales, ni se probaron lecturas/escrituras cruzadas con A/B. No se cambiaron anunciantes, los tres inmuebles originales, otros datos, esquema, RLS, GRANT, Auth o credenciales. No se borró ningún registro. No se ejecutaron pruebas adicionales de Auth porque esta preparación no proporcionó tokens de sesión.

### Intento previo bloqueado de preparación Auth A/B, 2026-10-17

**Resultado de ese intento: bloqueado por autorización del MCP; no hubo escrituras. El bloqueo se resolvió en la ejecución documentada en “Preparación de inmuebles Auth A/B mediante MCP Ubícate”.** En ese intento se había autorizado preparar dos alojamientos ficticios para las cuentas Auth A y B en el proyecto exclusivo `ivzjijagahkczdghoqkz`, conservando los anunciantes y tres inmuebles originales. Antes de modificar datos se verificaron las herramientas disponibles y se intentó identificar el proyecto, inspeccionar tablas y ejecutar una consulta SQL de solo lectura. Los tres llamados devolvieron el mismo error MCP `-32600: You do not have permission to perform this action`:

- `supabase_get_project({id: "ivzjijagahkczdghoqkz"})`
- `supabase_list_tables({project_id: "ivzjijagahkczdghoqkz", schemas: ["public"], verbose: true})`
- `supabase_execute_sql({project_id: "ivzjijagahkczdghoqkz", query: "select current_database() as database_name, current_user as role_name;"})`

El inventario de herramientas expuso `supabase_execute_sql`, `supabase_list_tables` y `supabase_get_project`, pero la autorización efectiva de los tres fue denegada. La causa verificable es que el MCP conectado no concede permiso para estas operaciones en la sesión actual; no es posible determinar desde aquí si el origen es configuración del conector, alcance de conexión o permisos del proyecto. No se buscaron accesos alternativos.

**Estado de datos:** UUID de alojamientos creados: ninguno. Conteos posteriores: no disponibles porque no se obtuvo acceso de lectura. No se intentaron inserciones, upserts ni otras escrituras. Por ello no se puede confirmar el destino, las tablas/restricciones ni la existencia actual de los anunciantes en este intento. Los anunciantes y los tres inmuebles originales no fueron objeto de ninguna operación por esta ejecución. No hubo prueba de RLS con JWT; las lecturas administrativas anteriores tampoco se interpretan como prueba de RLS.

**Cierre de la unidad:** pendiente de recuperar permiso MCP de lectura/escritura y repetir el preflight en el proyecto indicado. No hacer cambios de esquema, RLS, GRANT, Auth o credenciales como parte de esta preparación.

### Validación Auth + JWT + RLS con Chrome DevTools MCP, 2026-10-17

**Estado: BLOQUEADO antes de iniciar sesión o enviar solicitudes a Supabase.** Se revisaron `README.md`, autonomía supervisada, spec/plan/tasks/matriz de esta PoC, visión vigente y alcance MVP. El repo no contiene una aplicación ejecutable ni un harness web: es documental, con un script PowerShell previo no adecuado para esta prueba. Chrome DevTools MCP está disponible y `list_pages` mostró únicamente `about:blank`. No se instalaron dependencias, no se creó una interfaz, no se abrió un flujo de contraseña y no se enviaron solicitudes Auth/Data API.

La config local de Codex contiene el MCP de base de datos con `project_ref=ivzjijagahkczdghoqkz`; el MCP `supabase_ubicate` disponible en esta sesión ofrece SQL/listado de tablas, pero no una operación para obtener la clave publicable. La inspección de nombres de variables de entorno no encontró variables Supabase/anon/publishable. El ejecutor previo tampoco tenía la clave fija: requiere pedirla por prompt. El intento de lectura de claves con `mcp__codex_apps__supabase_get_publishable_keys({project_id: "ivzjijagahkczdghoqkz"})` devolvió `MCP error -32600: You do not have permission to perform this action`.

Este error ocurrió en la herramienta MCP genérica al obtener una clave, antes de una solicitud a Auth o Data API. **No es evidencia de fallo de RLS, GRANT, esquema expuesto o autenticación de las cuentas.** No se probó una conexión de API con `sb_publishable_`; no se usaron `sb_secret_`, `service_role` ni el rol `postgres` para casos de autorización. No se registraron contraseñas, sesiones, tokens o cabeceras sensibles. El ref aparece en la configuración MCP local, pero esta ejecución no validó mediante Data API ni API de administración el proyecto servido por la URL.

#### Matriz de verificación

| Caso | Esperado | Observado | Evidencia segura |
|---|---|---|---|
| Anónimo no ve drafts A/B | Cero filas privadas | NOT RUN | No hubo solicitud Data API; bloqueado por falta de clave pública disponible |
| A consulta propiedad A | Su propia fila visible | NOT RUN | No hubo login ni bearer |
| A consulta/modifica propiedad B | Sin lectura ni efecto cruzado | NOT RUN | No hubo solicitud; no se escribió ni revirtió nada |
| B consulta propiedad B | Su propia fila visible | NOT RUN | No hubo login ni bearer |
| B consulta/modifica propiedad A | Sin lectura ni efecto cruzado | NOT RUN | No hubo solicitud; no se escribió ni revirtió nada |
| Cambio permitido en fila temporal y reversión | Cambio visible para dueño y reversión confirmada por relectura | NOT RUN | Ninguna fila modificada en esta ejecución |

Los resultados conocidos de la preparación anterior se mantienen como baseline documental, no como evidencia RLS: los dos inmuebles temporales son UUID `20000000-0000-4000-8000-000000000001` (owner A) y `20000000-0000-4000-8000-000000000002` (owner B), ambos `draft`; la última verificación administrativa registró 4 advertisers, 5 properties, 5 publication_status, 4 units, 3 shared_spaces y 4 availability. Esta ejecución no los releyó ni alteró.

#### Pendientes de seguridad F01-H00

1. Resolver el HTTP 400 de Auth A/B sin cambiar configuración Auth; una reejecución requiere ingresar localmente la clave pública y credenciales válidas, nunca por chat.
2. Si se reanuda, regenerar una página efímera local, sin dependencias ni persistencia de sesión. DevTools debe inspeccionar únicamente resultados saneados y no guardar cuerpos/cabeceras.
3. Ejecutar la matriz de A/B con peticiones y relecturas, separando error de cliente/instrumento, Auth, `42501`/GRANT, filtrado RLS (`200 []`/cero filas) y configuración/exposición de Data API.
4. Probar modificación propia reversible sobre filas temporales, sin tocar propiedades originales, y confirmar reversión mediante nueva lectura. No borrar filas de prueba existentes: la limpieza destructiva requiere autorización expresa independiente según el plan vigente.
5. Completar los casos de expiración/refresh, claims no confiables, roles admin, abuso/rate limit, backup/restore y riesgos residuales. Correo real queda diferido; RPC geoespacial sigue pendiente de aprobación separada.

#### Transición a experiencia de búsqueda

La siguiente preparación de desarrollo funcional debe conservar el alcance MVP aprobado: exploración pública en Tunja, mapa y lista, filtros, detalle, unidades, disponibilidad y espacios comunes. La propuesta de siguiente paso técnico existente indica que seleccionar arquitectura y abrir un hito de implementación requieren decisión humana; F01-H00 sigue abierto y no hay stack/proveedor aprobado. Por tanto, esta validación no inicia código de producto. Tras completar la evaluación de seguridad y la decisión arquitectónica, preparar spec/plan/tasks del hito de búsqueda, con requisitos, datos sintéticos, aceptación, seguridad y verificaciones; solicitar únicamente las decisiones reservadas que falten antes de implementación.

### Resultado de ejecución en Chrome, 2026-10-17

Se ejecutó la página temporal anterior y se consultó exclusivamente el área de resultados sanitizados mediante Chrome DevTools MCP. No se inspeccionaron Network, cuerpos sin sanear, consola, contraseñas, tokens ni cabeceras.

| Caso | Resultado observado | Evidencia saneada |
|---|---|---|
| Anónimo consulta propiedad A draft | PASS esperado | `properties` HTTP 200, 0 filas; `publication_status` HTTP 200, 0 filas |
| Anónimo consulta propiedad B draft | PASS esperado | `properties` HTTP 200, 0 filas; `publication_status` HTTP 200, 0 filas |
| Inicio de sesión A | FAIL Auth | HTTP 400; no se obtuvo JWT; el sanitizer no conservó un código Auth clasificable |
| Inicio de sesión B | FAIL Auth | HTTP 400; no se obtuvo JWT; el sanitizer no conservó un código Auth clasificable |
| Lecturas propias, lecturas cruzadas, escrituras cruzadas y modificación reversible | BLOCKED, NOT RUN | No se ejecutaron porque faltaron JWT y el preflight de lecturas propias |

Los GET anónimos se enviaron al host fijado `ivzjijagahkczdghoqkz.supabase.co` con la clave publicable y sin bearer. El HTTP 200 con cuerpos de lista vacía muestra que esos endpoints no entregaron filas para los UUID de draft consultados. No se toma el status aislado como prueba. Los POST de login llegaron a Auth y devolvieron HTTP 400; como el cuerpo fue descartado por diseño, no es posible distinguir credenciales rechazadas, cuenta no confirmada u otra condición de Auth. No se atribuye a RLS o GRANT.

La interfaz marcó algunos casos posteriores `FAIL`, pero el propio texto de evidencia dice `BLOCKED` y confirma que no hubo intento de mutación. Esa etiqueta fue una limitación del harness, no un fallo de autorización observado. No apareció un error de permisos en los casos ejecutados. La bifurcación de escritura requiere que ambas lecturas propias validen el título baseline y el estado draft; al no haber JWT, no entró en esa bifurcación. No se modificó ni revirtió ninguna fila y no se tocaron esquemas, policies, GRANT o configuración Auth.

La página descartó sus campos al pulsar el botón y mantuvo la clave y los JWT solo en variables locales en memoria. Después de registrar este resultado, se cerró la pestaña y se detuvo el servidor localhost; no queda una sesión Auth ni el servidor de prueba activo. La fuente HTML temporal también se retiró del árbol de trabajo. Resultado local de preparación: `node --check` pasó; localhost devolvió HTTP 200 con `Cache-Control: no-store`, CSP restringida al host Supabase del proyecto y listener enlazado únicamente a `127.0.0.1`.

**Bloqueo para continuar:** obtener un resultado de login no 400 con las credenciales correctas o resolver el motivo Auth observado. No reintentar repetidamente ni modificar configuración Auth. Una nueva ejecución debe mejorar el sanitizer para emitir solo categorías/códigos seguros y rotular casos dependientes de JWT como `BLOCKED`, y después completar lecturas A/B, aislamiento mutuo, modificación propia reversible y lectura final.

### Repetición Auth/JWT/RLS, 2026-10-17

**Resultado: casos esenciales ejecutados y aprobados.** Se regeneró una página efímera sin dependencias para el proyecto fijo `ivzjijagahkczdghoqkz`. Se comprobó `node --check` y el servidor local respondió HTTP 200 en `127.0.0.1:8765`, con `Cache-Control: no-store`, CSP limitada a ese origen Supabase y sin log de solicitudes. La interfaz se abrió mediante Chrome DevTools MCP. El operador ingresó manualmente los valores directamente en el navegador. Codex no leyó campos, contraseñas, tokens ni cabeceras; DevTools se usó después únicamente para leer `#state` y `#results`, que contienen resultados saneados. No se inspeccionaron Console ni Network.

Los dos logins respondieron HTTP 200. No se necesitó un segundo intento. La interfaz limitó cada cuenta a dos intentos por pestaña; `sessionStorage` contiene solo contadores enteros A/B, mientras credenciales y JWT permanecieron en memoria. La clave y contraseñas se borraron de los campos al enviar; las referencias a JWT se descartaron después de las pruebas.

| Caso | Esperado | Observado | Evidencia segura |
|---|---|---|---|
| Anónimo consulta drafts A y B | Sin filas de propiedad ni estado | PASS | Ambos endpoints: HTTP 200, 0 filas cada uno |
| Login A y B | Autenticación exitosa | PASS | A: HTTP 200; B: HTTP 200; JWT no expuestos |
| A consulta su propiedad | Una fila propia con baseline y estado esperado | PASS | HTTP 200, 1 fila; estado HTTP 200; baseline coincide |
| B consulta su propiedad | Una fila propia con baseline y estado esperado | PASS | HTTP 200, 1 fila; estado HTTP 200; baseline coincide |
| A lee propiedad B / B lee propiedad A | Cero filas ajenas | PASS | Cada GET: HTTP 200, 0 filas |
| A modifica propiedad B / B modifica propiedad A | Ninguna fila afectada y títulos originales intactos | PASS | Cada PATCH: HTTP 200, 0 filas afectadas; título original intacto |
| A modifica su propiedad temporal y revierte | Cambio visible y reversión verificada | PASS | PATCH HTTP 200, 1 fila devuelta; cambio visible; reversión confirmada por relectura |
| Integridad final de propiedades temporales | Títulos originales A/B | PASS | Relectura autenticada: A y B coinciden con el título original |

La respuesta HTTP se evaluó junto con filas, baseline y relecturas; el status 200 aislado no se tomó como prueba de autorización. Los resultados no mostraron fallos de Auth, RLS, GRANT ni configuración Data API. No hubo casos `BLOCKED` en la matriz esencial. No se modificaron anunciantes, los tres inmuebles originales, esquema, políticas, GRANT, Auth ni configuración. No se crearon usuarios o propiedades. Se modificó solo el título de la propiedad temporal A y se revirtió; los PATCH cruzados no afectaron filas. La verificación final fue mediante JWT de A, no mediante lectura administrativa MCP.

La comprobación queda acotada a estos casos HTTP, filas temporales y sesión observada. No cubre expiración/refresh, roles administrativos, límites de tasa, enumeración amplia ni recuperación de backup. F01-H00 sigue abierto hasta completar los pendientes de seguridad y la decisión arquitectónica. La preparación para búsqueda de alojamientos en Tunja permanece como transición propuesta, sin selección de stack ni autorización de implementación productiva.
