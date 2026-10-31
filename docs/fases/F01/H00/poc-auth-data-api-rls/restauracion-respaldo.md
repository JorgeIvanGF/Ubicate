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

## Ensayo integral autorizado: preflight bloqueado, 2026-10-20

Dirección autorizó un ensayo integral local, desechable y sin escrituras remotas, con 200 propiedades ficticias, 1.000 fotografías sintéticas, paquete cifrado e inventariado, y restauración en un segundo entorno aislado. Esta autorización no selecciona arquitectura ni reabre las PoC A/B ya documentadas. El preflight se ejecutó antes de exportar o crear recursos.

### Evidencia de preflight

| Comprobación | Estado | Evidencia observada |
| --- | --- | --- |
| Instrucciones y estado F01-H00 | PASS | Leídos `AGENTS.md`, `README.md`, política de autonomía, decisiones, spec/plan/tasks, evaluación, protocolo y documentos de las PoC/restore. El hito sigue abierto. |
| Árbol de trabajo | PASS | `git status --short` no reportó cambios al inicio del trabajo. |
| Docker CLI | PASS | `docker version`: cliente 29.8.2; `docker compose version`: 5.6.0. |
| Docker daemon | BLOCKED | `docker info` y `docker ps` no conectaron: falta el named pipe `//./pipe/dockerDesktopLinuxEngine`. La lectura elevada devolvió el mismo error. Docker mostró una advertencia de acceso denegado al archivo local de configuración; no se leyó ni modificó. |
| Supabase CLI | BLOCKED | `supabase --version` y `Get-Command supabase` no encontraron ejecutable en PATH. No se instaló nada. |
| Supabase MCP remoto autorizado | BLOCKED | El MCP Supabase disponible devolvió tres proyectos de otra cuenta; ninguno es `ivzjijagahkczdghoqkz`. No se consultó ni exportó el proyecto mediante una conexión distinta de `supabase_ubicate`. |
| Supabase MCP local | NOT RUN | No hay CLI ni daemon para levantar el stack local. |
| Chrome DevTools MCP | NOT AVAILABLE | No se expuso una herramienta Chrome DevTools MCP en esta sesión. No es bloqueante para exportación/restore y no se buscó sustituirla con una sesión web. |
| Exportación remota, Auth/config/Storage | NOT RUN | No se hizo ninguna consulta ni escritura remota para este ensayo; no se generó dump ni export de Auth, configuración o Storage. |
| Datos sintéticos adicionales | NOT RUN | No se generaron las 200 propiedades ni las 1.000 fotografías del ensayo. |
| Paquete cifrado, manifiesto y claves | NOT RUN | No se creó paquete, hash de ensayo ni clave nueva. No se expusieron secretos. |
| Restore en segundo entorno y validación | NOT RUN | No se crearon stacks, volúmenes, contenedores, archivos ni datos del ensayo. La restauración selectiva histórica descrita arriba no satisface este criterio integral. |
| Limpieza | NOT RUN | No hubo recursos del ensayo que limpiar. No se tocó el archivo temporal `Ubicate-Align-Local-Main.ps1` ni otros recursos previos. |

### Resultado y métricas

El ensayo quedó **BLOCKED en preflight**, antes de iniciar el cronómetro de recuperación. No hay tiempos de exportación, cifrado, restore, tamaños de paquete, consumo de CPU/RAM/disco, ni integridad medida para este ensayo. Por tanto, no se puede comparar RTO con 24 horas. RPO tampoco queda demostrado por una única simulación, aun si se habilita el entorno. La retención de siete respaldos diarios y cuatro semanales no se probó con archivos reales; el cálculo de capacidad y sus supuestos históricos permanecen solo como estimación en `evaluacion.md`.

### Clasificación de AC-04

**AC-04: BLOCKED / no satisfecho.** La prueba integral autorizada no llegó a ejecutarse por falta del daemon Docker y de Supabase CLI, y porque la conexión MCP de solo lectura requerida no está disponible en esta sesión. No hay FAIL técnico del mecanismo de respaldo/restauración, porque no se probó; el estado histórico de restauración selectiva permanece limitado a los seis objetos de la PoC. Para continuar se requiere restablecer el acceso local a Docker, proporcionar Supabase CLI en PATH y habilitar la conexión `supabase_ubicate` de solo lectura. Después se repetirá únicamente el preflight y se seguirá el alcance autorizado; no se repetirá la PoC A/B.

Este registro no cierra F01-H00, no certifica RPO/RTO, retención, operación programada, cuenta/proveedor ni arquitectura definitiva.

## Reanudación de prerrequisitos, 2026-10-20

Se intentó resolver los bloqueos técnicos sin acceder al proyecto remoto ni modificar otros servidores/proyectos.

