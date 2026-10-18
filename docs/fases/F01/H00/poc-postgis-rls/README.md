# PoC PostgreSQL/PostGIS y RLS de Ubícate

## Estado y límites

PoC PostgreSQL/PostGIS/RLS ejecutada en el proyecto de evaluación autorizado. La migración fue aplicada, los fixtures ficticios permanecen cargados y la suite SQL aprobada fue confirmada con código de salida 0 y `ROLLBACK`; dirección revisó la evidencia. El MCP `supabase_ubicate` permanece con `read_only=true`. El paquete está limitado a `ubicate-f01h00-pruebas`, ref `ivzjijagahkczdghoqkz`. Esta evidencia no valida usuarios, JWT ni solicitudes HTTP reales de Supabase Auth/Data API. El registro histórico de preflight que sigue conserva el estado y bloqueos observados en cada fecha, no el estado vigente.

## Resultado del preflight condicionado, 2026-10-16

### Registro anterior al respaldo confirmado: herramientas y revisión de seguridad

Se preparó fuera del repositorio el paquete oficial de binarios portátiles EDB PostgreSQL 17.11 para Windows. ZIP: `%LOCALAPPDATA%\Temp\ubicate-postgresql-client-17.11\postgresql-17.11-4-windows-x64-binaries.zip`; SHA-256 verificado: `B9424EE7BC60B52450FF910A3630225DF32E633F3CB29C1D126D9299D59AEA28`. Se ejecutaron `pg_dump`, `pg_restore` y `psql`, todos con versión 17.11, coincidente con la versión remota observada por consulta de solo lectura. No se instaló un servidor, no se creó servicio persistente y no se modificó PATH. Los clientes y DLL están en `%LOCALAPPDATA%\Temp\ubicate-postgresql-client-17.11\client\bin`.

La copia previa todavía no se generó. La conexión directa no está disponible desde esta red; el Session Pooler IPv4 sí respondió en el puerto 5432. El certificado CA se descargó desde el botón de Database Settings del proyecto y se guardó fuera del repositorio en `%LOCALAPPDATA%\Temp\ubicate-postgresql-client-17.11\prod-ca-2021.crt`. El certificado se parseó localmente como `Supabase Root 2021 CA`; SHA-256 `700723581420DD1AC98FD7E9AC529F0EF210EADCAF87FC868A3AD7D114C2F3B7`. El primer intento abrió un proceso PowerShell no visible para el usuario y produjo un archivo de cero bytes; ese proceso fue detenido y el archivo no se considera respaldo. Se preparó un nuevo script local para ejecución desde una terminal visible, con `sslmode=verify-full` y prompt `pg_dump --password`. No se ha confirmado la sesión TLS mediante conexión. La contraseña no se solicitó por chat, escribió en argumentos, guardó o transmitió. El plan Free aparece en el dashboard, que declara que no incluye backups de proyecto; el dump lógico externo sigue pendiente.

Se auditó el helper de propiedad. El `SECURITY DEFINER` parece necesario para evitar que la consulta de propiedad quede atrapada en las policies RLS que protege, pero esto no está probado en PostgreSQL mediante la suite. La migración actual lo instala en `public`, otorga ejecución a `authenticated` y no fija el propietario. El catálogo read-only confirmó PostgreSQL 17.11 y que `postgres` tiene `rolbypassrls=true`, `rolsuper=false`; no verificó quién ejecutaría la migración ni la exposición actual de esquemas de la API. La propuesta de mover el helper a un esquema privado, exigir `current_user = 'postgres'`, fijar/verificar propietario y limitar privilegios se documenta en [`revision-seguridad-pendiente.md`](revision-seguridad-pendiente.md) y en la [candidata SQL privada vigente](review/20261016_01_postgis_listing_rls.private-candidate.sql). Es un cambio material y requiere revisión humana antes de actualizar o ejecutar el SQL versionado.

`codex mcp list` falló porque `CODEX_HOME` no estaba definida en esa terminal: `Error: failed to resolve CODEX_HOME` / `Could not find home directory`. Al definirla solo para el proceso como `%USERPROFILE%\.codex`, el comando cargó la configuración y listó `supabase_ubicate` apuntando al ref autorizado en modo `read_only=true`. Persistieron avisos de `Acceso denegado. (os error 5)` al limpiar directorios temporales/alias; no se modificó configuración global ni de proyecto.

La PoC sigue detenida antes de cualquier escritura remota. No se creó el dump ni se verificó su integridad, no se creó MCP de escritura y no se aplicaron migraciones, datos o permisos.

La siguiente sección registra el bloqueo histórico previo a la disponibilidad de los clientes portátiles; conserva su contexto y no representa el estado actual de herramientas.

### Registro histórico del preflight inicial

Ejecución detenida antes de habilitar un canal de escritura o ejecutar SQL. En el dashboard del proyecto `ivzjijagahkczdghoqkz` se observa la organización `Ubicate-Evaluacion-F01H00 FREE`; la pantalla de respaldos dice que Free no incluye respaldos de proyecto y no muestra respaldos existentes. En el entorno local no están disponibles `pg_dump`, `pg_restore` ni `psql`. Por tanto, no se generó el respaldo previo exigido ni existe evidencia de checksum/restaurabilidad.

La revalidación con el MCP `supabase_ubicate`, todavía `read_only=true`, devolvió cero filas para relaciones y funciones públicas con prefijo `ubicate_poc_` y cero filas para PostGIS instalado. No se inspeccionó ni modificó otro proyecto. `codex mcp list` no pudo resolver `CODEX_HOME`, así que no se preparó el MCP temporal de escritura.

La revisión estática no encontró `DROP`, `CASCADE` ni modificaciones a objetos preexistentes; la migración se limita a crear PostGIS y objetos de la PoC y sus guardas detienen colisiones. La función auxiliar usa `SECURITY DEFINER`, `search_path` vacío, referencias cualificadas y `EXECUTE` revocado de `PUBLIC`/`anon` y concedido a `authenticated`. El SQL no fija explícitamente su propietario.

**Puertas pendientes antes de reanudar:** crear un respaldo legible fuera de Git y verificar su checksum; documentar que `pg_restore --list` solo acredita que el archivo se puede listar y no una restauración completa; disponer de una vía temporal de escritura limitada al ref autorizado; resolver explícitamente cómo fijar/verificar el propietario de la función. No hubo cambios remotos, consumo atribuible a la PoC ni costo de ejecución.