| Comprobación | Estado | Evidencia |
| --- | --- | --- |
| Docker Desktop | PASS | `docker desktop start` terminó con código 0 usando un directorio de configuración Docker temporal, pues el CLI no podía leer su configuración local ni `contexts\meta`. No se cambiaron ACL, grupos, servicios ni políticas. |
| Docker daemon y contexto | PASS | Antes del inicio, `docker context show` indicó `default`. Después de `docker desktop start`, quedó seleccionado `desktop-linux` (`docker context ls`); no se ejecutó `docker context use`. `docker info` funcionó con la configuración normal y la temporal: Engine 29.8.2, 20 CPU, 16.618.201.088 bytes de memoria reportada, 25 contenedores y 16 imágenes. `com.docker.service` reportó `Stopped/Manual`, pero el daemon del contexto `desktop-linux` responde. |
| Identidad Windows | PASS, con observación | La identidad local del proceso varió entre invocaciones. Se omitieron nombres de cuenta y SID del repositorio público. No se cambiaron permisos para igualar identidades. Docker respondió bajo la identidad de la verificación exitosa. |
| Recursos previos de Docker | PASS, inspección | Se observaron cinco contenedores Supabase de una tarea anterior; los puertos `127.0.0.1:54321` y `127.0.0.1:54322` están ocupados. No se detuvieron ni modificaron. El uso agregado reportado fue 11,18 GB en imágenes y 5,201 GB en build cache. |
| Node/npm | PASS | Node.js `v24.18.0`; npm `11.18.0`. |
| Supabase CLI temporal | PASS | La versión estable consultada en npm y fijada para este ensayo fue `supabase@2.121.0`, instalada fuera del repositorio en `%TEMP%\ubicate-f01h00-prereqs\cli`. `--version` y `--help` respondieron correctamente. No se cambió PATH ni se instaló globalmente. Supabase documenta npm como instalación local y requiere Node 20+ para npm/npx ([guía oficial de CLI](https://supabase.com/docs/guides/local-development/cli/getting-started?platform=npm)). |
| Configuración MCP de proyecto | PASS | `.codex/config.toml` conserva el ref `ivzjijagahkczdghoqkz`, grupos `database,docs` y ahora `read_only=true`. |
| Configuración MCP global | PASS, escritura acotada | Se añadió únicamente `[mcp_servers.supabase_ubicate]` al archivo global de configuración de Codex, con el mismo ref, `read_only=true` y `database,docs`; sin credenciales ni cambios a otras entradas. La configuración previa no tenía una sección Supabase global. La documentación oficial admite la combinación de `project_ref`, `read_only=true` y `features` ([opciones de Supabase MCP](https://supabase.com/docs/guides/ai-tools/mcp)). |
| Servidor `supabase_ubicate` en el runtime | BLOCKED | Tras actualizar la configuración, la lista de herramientas del runtime no contiene `supabase_ubicate`. No se puede verificar su autenticación efectiva ni consultar el proyecto hasta que Codex vuelva a cargar la configuración y complete OAuth, si lo solicita. No se usó la conexión Supabase de otra cuenta. |
| Chrome DevTools MCP | BLOCKED, no esencial | La configuración global existente declara `npx -y chrome-devtools-mcp@latest`; la herramienta quedó disponible. `list_pages` falló porque el perfil de Chrome DevTools ya estaba abierto por otro proceso. No se cerró ese Chrome ni se cambió la configuración global. Este MCP no es necesario para exportación/restauración, que pueden verificarse con SQL, CLI y pruebas automatizadas. |
| Inicio del stack del ensayo | NOT RUN | Se conserva la instancia anterior intacta. No se eligieron puertos ni se levantó un stack hasta recuperar acceso MCP al origen y completar una exportación segura. |

### Intervención humana mínima pendiente

La configuración del servidor remoto quedó acotada y en solo lectura, pero el runtime de esta conversación no puede recargar MCPs desde archivo. Se requiere **reiniciar/reabrir la sesión de Codex en este proyecto** para que cargue `supabase_ubicate`. Si se abre OAuth, completar la autorización en el navegador con una cuenta que tenga acceso al proyecto objetivo; no compartir tokens ni credenciales por chat. Luego debe verificarse en la lista de proyectos/herramientas que la conexión corresponde al ref autorizado y que `read_only=true` está activo antes de consultar.

Hasta esa recarga y verificación, el preflight permanece **BLOCKED solo en la vía de exportación remota**. Docker y Supabase CLI ya están disponibles. No se consultó ni escribió en Supabase, no se generaron los datos sintéticos y no se crearon stacks del ensayo.

## Reanudación de MCP y preflight de exportación, 2026-10-20

Se verificó exclusivamente el servidor `supabase_ubicate`, configurado para el ref `ivzjijagahkczdghoqkz`. Las consultas se ejecutaron por `execute_sql` y fueron de solo lectura; no se modificaron permisos, configuración, usuarios ni datos remotos.

| Comprobación | Estado | Evidencia |
| --- | --- | --- |
| Conexión SQL | PASS | `SELECT current_database(), current_user, current_setting('transaction_read_only')` respondió `postgres`, `supabase_read_only_user`, `on`. |
| Seis tablas PoC | PASS | `to_regclass` confirmó presentes `ubicate_poc_advertisers`, `ubicate_poc_properties`, `ubicate_poc_publication_status`, `ubicate_poc_units`, `ubicate_poc_shared_spaces` y `ubicate_poc_availability`. |
| Privilegios de lectura observados | PASS, alcance limitado | El rol tiene `USAGE` y lectura de 27/27 tablas ordinarias de `auth`, 8/8 de `storage`, 6/6 de `public` y 1/1 de `extensions`; no tiene `CREATE` en esos esquemas. `private` tiene 0 tablas ordinarias. En `auth` existe una secuencia y el rol tiene privilegio `SELECT` sobre 1/1. |
| Credenciales locales reconocidas para exportar | BLOCKED | No existen en el entorno del proceso `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_URL`, `DATABASE_URL`, `PGPASSWORD`, `PGHOST` ni `PGUSER`. Tampoco existe `access-token` en las ubicaciones estándar `~/.supabase` y `%APPDATA%\supabase`. No se inspeccionaron valores secretos ni otros almacenes de credenciales. |
| Herramientas de exportación locales | BLOCKED | Supabase CLI `2.121.0` está disponible en `%TEMP%\ubicate-f01h00-prereqs\cli\node_modules\.bin\supabase.cmd`; `pg_dump` y `pg_restore` no están en `PATH`. No se instalaron dependencias. Docker Engine 29.8.2 responde en `desktop-linux`. |
| Exportación integral | NOT RUN | La sesión MCP permite las lecturas SQL observadas, pero esta evidencia no proporciona una credencial de conexión directa para `pg_dump`. No se verificó acceso de Management API para configuración/Auth ni acceso a los bytes de Storage. |

**Resultado del preflight:** las dos comprobaciones solicitadas pasaron y la conexión SQL es de solo lectura. La preparación local avanzó: Docker y Supabase CLI están disponibles. La exportación integral sigue **BLOCKED por credenciales y herramientas de dump no disponibles en el entorno comprobado**. Los privilegios SQL observados no prueban que exista una credencial directa utilizable por `pg_dump`, ni cubren bytes de Storage o exportación de configuración. No se solicitó permiso administrativo ni se usó otro MCP o conexión remota.

El ensayo no comenzó: no hay dump, export Auth/Storage/config, datos sintéticos, paquete cifrado ni segundo entorno creado en esta reanudación. RTO/RPO siguen sin medirse.

## Continuación de recuperación integral, 2026-10-20

Se retomó el ensayo sin repetir la restauración selectiva ni las PoC Auth/JWT/RLS completadas. Todas las consultas remotas se limitaron a lecturas mediante `supabase_ubicate` o comandos de consulta de Supabase CLI; no hubo escrituras remotas.

| Comprobación | Estado | Evidencia |
| --- | --- | --- |
| Cliente PostgreSQL portátil | PASS | `%TEMP%\ubicate-postgresql-client-17.11\client\bin\pg_dump.exe`, `pg_restore.exe` y `psql.exe` reportan versión 17.11. Se reutilizó el CA existente `prod-ca-2021.crt`; el lanzador anterior documenta TLS `verify-full` y el pooler de sesión `aws-0-us-east-2.pooler.supabase.com:5432`. No se instaló software. |
| Supabase CLI | PASS | CLI 2.121.0 existe bajo `%TEMP%\ubicate-f01h00-prereqs\cli`; `projects list` terminó con código 0 y mostró el ref objetivo. `db dump --project-ref ... --dry-run` terminó con código 0; no generó dump ni conectó para extraer datos. |
| Configuración de plataforma | PASS, lectura | `config pull --dry-run` y luego `config pull` terminaron con código 0. El archivo se guardó fuera del repositorio bajo el perfil local de usuario, en `AppData\Local\Ubicate\F01-H00\export-trial-20261020\supabase\config.toml`; la carpeta y el archivo muestran atributo EFS `Encrypted`. No se imprimió su contenido ni se trasladó al repositorio. |
| Edge Functions y secretos | PASS, lectura limitada | CLI devolvió 0 funciones y 7 nombres de secretos. No se leyeron ni imprimieron valores; los valores de secretos no forman parte de `secrets list` y deberán reintroducirse por un custodio si fueran necesarios. |
| Storage | PASS, lectura | SQL agregado devolvió 0 buckets, 0 objetos y 0 bytes. `supabase storage ls --project-ref ... --experimental` terminó con código 0. No se descargaron archivos porque el inventario está vacío. |
| Modo MCP | PASS | `.codex/config.toml` conserva `project_ref=ivzjijagahkczdghoqkz`, `read_only=true` y `features=database,docs`; SQL reportó `transaction_read_only=on`. |
| Credencial PostgreSQL directa | BLOCKED | `SUPABASE_DB_PASSWORD`, `PGPASSWORD` y URI directas no están presentes en el proceso. La CLI tiene autenticación de Management API, pero `db dump --dry-run` no valida la contraseña de base de datos. El password existente de PostgreSQL no se obtuvo ni se restableció. |
| Clave de recuperación externa | BLOCKED | No hay archivo de clave receptora en el área F01-H00 revisada ni keyring GPG local. GPG está disponible en Git for Windows, pero no se generó una clave sin que el responsable pueda custodiar su contraparte privada fuera del equipo. |
| Docker y puertos | PASS, inspección | Siguen activos 5 contenedores previos con puertos publicados/escuchando `54321` y `54322`. No se alteraron. En el muestreo, `55000-55019` estaban libres y son candidatos; deben revalidarse al iniciar las pilas. No se creó ningún contenedor, volumen ni pila del ensayo. |
| Lanzador local | PASS, preparación | Se creó `%TEMP%\Ubicate-F01-H00-export-preflight\capture-postgres-dump.ps1`, con revisión sintáctica PowerShell sin errores. Usa `pg_dump` 17.11, TLS `verify-full`, EFS y el prompt oculto de contraseña. El script no contiene credenciales y no se ejecutó. |

### Resultado y siguiente intervención indispensable

El acceso de CLI al proyecto y a la configuración recuperable está disponible. El inventario de Storage está vacío. La exportación PostgreSQL integral continúa **BLOCKED únicamente por falta de acceso local a la contraseña PostgreSQL existente**; no se puede verificar desde `supabase_ubicate` porque su sesión es de solo lectura y la credencial no se expone al proceso. Para producir el dump de solo lectura ya está preparado un lanzador local que usa el `pg_dump` 17.11 existente, TLS `verify-full` y el prompt oculto de libpq. El responsable debe ingresar la contraseña localmente; nunca por chat. No restablecerla ni cambiar permisos.

También se necesita una clave pública OpenPGP receptora cuya clave privada esté custodiada fuera del equipo y disponible para la restauración. No se generó ni exportó material de clave. Tras contar con la credencial ingresada localmente y la clave receptora, se puede ejecutar el dump, empaquetado cifrado, las dos pilas aisladas, el fixture de 200 propiedades y 1.000 fotos sintéticas, la restauración limpia, las verificaciones y la limpieza exclusiva de recursos del ensayo.

El ensayo sigue sin iniciar: no existe dump, paquete, fixture sintético ni pila nueva. RTO/RPO y consumo de recursos siguen sin medirse. F01-H00 continúa abierto.

### Higiene de metadatos locales de CLI

Durante la verificación apareció `supabase/.temp/` sin seguimiento de Git. Se inspeccionaron sus nombres de propiedades sin mostrar valores: `linked-project.json` contenía únicamente `ref`, `name`, `organization_id` y `organization_slug`, con el ref esperado; no había campos con nombres de password, token, secreto o clave. `cli-latest` contenía una versión. Ambos archivos y sus directorios vacíos se eliminaron después de confirmar que eran los únicos elementos de esa carpeta. No se detectaron credenciales ni quedó el directorio temporal en el repositorio.

## Auditoría de lanzador y preflight criptográfico, 2026-10-20

Se leyó completo `%TEMP%\Ubicate-F01-H00-export-preflight\capture-postgres-dump.ps1`; no se ejecutó contra el proyecto. El destino efectivo es `$PSScriptRoot\postgres-full.dump`, el TOC y el manifiesto en el mismo directorio. El archivo está fuera del repositorio. El script fija el pooler `aws-0-us-east-2.pooler.supabase.com:5432`, base `postgres` y usuario `postgres.ivzjijagahkczdghoqkz`; el ref aparece en el usuario y el manifiesto. TLS usa `PGSSLMODE=verify-full` y el CA existente. Rechaza variables `PGPASSWORD`/`SUPABASE_DB_PASSWORD`; `pg_dump --password` no recibe la contraseña como argumento y la solicita mediante libpq. El texto del script no contiene secretos.

La revisión también encontró brechas que impiden usar el lanzador sin corregirlo: depende de `$PSScriptRoot` en vez de exigir la ruta aprobada; no verifica identidad/base/rol ni `transaction_read_only` en una conexión previa; no fuerza `default_transaction_read_only`; no comprueba en el TOC que estén `auth` y `storage`; y, si falla `pg_restore --list` o una validación posterior, puede dejar el dump sin cifrar en el disco. EFS se comprueba después de crear el archivo, no antes. El ACL heredado permite modificar el directorio a un grupo local adicional; no se cambiaron permisos. No se imprimieron valores secretos ni se inició exportación.

GPG 2.4.9 y `pinentry-w32` están disponibles. Una prueba con texto ficticio confirmó que un archivo nuevo en el directorio de exportación sí hereda EFS; el directorio temporal padre no lo hereda. La identidad/certificado EFS local no es una clave de recuperación externa y no sustituye al cifrado OpenPGP. No hay unidades USB conectadas ni se generó clave. Antes del dump se generará o importará una clave receptora en un flujo con pinentry, se exportará solo su clave pública a la carpeta temporal EFS y se custodiará la clave privada protegida por contraseña en un medio removible y una copia independiente. Se cifrará y descifrará allí un archivo ficticio para comprobar recuperación. Solo después se corregirá el lanzador y se ejecutará la exportación autorizada.

## Validación de clave OpenPGP con archivo ficticio, 2026-10-20

El responsable conectó una memoria extraíble FAT32. GPG 2.4.9 generó en ella una clave primaria Ed25519 para certificación/firma y una subclave Curve25519 para cifrado, con protección de contraseña introducida en Pinentry. GPG creó también el certificado de revocación en el mismo llavero externo. Se exportó solo la clave pública a `%TEMP%\Ubicate-F01-H00-export-preflight\recipient-public.asc`; el archivo heredó EFS. No se registró fingerprint, material privado ni contraseña.

Se cifró un texto ficticio de control con un llavero temporal que recibió únicamente la clave pública y se comprobó que ese llavero no contenía archivos de clave privada. Tras cerrar el agente GPG, el descifrado desde el llavero de la USB volvió a solicitar la contraseña en Pinentry. La operación terminó con código 0 y el SHA-256 del resultado coincidió con el archivo sintético original. Los tres archivos sintéticos y el llavero público temporal se eliminaron; se conservó únicamente la clave pública en el área temporal EFS. Los agentes GPG de la prueba se cerraron.

La prueba valida cifrado y recuperación criptográfica con la clave privada externa. Solo hay una memoria conectada; falta crear una copia de recuperación independiente antes de arriesgar un respaldo de datos reales. El dump PostgreSQL continúa **NOT RUN**. El lanzador también debe corregirse para verificar identidad/base/modo de solo lectura, cubrir `auth` y `storage` en la validación, fijar el destino y no dejar un archivo sin cifrar si falla cualquier paso.

## Revisión final del lanzador y estado de la copia externa, 2026-10-20

Se reemplazó el lanzador temporal auditado por una versión con controles adicionales. El destino se fija a `%TEMP%\Ubicate-F01-H00-export-preflight` y exige que el directorio tenga EFS antes de abrir una conexión. El host del pooler, puerto, usuario con el ref del proyecto y base `postgres` quedan fijados en el script; usa el CA existente y `PGSSLMODE=verify-full`, configura `default_transaction_read_only=on`, y pide la contraseña mediante prompts locales de `psql` y `pg_dump`. No lee ni escribe contraseñas en variables de entorno.

Antes del dump, el script exige una sola clave pública receptora en un keyring GPG temporal que no contiene material privado y valida `current_database()`, `current_user` y `transaction_read_only=on`. Después inspecciona el TOC de `pg_restore --list` para exigir `auth.users`, `storage.buckets`, `storage.objects` y las seis tablas `public.ubicate_poc_*`; cifra el archivo con la clave pública y registra hashes y metadatos sin contraseña. Si falla una etapa, elimina los artefactos de salida parciales. El dump de trabajo se guarda bajo EFS y se elimina del directorio al terminar; esa eliminación no certifica borrado físico irrecuperable de bloques del disco. El paquete cifrado permanece EFS además de OpenPGP.

El análisis de sintaxis de PowerShell terminó sin errores. No se ejecutó `psql`, `pg_dump` ni se abrió una conexión remota; por tanto, este ajuste no certifica que el rol tenga visibilidad de todas esas tablas, que el TOC real supere los controles o que el archivo pueda restaurarse. La exportación real permanece **NOT RUN** y AC-04 sigue abierto. La prueba GPG con datos ficticios sí confirmó que la clave actual cifra y descifra con SHA-256 coincidente. Falta recibir y comprobar una copia de recuperación de la clave privada en el segundo medio externo que el responsable indicó que conectará. `supabase_ubicate` no se usó para escritura ni se modificó su configuración o permisos.

## Copia independiente de clave recuperada y validada, 2026-10-20

Corrección de estado: la segunda unidad ya estaba conectada; la comprobación anterior no la reconoció porque Windows la presentó como disco fijo USB. La enumeración PnP mostró dos dispositivos USB de almacenamiento: Kingston DataTraveler y Toshiba External USB. Se distinguieron del volumen de Google Drive. En el disco Toshiba se creó únicamente la carpeta nueva `Ubicate-F01-H00-RecoveryCopy`; no se formateó ni se modificó otro contenido.

Se exportó allí `recovery-secret-key.asc` (866 bytes) desde el llavero primario. La inspección de paquetes GPG terminó con código 0 y confirmó que el material secreto exportado está protegido. En el segundo medio se importó esa copia en un llavero temporal, se cifró un archivo sintético y se descifró después de cerrar el agente GPG. El SHA-256 del resultado coincidió con el original. Se eliminaron el archivo de prueba, su cifrado, el resultado y el llavero temporal. La carpeta de custodia secundaria conserva solo la exportación de clave protegida; no quedan procesos GPG de la prueba. No se registró contraseña, clave privada ni fingerprint.

La custodia en dos medios y la recuperación con un archivo ficticio están **PASS**. El dump PostgreSQL real continúa **NOT RUN**. Sigue pendiente ejecutar el lanzador ya revisado, introducir la contraseña PostgreSQL existente dos veces en prompts locales ocultos (primero la comprobación de identidad, después `pg_dump`) y validar que el archivo real incluya los objetos esperados. No se ha iniciado conexión PostgreSQL ni se modificó Supabase remoto.

### Diagnóstico del primer lanzamiento, 2026-10-20

El primer intento del lanzador se detuvo en la importación de la clave pública al llavero temporal, antes de iniciar `psql` o `pg_dump`. La ventana mostró `STOP: public-key import failed`; no se produjo conexión a PostgreSQL ni archivo dump. El diagnóstico local de GPG identificó que no se iniciaba `gpg-agent` desde el entorno nuevo. Se corrigieron la conversión de rutas Windows/MSYS, `PATH` de los binarios GPG y la configuración temporal de Pinentry. La importación de la clave pública en la ruta EFS completa volvió a ejecutarse con código 0; se verificó una clave pública y cero claves privadas en ese llavero. El agente temporal se cerró y el directorio de diagnóstico se eliminó. La exportación real todavía no se ha iniciado.

### Diagnóstico del segundo lanzamiento y control de solo lectura, 2026-10-20

En el siguiente intento la importación GPG pasó y `psql` autenticó contra el endpoint fijado. La consulta devolvió base `postgres`, rol `postgres` y valor de sesión `transaction_read_only=off`. El lanzador abortó antes de invocar `pg_dump`; no se creó dump, TOC, manifiesto ni cifrado. Ese valor corresponde a la sesión de comprobación y no acredita por sí solo que `pg_dump` haya escrito datos.

Se revisó la fuente oficial de PostgreSQL 17.11: el binario inicia una transacción y ejecuta `SET TRANSACTION ISOLATION LEVEL REPEATABLE READ, READ ONLY` antes de leer el contenido. El lanzador temporal ahora verifica además la versión exacta 17.11, prueba explícitamente `BEGIN READ ONLY`, comprueba dentro de ella base `postgres`, rol `postgres` y `transaction_read_only=on`, y aborta si cualquiera difiere. No se omitió el control ni se inició aún `pg_dump`.

La comprobación sintáctica del lanzador pasó y el ejecutable local informó `pg_dump (PostgreSQL) 17.11`. No se ha ejecutado todavía la nueva transacción explícita ni la exportación. Próximo paso: volver a ejecutar el preflight visible; introducir la contraseña solo en su prompt oculto. Solo si la transacción explícita informa la identidad esperada y `on`, el mismo lanzamiento continuará con `pg_dump`, el listado TOC y cifrado OpenPGP. La salida de la sesión anterior no se conservó con secretos.

### Diagnóstico del tercer lanzamiento, 2026-10-20

La consulta de identidad ejecutada dentro de `BEGIN READ ONLY` terminó con código 0, pero el lanzador rechazó la salida porque no encontró exactamente una línea de tres campos. Se detuvo antes de `pg_dump`; el manejador limpió los artefactos parciales y no se generó un archivo de exportación.

[Inferencia] La consulta contiene `BEGIN`, `SELECT` y `ROLLBACK`, por lo que la salida puede incluir etiquetas de comandos además de la fila SQL; no se conservó la salida cruda para confirmarlo. El lector se ajustó para activar `psql --quiet` y seleccionar únicamente la línea con tres campos separados por `|`, manteniendo la exigencia de exactamente una fila, base `postgres`, rol `postgres` y modo `on`. El análisis sintáctico volvió a pasar. Falta ejecutar otra vez el preflight para comprobar la salida real. No se ha invocado `pg_dump`.

## Exportación PostgreSQL y verificación de recuperación, 2026-10-20

El responsable ejecutó el lanzador temporal e informó la salida `PG_DUMP_EXIT=0; READ_ONLY_PROBE=PASS; AUTH_STORAGE_AND_SIX_TABLES=PASS; GPG_ENCRYPT_EXIT=0; ARCHIVE_ENTRIES=1408; ENCRYPTED_BYTES=86085; PLAINTEXT_FILE_REMOVED=true`. El manifiesto local EFS identifica el ref `ivzjijagahkczdghoqkz`, la base `postgres`, `transaction_read_only=on`, 1.408 líneas del listado TOC y un archivo PostgreSQL de 641.565 bytes. SHA-256 del archivo en claro: `BFFB3BA111DFFFBF75F07B8243569DDB2C842438BDDF98663E67EF2C5576ADEB`. El archivo OpenPGP mide 86.085 bytes y su SHA-256 es `4E18A50DABC651ABF8D2EA46C0D937A159AA67051A611254F5D881A498251252`. El dump en claro no quedó en la carpeta de exportación. Estos metadatos no incluyen la contraseña ni el contenido de filas.

La copia protegida de la clave privada en el medio independiente se usó para descifrar el archivo real. La salida fue `RECOVERY_COPY_DECRYPT=PASS; SHA256_MATCH=true; PG_RESTORE_LIST=PASS; TOC_LINES=1408`. La comprobación local confirmó además que el archivo temporal descifrado y el llavero GPG temporal ya no existían tras finalizar el proceso.

En la primera ejecución del verificador, GPG descifró el archivo y el código llegó a la comprobación del TOC, pero el patrón PowerShell buscó barras invertidas literales por tener escapes duplicados. Se corrigieron los tres patrones de esquemas/tablas, se analizaron sintácticamente y se probaron contra el listado TOC guardado; el verificador final desde la copia de recuperación pasó. No hubo cambio en la exportación, la clave custodiada ni el proyecto remoto.

Esta evidencia valida la exportación lógica de la base PostgreSQL y su recuperación criptográfica. [`pg_dump` de PostgreSQL 17](https://www.postgresql.org/docs/17/app-pgdump.html) exporta una base de datos; no empaqueta por sí solo bytes de Storage ni los ajustes externos al catálogo SQL. El inventario remoto previamente observado fue de cero buckets, cero objetos y cero bytes; la configuración recuperable se obtuvo por separado y permanece fuera del repositorio en EFS. Los valores de los secretos de Edge Functions no se obtuvieron; solo se había observado el número y los nombres, por lo que no forman parte de un respaldo restaurable. El ensayo local y sus artefactos siguen pendientes, incluidos el dataset sintético, el respaldo con fotos y la restauración limpia.

## Cifrado del almacenamiento Docker, 2026-10-21

Antes de importar el dump con datos reales a Docker se intentó comprobar el cifrado en reposo del volumen del sistema. `Get-BitLockerVolume -MountPoint C:` devolvió `Access denied` y que no podía asociar C: a un volumen BitLocker. Después, `manage-bde.exe -status C:` también devolvió `An attempt to access a required resource was denied` e indicó que se requieren derechos administrativos. El segundo comando se ejecutó fuera del sandbox, pero Windows no concedió acceso administrativo. Por tanto, el estado de cifrado de C: **no está verificado**; no se concluye que esté cifrado ni que esté sin cifrar.

No se descifró el archivo hacia Docker ni se crearon redes, contenedores o volúmenes del ensayo en esa revisión. El respaldo OpenPGP continúa en la carpeta temporal EFS y la copia de recuperación permanece en medios removibles.

### Confirmación de Windows

El responsable mostró la página `Privacidad y seguridad > Cifrado del dispositivo` con el estado `On`. Microsoft documenta que Device Encryption activa cifrado BitLocker para la unidad del sistema operativo y unidades fijas ([documentación de Microsoft](https://support.microsoft.com/es-es/windows/security/encryption/device-encryption-in-windows)). No se cambió el ajuste ni se compartió una clave de recuperación. `manage-bde` sigue sin poder consultar desde esta sesión el porcentaje/estado detallado; la evidencia del estado habilitado es la captura del responsable. Con esta confirmación se retoma el restore en Docker, usando puertos y redes aislados y registrando esta limitación de verificación del host.

## Restauración PostgreSQL local y estado del ensayo, 2026-10-21

### Entornos y fixture

Se crearon dos redes bridge y dos pilas Supabase locales exclusivas del ensayo. La pila de preparación publicó API en `127.0.0.1:55550` y PostgreSQL en `127.0.0.1:55551`; la pila de restauración limpia publicó API en `127.0.0.1:55650` y PostgreSQL en `127.0.0.1:55651`. Ambas bases usan la imagen `public.ecr.aws/supabase/postgres:17.11.0.004`, volúmenes nombrados propios y puertos ligados a loopback. Los contenedores y volúmenes existentes de otros ensayos se dejaron intactos.

Se generó el fixture bajo `%TEMP%\Ubicate-F01-H00-export-preflight\integral-rehearsal\dataset`, con 200 propiedades ficticias y 1.000 JPEG sintéticos de 640x480. El manifiesto registró 16.870.830 bytes y cero fotos sin EFS. No se copiaron direcciones ni fotos reales.

### Resultado de restauración de la base

El primer intento de `pg_restore` falló porque el rol local `postgres` no era propietario del event trigger `pgrst_drop_watch`; la consulta de catálogo identificó a `supabase_admin` como propietario y superusuario local. El segundo intento usó `supabase_admin`, pero el target preinicializado contenía dependencias entre `storage.buckets_analytics` e `storage.iceberg_namespaces`/`storage.iceberg_tables`; `pg_restore --clean` no pudo eliminar la restricción en ese orden y la transacción se revirtió.

En el tercer intento se recreó únicamente la base `postgres` del volumen de preparación desde `template0`, dentro del contenedor nuevo del ensayo. El dump se descifró en el directorio EFS, se verificó contra el SHA-256 del manifiesto, pasó `pg_restore --list` y se restauró como `supabase_admin` con `--single-transaction`, `--no-owner` y ACL del dump habilitadas. `pg_restore` terminó con código 0. Nueve consultas de conteo sobre las seis tablas PoC, `auth.users`, `storage.buckets` y `storage.objects` pasaron. No se mostraron ni se copiaron al repositorio valores de filas. El informe EFS conserva conteos agregados.

El proceso `pg_restore` duró 0,808 s en esta máquina. No es el RTO del servicio: el stack no alcanzó salud integral y no se hizo la verificación final de API/Auth/Storage. El intento total incluyó interacción de recuperación y espera de salud, por lo que no se usa como medida RTO.

### Salud posterior y estado de seguridad local

Después de la restauración, PostgreSQL quedó `healthy`, Kong `healthy` y REST `running`. Los contenedores Auth, Realtime y Storage quedaron `unhealthy` y en reinicio; Docker registró 12 reinicios en cada uno. No se aisló la causa. La segunda pila permanecía en su configuración limpia sin datos del dump.

La salida final comunicada del lanzador fue `SOURCE_RESTORE=FAIL; STAGE=health-check; ERROR_TYPE=; PLAINTEXT_REMOVED=True; TEMP_KEYRING_REMOVED=True`. El campo `ERROR_TYPE` llegó vacío; no aporta una causa más específica que el fallo del chequeo de salud.

El archivo descifrado de trabajo y el llavero GPG temporal se eliminaron. La exportación cifrada y los informes permanecen fuera del repositorio bajo EFS. Después de registrar la falla de salud se detuvieron los 12 contenedores de las dos pilas del ensayo. Sus volúmenes y redes se conservaron, incluida la base local que contiene la restauración PostgreSQL, para revisión autorizada. La captura de Windows mostró `Device encryption: On`; no se cambiaron ajustes de cifrado.

No se insertaron las 200 propiedades en la base, no se cargaron los 1.000 JPEG a Storage, no se produjo un respaldo cifrado final del fixture y no se ejecutó la segunda restauración. Tampoco se midieron RTO/RPO completos, recursos ni retención. No hubo escrituras remotas y `supabase_ubicate` permaneció en modo de solo lectura.

### Clasificación actual

AC-04 permanece **parcial, bloqueado y no satisfecho**. Se agotaron tres iteraciones de corrección en la unidad de restore conforme a `docs/direccion/autonomia-supervisada.md`; no se intentó una cuarta. Para seguir se requiere intervención humana que autorice una nueva unidad de diagnóstico local enfocada en la salud de Auth, Realtime y Storage después del restore. F01-H00 continúa abierto.

El manifiesto de ejecución y sus conteos agregados están en EFS, fuera del repositorio: `%TEMP%\Ubicate-F01-H00-export-preflight\integral-rehearsal\source-actual-restore.json`. Las contraseñas, claves y filas no se incluyeron en los documentos.