La prueba crea datos completamente ficticios. No crea usuarios Auth, buckets, roles, políticas de Storage, extensiones de correo, API ni infraestructura. Crea una función SQL auxiliar de propiedad con `SECURITY DEFINER`, `search_path` vacío y ejecución concedida solo a `authenticated`, para evitar recursión entre policies. El acceso a roles `anon` y `authenticated` se simula en una transacción de SQL bajo el rol administrativo del proyecto y se revierte al final.

## Orden previsto al recibir autorización de escritura

1. Confirmar en el dashboard que el encabezado muestra `ubicate-f01h00-pruebas` y ref `ivzjijagahkczdghoqkz`, plan Free y sin facturación activa.
2. Descargar/exportar un respaldo previo de la base con un método oficial disponible para el proyecto o, si se autoriza conexión PostgreSQL directa, usar `pg_dump --format=custom --no-owner --no-privileges` desde un equipo autorizado. Mantener URL/contraseña fuera del historial, repositorio y registros; guardar el artefacto cifrado fuera del repositorio, generar SHA-256 y comprobar que `pg_restore --list` lo pueda leer. Como el inventario inicial no mostró tablas públicas, conservar el dump previo aun si está casi vacío. Si no hay método de respaldo verificable disponible sin instalar herramientas o crear accesos, detenerse y pedir una decisión antes de migrar.
3. Revisar que no existan objetos con prefijo `ubicate_poc_`. Si hay alguno, detenerse y pedir decisión antes de limpiar o adaptar.
4. Ejecutar `migrations/20261016_01_postgis_listing_rls.sql` en una sesión transaccional como `postgres`.
5. Ejecutar `fixtures/seed.sql` como `postgres` para insertar dos anunciantes ficticios, tres inmuebles, cuatro unidades, tres espacios compartidos y cuatro periodos de disponibilidad. No son usuarios Auth reales.
6. Ejecutar `tests/rls_geospatial.sql` como `postgres`. El script comprueba lecturas públicas, propiedad, denegaciones cruzadas, separación de columnas, moderación administrativa y consultas de radio. Termina con `ROLLBACK`, por lo que revierte las modificaciones de prueba que realiza.
7. Guardar salida sin secretos en el informe de F01-H00. Comprobar recuentos y estado `read_only=true` del MCP antes y después.

No enviar estos SQL por el MCP mientras su URL mantenga `read_only=true`. Para correrlos tras una autorización, se necesitaría un canal de escritura específico autorizado por dirección, dirigido solo al ref anterior y sin alterar la configuración actual del MCP hasta que esa autorización sea concedida.

## Objetos previstos

La migración instala PostGIS en `extensions`, crea seis tablas con prefijo `ubicate_poc_` en `public` (anunciantes ficticios, inmuebles, estado editorial, unidades, espacios compartidos y disponibilidad) y una función auxiliar restringida. Añade índices espaciales/relacionales, grants mínimos y RLS. No expone `owner_id` mediante `SELECT`; el estado editorial vive en una tabla separada y solo administradores pueden cambiarlo. La migración se detiene si ya existe PostGIS o cualquier objeto `public.ubicate_poc_*`, de modo que la procedencia de limpieza sea inequívoca.

## Criterios de aceptación

- Migración crea solo la extensión y seis tablas nombradas, sin modificar objetos previos ni tocar `auth.users`.
- Búsquedas geográficas con `ST_DWithin(geography, geography, metros)` devuelven los identificadores esperados en radios de 250 m y 1 km, y excluyen anuncios borrador o no disponibles.
- `anon` puede consultar únicamente columnas públicas de inmuebles/unidades/espacios/disponibilidad publicados; no puede leer perfiles privados ni modificar contenido.
- Cada anunciante ve anuncios públicos y sus propios borradores. No puede leer, cambiar ni borrar filas privadas de otro anunciante, tampoco cuando conoce su UUID.
- Las pruebas negativas demuestran denegación anónima de inserción/actualización, cambios cruzados de propiedad/unidades/disponibilidad, modificación de estado editorial y lectura de perfiles privados por administración.
- Ningún anunciante puede modificar el estado editorial o asignarse otro propietario.
- Un usuario con claim firmado `app_metadata.ubicate_role=admin` puede consultar contenido para moderación y cambiar únicamente el estado editorial. No puede leer `owner_id`, acceder al perfil privado de otro anunciante ni borrar inmuebles.
- Todas las aserciones SQL pasan y la transacción de pruebas finaliza en `ROLLBACK`.
- La restauración previa permanece intacta y la limpieza posterior elimina solo objetos `ubicate_poc_*` y la extensión si fue creada por este paquete y no tiene dependientes.
- El respaldo se puede listar/restaurar en un entorno autorizado y separado. La creación de ese entorno sería una acción externa adicional y no está incluida en esta autorización de PoC.

## Reversión y limpieza

No ejecutar `DROP` como parte de las pruebas. Para terminar, primero sacar un dump posterior y conservar las evidencias. La limpieza puede borrar filas y tablas, y `DROP EXTENSION postgis` es destructivo si otros objetos la usan. Por eso dirección debe autorizar expresamente la limpieza después de revisar dependencias.

Secuencia de limpieza propuesta: detener actividad; exportar resultados; inventariar `pg_depend` para PostGIS y sus objetos; borrar únicamente las seis tablas `ubicate_poc_*` en orden inverso de dependencias sin `CASCADE`; retirar la función auxiliar; retirar PostGIS solo si consta que fue instalado por esta migración y la inspección demuestra que no tiene dependientes; comparar con el dump previo. La migración se detiene si PostGIS ya existe, por lo que su propiedad de instalación queda clara. Ante cualquier dependencia inesperada, no borrar y solicitar decisión.

## Fallos que detienen la ejecución

- El dashboard/ref no coincide o el plan/costo no corresponde a Free/USD 0.
- Ya existe un objeto `ubicate_poc_*`, PostGIS aparece en esquema distinto al esperado, o el proyecto tiene objetos no previstos.
- Cualquier sentencia informa que necesita facturación, usa servicio/cuenta distinto, intenta acceder a otro proyecto o requiere datos reales.
- RLS o una aserción devuelve un resultado diferente del esperado.
- La exportación previa no puede leerse o no hay evidencia de retorno/rollback.

## Actualización de preflight: respaldo y correlación de policies, 2026-10-16

### Respaldo lógico previo

El director generó personalmente el respaldo antes de cualquier escritura de la PoC. Se verificó el original en `%LOCALAPPDATA%\Temp\ubicate-f01h00-backup-20261016-02\ubicate-f01h00-before-poc-20261016.dump` y se copió sin eliminarlo a una ubicación persistente fuera del repositorio: `%LOCALAPPDATA%\Ubicate\Backups\F01-H00\ubicate-f01h00-before-poc-20261016.dump`.

Ambos archivos tuvieron 365055 bytes y SHA-256 `7905DD49059109D2F5E16E59B958B69A1EA39DB5D37C89F119D3782155F96928`. `pg_restore --list` terminó con código 0 para ambos. La carpeta persistente tiene ACL protegida para la cuenta Windows del director y `SYSTEM`. El sandbox de Codex no tiene acceso a esa ubicación; la verificación de la copia se ejecutó bajo la cuenta propietaria. El respaldo no fue eliminado ni restaurado.

El archivo es formato PostgreSQL custom, comprimido, producido con `pg_dump` 17.11 contra PostgreSQL 17.11 con `sslmode=verify-full`. El encabezado del archivo indica 566 entradas TOC, mientras el listado presenta 559 líneas de objetos numeradas. La discrepancia de siete entradas no está explicada y queda como limitación pendiente; el conteo no se presenta como prueba de integridad semántica ni de cobertura completa.

La inspección del índice encontró esquemas `auth`, `extensions`, `graphql`, `graphql_public`, `pgbouncer`, `realtime`, `storage` y `vault`; cuatro entradas de extensiones (`pg_stat_statements`, `pgcrypto`, `supabase_vault`, `uuid-ossp`); y 38 entradas de datos de tablas, principalmente `auth`, `realtime`, `storage` y `vault`. No encontró tablas `public`, PostGIS, objetos large-object ni entradas de roles/tablespaces del clúster. `vault.secrets` aparece como entrada de datos cifrados; sus valores no fueron inspeccionados. Las fotos almacenadas como objetos de Supabase Storage no están cubiertas por un dump PostgreSQL. Una restauración manual de los datos cifrados de Vault a otro proyecto no puede considerarse recuperable sin la clave raíz correspondiente.

El respaldo cubre la base PostgreSQL `postgres` y los objetos/datos que `pg_dump` pudo listar en ella. No incluye configuración externa del proyecto, roles y tablespaces globales del clúster, contenido binario de objetos de Storage ni una prueba completa de restauración. `pg_restore --list` confirma que el índice del archivo se puede leer; no valida que una restauración termine correctamente. Referencias: [pg_dump 17](https://www.postgresql.org/docs/17/app-pgdump.html), [pg_restore 17](https://www.postgresql.org/docs/17/app-pgrestore.html), [Supabase Vault](https://supabase.com/docs/guides/database/vault).

### Corrección local de RLS

La revisión detectó que las policies públicas de `ubicate_poc_units` y `ubicate_poc_shared_spaces` no cualificaban la referencia externa `property_id`. La subconsulta podía correlacionar con la fila de estado de publicación en vez de la fila hija y permitir leer una unidad o espacio de un inmueble borrador cuando existía otro inmueble publicado.

La migración local ahora cualifica las referencias externas en esas policies y también en correlaciones equivalentes de propiedades, espacios y disponibilidad. La copia de propuesta privada se mantiene alineada con el arreglo, pero sus cambios de esquema, propietario y grants para el helper `SECURITY DEFINER` siguen pendientes de revisión humana. No se ha ejecutado SQL local contra un servidor ni SQL remoto.

La suite `tests/rls_geospatial.sql` añade negativos explícitos para que `anon` no lea la unidad ni el espacio del inmueble en borrador, y un caso positivo para que el anunciante B sí pueda leer su propio espacio de borrador. Los casos siguen pendientes de ejecución real en el proyecto aislado. No se afirma que RLS haya pasado.

### Estado

No se ejecutaron migraciones, fixtures, pruebas remotas, cambios de permisos ni escrituras en Supabase. `supabase_ubicate` continúa en solo lectura; no se abrió MCP de escritura. La migración SQL corregida y la propuesta de helper privado requieren revisión final de dirección antes de cualquier ejecución remota. F01-H00 permanece abierto.

## Revisión final local de la candidata privada, 2026-10-16

La migración original `migrations/20261016_01_postgis_listing_rls.sql` conserva su trazabilidad y continúa con el helper en `public`; no es la candidata para ejecución después de esta revisión. La candidata vigente es [`review/20261016_01_postgis_listing_rls.private-candidate.sql`](review/20261016_01_postgis_listing_rls.private-candidate.sql). SHA-256 de la candidata: `D595FF2EE925DD63115334E71C0621F561B976B348FBD5DE69FE34001877371C`. La suite vigente es [`tests/rls_geospatial.sql`](tests/rls_geospatial.sql), SHA-256 `76E957B2440692A1699967907F65C499B6600DCD2BB745549E4D2081E23D9243`. La ruta y checksum identifican exactamente el archivo propuesto para revisión, no una autorización de ejecución.

La candidata usa el esquema `private`, aborta si ya existe, exige `current_user = 'postgres'`, crea el helper como `SECURITY DEFINER` con `search_path = ''` y referencias cualificadas, asigna explícitamente propietario `postgres`, y revoca `EXECUTE` salvo a `authenticated`. Una postcondición inspecciona propietario, BYPASSRLS, configuración, esquema y ACL. La consulta MCP read-only de `current_setting('pgrst.db_schemas', true)` devolvió `NULL`; la búsqueda de ajustes `pgrst.db_schemas` en `pg_db_role_setting` no devolvió filas. Ninguna de esas lecturas confirma los esquemas expuestos de la Data API. Debe comprobarse `private` en API Settings del proyecto antes de autorizar o ejecutar la candidata. No se modificó configuración remota.

La suite revisa los privilegios efectivos del helper, intenta invocarlo bajo `anon` esperando denegación, y comprueba visibilidad bajo RLS. Se corrigió la aserción administrativa: `authenticated` sí tiene privilegio SQL `SELECT` sobre `ubicate_poc_advertisers`, así que la prueba ahora comprueba que el administrador ve cero filas bajo RLS, no que carece del privilegio SQL. También verifica que un anunciante no lea, aun con UUID conocido, el borrador, unidad, espacio o perfil del otro anunciante.

Estas son comprobaciones estáticas y aserciones preparadas. No se ejecutó la migración ni la suite contra PostgreSQL. La candidata requiere aprobación final de dirección y autorización separada antes de cualquier escritura remota.

### Protección del respaldo

El dump permanece con ACL de Windows restringida a la cuenta del director y `SYSTEM`; su SHA-256 sigue siendo `7905DD49059109D2F5E16E59B958B69A1EA39DB5D37C89F119D3782155F96928`. `cipher /c` informó que el archivo no está cifrado con EFS y que archivos nuevos en esa carpeta no se cifrarán automáticamente. La comprobación de BitLocker no pudo determinar el estado del volumen: `Get-CimInstance: Access denied` y `C: does not have an associated BitLocker volume`. Por tanto, el almacenamiento está protegido por ACL, pero el cifrado en reposo del volumen no está confirmado. No se abrió ni modificó el contenido durante esta comprobación.

La inspección visual de solo lectura de `Integrations > Data API > Settings` para el proyecto/ref autorizados no mostró el panel de esquemas expuestos: el árbol accesible solo devolvió el contenedor general de Integrations. Por tanto, `private` **no queda confirmado como no expuesto**. Antes de cualquier autorización de ejecución, dirección deberá verificar visualmente la lista “Exposed schemas” en ese proyecto. No se cambió ningún ajuste.

## Corrección final de policies owner-read, 2026-10-16

La candidata privada sustituye la lectura propia de espacios por `private.ubicate_poc_is_property_owner(property_id)`. La lectura propia de disponibilidad conserva la relación con `ubicate_poc_units` para resolver el inmueble padre y evalúa su propietario mediante el mismo helper; no consulta `ubicate_poc_properties.owner_id` directamente bajo el rol `authenticated`. No se concedió `SELECT` sobre `owner_id`.

La suite añade: lectura positiva por B de su espacio y disponibilidad del inmueble en borrador; lectura positiva de su disponibilidad publicada; denegación a A, incluso con UUID conocidos, de espacio y disponibilidad del borrador de B; y denegación a B de una disponibilidad no pública perteneciente a A. El fixture actual no incluye un espacio oculto bajo un inmueble publicado, por lo que ese caso particular no se afirma como cubierto.

La revisión de policies no encontró otros subqueries que lean `p.owner_id` como el usuario invocante. La lectura propia de propiedades y el predicado `USING` de su actualización también pasan por el helper privado. `owner_id` se conserva solo en `WITH CHECK` de inserción/actualización para validar la fila propuesta; la inserción del campo está concedida y la actualización de esa columna no. No se añadió permiso `SELECT` sobre `owner_id`. Estáticamente, no se observó recursión: el helper consulta la tabla de inmuebles como propietario `postgres` con BYPASSRLS; las policies de propiedad y espacios lo llaman directamente; la policy de disponibilidad consulta unidades, cuyas policies llaman al helper y no consultan disponibilidad. Esto es análisis de estructura, no resultado de ejecutar PostgreSQL. PostgreSQL documenta que las expresiones RLS usan privilegios del invocante y que subconsultas deben poder acceder a sus tablas/funciones: [Row Security Policies](https://www.postgresql.org/docs/17/ddl-rowsecurity.html), [CREATE POLICY](https://www.postgresql.org/docs/17/sql-createpolicy.html).

Se consultó todo `pg_db_role_setting` en el proyecto con un filtro para `pgrst.db_schemas`; devolvió cero filas. `current_setting('pgrst.db_schemas', true)` también devolvió `NULL`. No hay evidencia de un override de rol/base en esos catálogos. La lista efectiva de esquemas expuestos no se pudo leer; la comprobación manual de Data API Settings sigue pendiente.

## Ejecución detenida en el preflight TLS del Session Pooler, 2026-10-16

Dirección ejecutó el lanzador visible con PostgreSQL 17.11. El lanzador verificó los hashes autorizados de migración y suite, los fixtures, el checksum y listado del respaldo y la huella del CA. `psql` estableció conexión con el Session Pooler usando `PGSSLMODE=verify-full` y el CA del proyecto. La conexión llegó al bloque SQL de preflight. Ese bloque comprobó primero base `postgres` y rol `postgres`, y luego abortó con:

```text
ERROR: STOP: connection is not protected by TLS
psql exit code: 3
```

La condición que abortó fue una consulta a `pg_stat_ssl` para el backend actual. La migración todavía no había sido incluida por `psql`; por tanto, PostGIS, esquema privado, tablas y fixtures no se crearon en esa ejecución. Una consulta posterior con el MCP de solo lectura volvió a confirmar `postgis_installed=false`, `private_schema_exists=false` y cero relaciones `public.ubicate_poc_*`.

La conexión autenticada se realizó después de que el lanzador fijara `PGSSLMODE=verify-full` y `PGSSLROOTCERT` al CA verificado. Según la documentación oficial, `verify-full` cifra la conexión y verifica tanto la CA como el nombre del servidor; que `psql` se conectara acredita esta validación del tramo cliente-a-pooler.

La condición SQL, en cambio, solo comprobó si `pg_stat_ssl` contenía una fila para el backend actual con `ssl=true`. El error no imprimió el valor de `ssl` ni permite distinguir entre un valor `false` y una fila ausente. PostgreSQL documenta `pg_stat_ssl` como información SSL de la conexión del backend. Supabase documenta que Supavisor actúa como intermediario entre el cliente y PostgreSQL. [Inferencia] A través del Session Pooler, la vista corresponde al tramo Supavisor-a-PostgreSQL y no al tramo local-cliente-a-Supavisor. Por tanto, la condición implementada no medía la propiedad que pretendía comprobar; el estado del enlace interno sigue sin determinarse con esta salida. Fuentes: [PostgreSQL, estadísticas de actividad](https://www.postgresql.org/docs/17/monitoring-stats.html), [Supabase, Supavisor FAQ](https://supabase.com/docs/guides/troubleshooting/supavisor-faq-YyP5tI), [Supabase, SSL enforcement](https://supabase.com/docs/guides/platform/ssl-enforcement).

El preflight no se reintentó. El lanzador original se conserva en `%LOCALAPPDATA%\Temp\ubicate-f01h00-poc-runner\run-poc-visible.ps1` junto a su SQL. Se preparó una segunda versión local que elimina únicamente la condición `pg_stat_ssl` y usa `psql \\conninfo` para mostrar la conexión efectiva; no se ejecutó. Mantiene `PGSSLMODE=verify-full`, `PGSSLROOTCERT`, los guardas de destino/rol/objetos, los hashes requeridos, `ON_ERROR_STOP=1` y el orden migration → postcondiciones → fixtures → suite. La ejecución permanece detenida para revisión humana debido al error del preflight y a la incertidumbre sobre el enlace interno del pooler.

## Aplicación de migración y estado parcial, 2026-10-16

Dirección aprobó un reintento con el lanzador v2. La consulta de solo lectura posterior confirmó PostGIS instalado en `extensions`, el esquema `private`, las seis tablas previstas en `public` y RLS habilitado en las seis. El helper existe en `private`, su propietario es `postgres`, el rol propietario tiene `BYPASSRLS`, `SECURITY DEFINER` está activo, `search_path` está vacío, `anon` no tiene `USAGE` ni `EXECUTE` y `authenticated` tiene los permisos previstos.

Los conteos leídos después fueron cero para anunciantes, inmuebles, estados editoriales, unidades, espacios compartidos y disponibilidad. Por tanto, no hay evidencia de que se hayan insertado fixtures. La suite no está acreditada como ejecutada. `psql` ya no estaba activo al comprobarlo, pero el mensaje final de la consola todavía no se ha recibido. No se ha repetido ningún script ni se ha eliminado objeto alguno.

La revisión visual posterior de Data API Settings mostró dos de dos esquemas expuestos: `public` y `graphql_public`; `private` no aparece expuesto. La opción de autoexposición de tablas nuevas está activada.

## Resultado de la ejecución autorizada v2, 2026-10-16

La salida facilitada por dirección confirma que el preflight SQL terminó (`DO`), `psql \\conninfo` mostró una conexión TLS 1.3 al Session Pooler con `sslmode=verify-full`, y la migración terminó con `COMMIT`. Después, el bloque `VERIFY MIGRATION POSTCONDITIONS` falló con `FAIL RLS not enabled on every PoC table`; `psql` salió con código 3 y el lanzador indicó detenerse. En consecuencia, no se llegó a incluir `seed.sql` ni `rls_geospatial.sql`. No se repitió el lanzador ni se hicieron limpiezas.

La salida también contiene `'cat' is not recognized as an internal or external command` antes de comenzar la migración. El proceso continuó y la conexión y la migración se ejecutaron; el origen de ese mensaje incidental no queda identificado y no se atribuye a PostgreSQL.

La auditoría de la condición local que falló y la consulta de catálogo remota de solo lectura explican el resultado: la condición examina todo objeto cuyo nombre empieza por `ubicate_poc_`, pero no limita `pg_class.relkind` a tablas. El catálogo devuelve 6 objetos `relkind='r'` (las seis tablas) con RLS habilitado y 15 objetos `relkind='i'` (índices) para los que `relrowsecurity` es falso. La comprobación falla por esos índices, no por las tablas. Esta es una falla de la aserción de postcondición, no evidencia de una falla de RLS en las tablas.

La migración persistió los objetos ya confirmados en la sección anterior: PostGIS en `extensions`, esquema y helper `private`, seis tablas y sus índices. La lectura de conteos volvió a confirmar cero filas en cada tabla, consistente con que la carga de fixtures y la suite no comenzaron. En ese momento se detuvo la ejecución para revisión de dirección. Esta revisión posterior autoriza corregir el verificador y continuar condicionalmente; las comprobaciones de permisos ya se documentan abajo. Los asesores de seguridad quedan pendientes de la suite.

## Preflight de recuperación controlada, 2026-10-16

Dirección autorizó corregir el verificador y reanudar únicamente con fixtures y suite si las verificaciones de seguridad pasan. Se mantuvieron las consultas remotas en solo lectura durante este preflight.

La causa exacta del error está en el bloque `VERIFY MIGRATION POSTCONDITIONS` del archivo temporal `run-poc-v2.sql`: el `EXISTS` que comprobaba `relrowsecurity` filtraba por prefijo de nombre, pero no por `pg_class.relkind`. Así trató como tablas los índices cuyo nombre empieza por `ubicate_poc_`. La corrección es restringir esa comprobación a `relkind IN ('r','p')` y comparar contra los seis nombres exactos. La consulta remota confirmó seis tablas ordinarias, todas con `relrowsecurity=true`, 15 índices identificados separadamente y ninguna relación prefijada adicional a las seis tablas y esos índices.

La consulta remota confirmó las 31 policies aplicadas. Sus nombres se compararon con las 31 declaraciones `CREATE POLICY` del candidato cuya SHA-256 aprobada es `D595FF2EE925DD63115334E71C0621F561B976B348FBD5DE69FE34001877371C`. PostGIS está instalado en `extensions`. `private.ubicate_poc_is_property_owner(uuid)` pertenece a `postgres`, propietario con `BYPASSRLS`; es `SECURITY DEFINER`, fija `search_path` vacío y referencia `public.ubicate_poc_properties` y `auth.uid()` cualificadamente. `proacl` contiene solo `postgres` y `authenticated` con EXECUTE; `anon` carece de `USAGE` y EXECUTE, mientras `authenticated` tiene los permisos requeridos. No se concedió SELECT sobre `owner_id` a `anon` ni a `authenticated`. Los privilegios efectivos de lectura/escritura de las seis tablas coinciden con las concesiones columnares y de tabla del candidato.

El catálogo no mostró relaciones prefijadas inesperadas: 6 tablas, 15 índices y el helper privado. Las seis tablas permanecen vacías. Los SHA-256 de `seed.sql` y `rls_geospatial.sql` siguen coincidiendo con los aprobados (`5E1C24FE89983546F74FAB25EA53D83E5FC15EC77AE80BD23C1E9CD8F59E9BDC` y `76E957B2440692A1699967907F65C499B6600DCD2BB745549E4D2081E23D9243`). El respaldo conserva 365055 bytes y SHA-256 `7905DD49059109D2F5E16E59B958B69A1EA39DB5D37C89F119D3782155F96928`; `pg_restore --list` terminó con código 0. Esto no equivale a una restauración probada.

En el panel actual del proyecto `ivzjijagahkczdghoqkz`, la organización y el proyecto muestran plan `FREE`. Data API indica 2 de 3 esquemas expuestos: la lista muestra marcados `public` y `graphql_public`, y `private` desmarcado. También muestra 0 de 6 tablas y 0 de 1 funciones expuestas. La opción de autoexposición de tablas nuevas aparece activada. No se cambió esa configuración. No se activó facturación ni un servicio pago.

La salida de Windows `'cat' is not recognized` no aparece como comando en los archivos PowerShell ni SQL del lanzador v2; estos usan `Get-FileHash` y `psql`, sin `\!` ni invocación de `cat`. Su origen exacto no pudo determinarse. La salida demuestra que la conexión, el bloque `DO` de preflight, `\\conninfo`, la migración y la comprobación posterior sí se ejecutaron en secuencia; no se identificó una validación omitida por ese mensaje. El lanzador preparado para la reanudación usa cmdlets PowerShell y tampoco invoca `cat`.

Al probar el bloque corregido mediante `supabase_ubicate`, su guarda combinada de base/rol se detuvo porque el MCP ejecuta como `supabase_read_only_user`, no como `postgres`. La conexión PSQL previa sí había superado la guarda de rol y mostrado el usuario del Session Pooler. Al repetir el mismo bloque de lectura quitando únicamente la condición de rol que no aplica al MCP, terminó correctamente; las guardas de catálogo, helper, RLS, políticas, objetos y filas vacías pasaron. El lanzador de escritura conserva la verificación de base y rol para la conexión PSQL.

Se preparó fuera de Git `%LOCALAPPDATA%\Temp\ubicate-f01h00-poc-runner\run-resume-v3.sql` y `run-resume-visible-v3.ps1`. El SQL incluye un preflight de solo lectura corregido, muestra los índices por separado, luego incluye exclusivamente `fixtures/seed.sql` y `tests/rls_geospatial.sql`, con postcondiciones de persistencia y rollback. No contiene la migración ni sentencias DDL, GRANT, REVOKE o limpieza. La sintaxis PowerShell fue analizada localmente; el alcance estático confirmó exactamente dos inclusiones y ausencia de la ruta de migración y de sentencias de cambio de esquema/permisos. Hashes del lanzador local: SQL `5A45F79E32D7C282F7356F1685091C39A6C784BDBA98EB438795F89BC35FBAE1`; PowerShell `89788C9B5430AF228307F5512A57518DD50A56574DF0DCFA33CC0382613CE3FC`.

La reanudación queda lista para la entrada interactiva de la contraseña en PowerShell. Hasta que se ejecute ese paquete, los fixtures y la suite siguen pendientes; no se han hecho escrituras remotas desde la migración aplicada.

## Estado observado después de la reanudación, 2026-10-16

Dirección informó que la ventana PowerShell terminó, pero la salida final no está disponible. No se volvió a ejecutar el paquete. Las consultas de solo lectura a `ivzjijagahkczdghoqkz` confirman estas cantidades persistentes: 2 anunciantes, 3 inmuebles, 3 estados de publicación, 4 unidades, 3 espacios comunes y 4 disponibilidades. También se leyeron `Casa de prueba A` y el estado `draft` del inmueble B. Esos valores son consistentes con los fixtures aprobados y con que la suite temporal haya revertido sus cambios; no demuestran que todas las aserciones de la suite hayan pasado ni permiten determinar si su salida concluyó con éxito o error.

La pantalla Security Advisor del proyecto mostraba 0 errores, 0 advertencias y 0 sugerencias, y el mensaje “No errors detected”. Esto registra el estado que mostró el dashboard durante la revisión; la salida de PowerShell no está disponible para establecer si el asesor se ejecutó como parte del paquete después de esta carga de fixtures.

En consecuencia, el resultado de la suite `tests/rls_geospatial.sql`, incluidas sus pruebas positivas y negativas de RLS y sus radios de 250 m y 1 km, queda **sin confirmar**. Los datos persistentes posteriores son consistentes con que los fixtures se cargaron y la transacción de la suite no alteró los registros sembrados. No se afirma que la suite haya pasado. Para completar evidencia reproducible se necesita recuperar la salida final de la consola o, con autorización de dirección, definir una verificación posterior acotada. No repetir automáticamente el lanzador ni alterar los objetos remotos.

## Intento de confirmación de suite, 2026-10-16

Dirección autorizó repetir solo `tests/rls_geospatial.sql`, con SHA-256 `76E957B2440692A1699967907F65C499B6600DCD2BB745549E4D2081E23D9243`. El preflight de solo lectura por MCP confirmó la base `postgres`, el proyecto de evaluación mediante el servidor `supabase_ubicate`, seis tablas exactas con RLS, 31 políticas, PostGIS 3.3.7 en `extensions`, el helper de propietario `postgres` en `private` con `SECURITY DEFINER`, `search_path` vacío y ACL limitada a `postgres` y `authenticated`; `anon` no tiene `USAGE` ni `EXECUTE`. Los conteos antes del intento fueron 2 anunciantes, 3 inmuebles, 3 estados, 4 unidades, 3 espacios comunes y 4 disponibilidades. Los estados eran A publicada, B en borrador y C publicada. El dashboard mostraba plan `FREE`; `private` figuraba no expuesto en la verificación de Data API registrada arriba. No se cambiaron esos ajustes.

El respaldo se verificó en modo de solo lectura: 365055 bytes, SHA-256 `7905DD49059109D2F5E16E59B958B69A1EA39DB5D37C89F119D3782155F96928`; `pg_restore --list` terminó con código 0. Los clientes `psql` y `pg_restore` son PostgreSQL 17.11. El certificado CA coincidió con SHA-256 `700723581420DD1AC98FD7E9AC529F0EF210EADCAF87FC868A3AD7D114C2F3B7`. Se probó la captura local de stdout y stderr con un comando inocuo, incluido un código esperado 7 distinto de cero.

Se prepararon fuera del repositorio el lanzador `%LOCALAPPDATA%\Temp\ubicate-f01h00-suite-runner\run-approved-suite-with-log.ps1` y el wrapper de preflight `%LOCALAPPDATA%\Temp\ubicate-f01h00-suite-runner\read-only-preflight-and-approved-suite.sql`. El wrapper contiene únicamente comprobaciones de lectura y una inclusión del archivo de suite aprobado. El lanzador usa `--no-psqlrc`, `ON_ERROR_STOP=1`, `--echo-all`, `sslmode=verify-full`, CA explícita y prompt interactivo; no incluye migración ni fixtures. La carpeta de logs se restringió a la cuenta Windows del director, la identidad del sandbox Codex y `SYSTEM`.

La ventana PowerShell iniciada por el agente no fue visible para el director. `psql` quedó esperando la entrada interactiva, sin producir salida de conexión ni del SQL. Se detuvo el proceso local sin proporcionar una contraseña. El lanzador registró `PSQL_EXIT_CODE=-1` al terminarse el proceso; este no es un código de salida normal de una ejecución completada de `psql`. El log no contiene `\conninfo`, el marcador de preflight aprobado, `BEGIN`, `ROLLBACK` ni retorno del archivo incluido. Por ello, **no se ejecutó el preflight conectado ni la suite**, y no hay resultados de grupos anon, anunciantes A/B, administrador o búsquedas geográficas. No se repitió el proceso.

Log local privado e incompleto, compuesto solo por metadatos y estado de no confirmación: `%LOCALAPPDATA%\Temp\ubicate-f01h00-suite-logs\rls-geospatial-20261016-202022.log`, SHA-256 `B53343F1D097CEA75F53612B93E24FF664094C2F9CD1BDEF4F5603757B680175`. No es evidencia de ejecución de la suite. La lectura remota posterior mantuvo los conteos 2/3/3/4/3/4 y confirmó los tres estados esperados. Security Advisor consultado a las 20:24 COT mostró 0 errores, 0 advertencias y 0 sugerencias.

Para completar la prueba sin depender de una ventana iniciada desde el sandbox, el director puede ejecutar el lanzador preparado desde una PowerShell que tenga visible: `& "$env:LOCALAPPDATA\Temp\ubicate-f01h00-suite-runner\run-approved-suite-with-log.ps1"`. La contraseña se introduce solo en el prompt de `psql`; la salida final, código de proceso, ruta y SHA-256 quedan en el log privado. Hasta contar con código de salida 0, marcador de `ROLLBACK` y retorno de la suite, el resultado permanece **NO CONFIRMADO**. F01-H00 continúa abierto.

## Corrección del preflight de identidad de sesión, 2026-10-16

El fallo informado por dirección fue `PREFLIGHT FAIL: wrong project database or execution role` con código 3. La inspección del SQL del lanzador encontró una condición combinada que comprobaba `current_database() = 'postgres'` y comparaba `current_user` con `postgres.ivzjijagahkczdghoqkz`. Ese último valor es el usuario configurado para conectarse mediante Session Pooler, no el rol efectivo esperado por la guarda. Como ambas condiciones estaban dentro de un solo `IF`, el mensaje por sí solo no identifica cuál de las dos falló.

La salida de una conexión anterior mostró `current_database = postgres` y `You are connected ... as user postgres.ivzjijagahkczdghoqkz`; además, la migración aplicada anteriormente superó su condición `current_user = 'postgres'`. [Inferencia] Esa evidencia previa es consistente con que, en aquella sesión, `current_user` fuese `postgres`, mientras que el preflight que falló comparó ese rol con el usuario de conexión del pooler. No se dispone de los valores `current_user` y `session_user` de la sesión fallida ni de la conexión diagnóstica nueva; permanecen pendientes de captura directa.

La corrección local preparada modifica solo la guarda del rol efectivo a `current_user = 'postgres'` y mantiene la comprobación de `current_database() = 'postgres'`. La asociación al proyecto autorizado se conserva en el lanzador por el host fijo `aws-0-us-east-2.pooler.supabase.com`, usuario de conexión `postgres.ivzjijagahkczdghoqkz`, puerto 5432, base `postgres`, TLS `verify-full` y CA con el checksum registrado. Antes de considerar suficiente esta asociación, la salida diagnóstica debe mostrar `session_user`, base y `\\conninfo` en la sesión real. La consulta también reporta atributos y privilegios del rol efectivo; no se cambia ningún permiso.

Se retiró del preflight local la comparación textual del ACL del helper. El wrapper preparado evalúa los permisos mediante `has_schema_privilege`, `has_function_privilege` y `aclexplode`, conservando la comprobación de propietario `postgres`, `BYPASSRLS`, `SECURITY DEFINER`, `search_path` vacío, denegación a `anon` y concesión a `authenticated`. Esta corrección es local; no se ha aplicado SQL remoto.

El archivo aprobado `tests/rls_geospatial.sql` permanece intacto y su SHA-256 local verificado es `76E957B2440692A1699967907F65C499B6600DCD2BB745549E4D2081E23D9243`. El lanzador de suite conserva la inclusión de ese archivo y no contiene inclusión de migración ni de `fixtures/seed.sql`. La suite no se ejecutó en esta tarea. Tampoco se ejecutaron migraciones, fixtures ni escrituras remotas.

### Diagnóstico de sesión pendiente

Para capturar los valores exactos de la misma ruta de conexión, el director debe ejecutar en una PowerShell visible:

```powershell
& "$env:LOCALAPPDATA\Temp\ubicate-f01h00-suite-runner\run-session-diagnostic.ps1"
```

El archivo SQL `session-diagnostic.sql` solo contiene `SELECT` sobre funciones de sesión y catálogo y el metacomando `\\conninfo`; el lanzador usa `psql` 17.11, `--no-psqlrc`, destino fijado al proyecto indicado, `sslmode=verify-full`, CA verificada y solicitud interactiva de contraseña. No incluye migración, fixtures ni suite. Hashes preparados: `session-diagnostic.sql` `820405ED648FC496B1B057FB56DD3775122A101F09D84715A5384C73F692D8AA`; `run-session-diagnostic.ps1` `5F75B435983C242AE7EA84D9C972DECBBB25E553F044B945FE9A9B41D7DB3F49`. La salida debe compartirse sin credenciales. El diagnóstico todavía no se ha ejecutado.

El wrapper de suite corregido y la consulta diagnóstica son artefactos temporales fuera del repositorio. La suite sigue sin ejecutar y F01-H00 permanece abierto. La ejecución de la suite solo podrá plantearse después de revisar la salida diagnóstica; este registro no constituye autorización para ejecutarla.

## Consolidación de la PoC RLS/PostGIS, 2026-10-16

Dirección reportó que la ejecución de `tests/rls_geospatial.sql` en `ivzjijagahkczdghoqkz` finalizó con `PSQL_EXIT_CODE=0` y `SUITE_RESULT=CONFIRMED`, alcanzó `ROLLBACK`, y no produjo errores SQL. El archivo ejecutado conserva el SHA-256 aprobado `76E957B2440692A1699967907F65C499B6600DCD2BB745549E4D2081E23D9243`. La suite usa `BEGIN`/`ROLLBACK`; los JWT se representaron mediante `set_config('request.jwt.claims', ...)` y `SET LOCAL ROLE`, por lo que son identidades simuladas dentro de PostgreSQL y no sesiones emitidas por Supabase Auth.

Se verificó localmente el log original `%LOCALAPPDATA%\Temp\ubicate-f01h00-suite-logs\rls-geospatial-20261016-204259.log`: existe, tiene 25,689 bytes y SHA-256 `5A771D2709998A8B279D4F4BA9A33EB10A3DD280805CB085766B6D1DA5CECE5D`, coincidente con el checksum reportado. El log registra preflight aprobado, el marcador `BEGIN`, `ROLLBACK`, `PSQL_EXIT_CODE=0`, `SQL_ERROR_MARKER=False` y `SUITE_RESULT=CONFIRMED`. También contiene la salida con eco del archivo, incluidas las comprobaciones de helper, anon, anunciantes A/B, administrador y búsquedas espaciales.

### Verificación remota de solo lectura

El 2026-10-16 a las 20:45:53 COT se consultó el proyecto mediante `supabase_ubicate` en solo lectura. La base fue `postgres`; el rol MCP que ejecutó la consulta fue `supabase_read_only_user`. Los conteos persistentes fueron: anunciantes 2, inmuebles 3, estados 3, unidades 4, espacios comunes 3 y disponibilidades 4.

Los inmuebles y precios observados coinciden con el fixture: `Casa de prueba A` (Centro, publicada; unidades a COP 650.000 y COP 480.000), `Casa de prueba B Norte` (Norte, borrador; unidad a COP 600.000) y `Casa de prueba B Sur` (Sur, publicada; unidad a COP 720.000). Los tres estados y los valores de título, sector y precio coinciden con `fixtures/seed.sql`.

Las seis relaciones exactas son tablas ordinarias (`relkind='r'`) y conservan `relrowsecurity=true`; hay 31 políticas. Se observó `relforcerowsecurity=false` en las seis; la PoC no exige FORCE RLS y esto no sustituye la revisión de roles propietarios y de servicio para una arquitectura de producción. El helper está en `private`, pertenece a `postgres`, cuyo rol tiene `BYPASSRLS`; conserva `SECURITY DEFINER` y `search_path` vacío. Los permisos efectivos observados son: `anon` sin `USAGE` en `private` ni `EXECUTE` del helper; `authenticated` con ambos; ACL `{postgres=X/postgres,authenticated=X/postgres}`. `anon` y `authenticated` no tienen `SELECT` sobre `owner_id`.

### Resultado de pruebas y alcance técnico

La salida del log y el código 0 confirman la suite aprobada: denegación a `anon` del helper privado y de datos privados/de borrador; lectura pública de anuncios publicados; aislamiento de datos del anunciante A y B, incluidos intentos de lectura y modificación cruzada por UUID conocido; lectura del borrador propio; comportamiento administrativo definido por las aserciones de la suite; y resultados geográficos esperados en radios de 250 m y 1 km. La transacción terminó con `ROLLBACK`. La lectura posterior confirma que se conservaron los recuentos, títulos, precios y estados sembrados.

La PoC valida el modelo relacional inmueble–unidad, reglas de publicación, consultas `ST_DWithin` sobre `geography`, la estructura de policies y el aislamiento bajo roles PostgreSQL y claims simulados. No valida registro real, confirmación de correo, inicio de sesión, recuperación de cuenta, emisión/verificación de JWT ni asignación de roles mediante Supabase Auth. Tampoco demuestra acceso por PostgREST con sesiones reales, recuperación de una copia mediante restauración, comportamiento bajo carga, cuotas de producción, almacenamiento de imágenes ni continuidad ante suspensión del proveedor. La PoC no constituye selección de Supabase como arquitectura definitiva.

### Security Advisor y límites pendientes

Se intentó consultar Security Advisor para el ref `ivzjijagahkczdghoqkz` el 2026-10-16 a las 20:45:53 COT. La herramienta devolvió exactamente `MCP error -32600: You do not have permission to perform this action` (`INVALID_ARGUMENT`). Por tanto no hay resultado actualizado del Security Advisor en esta consolidación. No se reutilizan como actuales los resultados históricos del dashboard. La consulta de catálogo de solo lectura sí confirmó los permisos efectivos descritos arriba.

Antes de adoptar una arquitectura o pasar a usuarios reales siguen pendientes pruebas de Supabase Auth, autorización mediante sesiones reales de dos anunciantes y administrador, exposición efectiva por Data API, restauración real del respaldo, evaluación de seguridad operativa y privacidad, límites/condiciones comerciales vigentes, cuotas y continuidad, así como pruebas de carga y comportamiento de mapas bajo el volumen de piloto que dirección defina. No se ejecutaron migraciones, fixtures, suite ni escrituras durante esta consolidación; F01-H00 permanece abierto y Supabase sigue siendo candidata evaluada.
