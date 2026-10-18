# F01-H00: protocolo técnico de evaluación inicial

**Estado vigente, 2026-10-17:** la PoC PostgreSQL/PostGIS/RLS fue ejecutada y confirmada en el proyecto aislado; la validación esencial Auth/JWT/Data API/RLS A/B también pasó, y la PoC local de optimización fotográfica está documentada en [evaluación](evaluacion.md). Las evidencias están en [PoC PostGIS](poc-postgis-rls/README.md) y [PoC Auth/Data API](poc-auth-data-api-rls/README.md). Este archivo conserva protocolos y estados iniciales fechados; las frases de preparación/no ejecución reflejan su fecha y no son el estado vigente.
**Revisión de fuentes oficiales:** 2026-10-16.
**Candidatas autorizadas para evaluar:** Supabase Free, MapLibre GL JS y OpenFreeMap. Esta autorización no implica adopción.

## Alcance y aislamiento

La evaluación pertenece solo a Ubícate y usa el entorno aislado identificado por dirección. No abrir, inspeccionar, modificar, transferir ni vincular el proyecto “Gestor de Citas Médicas” ni otros proyectos del usuario. No copiar datos, secretos, configuraciones, miembros o permisos entre proyectos. No incluir credenciales en Git, fixtures, capturas o registros.

No se hacen cambios al prototipo H03 ni se implementa el MVP. Las pruebas con plataforma externa se detienen antes de crear recursos hasta la autorización específica descrita al final.

## Candidatos y condiciones públicas comprobadas

### Supabase Free

- La documentación vigente lista un límite agregado de dos proyectos Free entre las organizaciones donde la persona sea Owner/Admin, 500 MB de base de datos por proyecto, 1 GB de Storage, 50.000 usuarios activos mensuales y 500.000 invocaciones de Edge Functions. Storage documenta 5 GB de bandwidth cacheado y 5 GB no cacheado. Egress de base de datos es otra métrica; no sumar ni intercambiar cuotas entre categorías. Las cuotas pueden cambiar y se deben volver a revisar al iniciar una prueba.
- Al exceder la cuota de base de datos Free, el proyecto puede pasar a solo lectura. Las políticas de uso justo pueden restringir servicios ante excesos reiterados. Los proyectos Free con baja actividad durante siete días pueden pausarse. La ventana publicada de restauración de un proyecto pausado es de un año; esto no sustituye una copia independiente.
- La documentación de control de costos dice que el plan Free no cobra por excesos: se restringe el servicio según Fair Use. Esto no prueba cómo está configurada la cuenta concreta ni evita que una persona cambie la organización a un plan pago.
- SMTP compartido de Supabase es para pruebas/no producción, limita a destinatarios autorizados y actualmente indica dos correos por hora. **Se excluye de cualquier prueba de entrega a usuarios.** No se enviarán correos reales en esta fase documental.
- PostGIS está disponible como extensión PostgreSQL. Se probará habilitación en esquema no expuesto por la Data API, tabla con `geography(Point, 4326)`, índice GiST y consultas `ST_DWithin`.
- La documentación pública no determina si la interfaz de alta, con el estado actual de esta cuenta y sus organizaciones, exigirá tarjeta. Tampoco se ha comprobado que exista espacio disponible en la cuota Free de la cuenta. Ambas comprobaciones requieren inspección humana del flujo antes de crear el recurso.
- Los términos públicos de Supabase restringen revender o hacer disponible el servicio a terceros. La aplicación propuesta consume Supabase como backend subyacente, pero la compatibilidad jurídica exacta del modelo comercial y los términos de cuenta deben revisarse. Este documento no certifica autorización legal comercial.

### MapLibre GL JS

- La biblioteca es software abierto bajo licencia BSD de tres cláusulas. Su licencia no suministra mapas, geocodificación, hosting ni datos; esas partes se evalúan por separado.
- La prueba propuesta usa un mapa vectorial con fuente de OpenFreeMap, controles de navegación, marcadores sintéticos y un control de atribución siempre visible. No se añade geocodificador ni dependencia adicional en esta fase.

### OpenFreeMap

- Su sitio oficial indica que el servicio público no requiere cuenta, registro, API key ni pago, no impone un límite publicado de vistas/solicitudes y permite uso comercial. La atribución indicada es “OpenFreeMap © OpenMapTiles Data from OpenStreetMap”; MapLibre la incorpora mediante la fuente/estilo.
- Sus términos vigentes (14/10/2026) ofrecen el servicio “as-is”, sin garantía de disponibilidad o precisión, y permiten discontinuarlo. No hay SLA ni soporte personalizado. Acepta uso de navegador normal; descarga offline tiene condiciones particulares de cantidad y concurrencia, fuera de esta prueba.
- La política de privacidad consultada el 16/10/2026 describe logs de acceso anonimizados con tipo de navegador, página referente, fecha/hora y sistema operativo; ante errores pueden incluir IP y URL solicitada, con borrado publicado a siete días, y ante incidentes puede habilitarse logging temporal de IP hasta 30 días. También indica posible uso de Cloudflare CDN. Debe evaluarse la fuga de la zona visible por solicitudes de tiles y los referentes antes de mostrar ubicaciones de usuarios; no se envió solicitud de tiles en esta revisión.
- Intento local de una única lectura GET del estilo oficial `https://tiles.openfreemap.org/styles/liberty` desde PowerShell: falló en el establecimiento TLS (`The SSL connection could not be established`). No se deshabilitó validación TLS ni se repitió la solicitud desde otra ruta; el resultado no permite concluir que el servicio esté caído. El smoke test de acceso/render sigue pendiente.
- El servicio público y el contenido de mapa dependen de terceros. Una afirmación de cuota ilimitada no equivale a disponibilidad garantizada ni a límite de consumo contractual. La alternativa de salida es cambiar la URL de estilo/fuente a otro proveedor o autoalojar los datos y tiles bajo evaluación y operación separadas.

## Recursos de prueba propuestos

| Recurso | Prueba | Situación |
| --- | --- | --- |
| Repositorio | fixtures JSON y verificador Python estándar | Local, preparado y ejecutado |
| PostgreSQL/PostGIS | proyecto Supabase aislado, datos ficticios, policies y consultas de prueba | PoC SQL confirmada en PostgreSQL 17.11; clientes `psql`/`pg_dump`/`pg_restore` 17.11 se usaron desde distribución portable. No se instaló servidor local ni se ejecutó Docker |
| Supabase Auth | sesión/JWT y autorización sin correo, solo con identidad y operaciones expresamente autorizadas | No ejecutado; cualquier identidad real o escritura remota requiere autorización específica. Confirmación y recuperación por correo se difieren fuera de F01-H00 y se validarán antes de usuarios reales |
| Supabase Storage | fotos sintéticas no personales, límite y policies | Pendiente de cuenta; no se carga material editorial ni fotos reales |
| OpenFreeMap | peticiones web normales a tiles y estilos públicos desde un cliente local; registrar respuesta/atribución y fallback | No requiere cuenta según documentación; smoke test del cliente visual aún pendiente. No se consultó el servicio durante la PoC SQL |
| Copias | dump PostgreSQL, export separado de Auth/config/Storage y copia cifrada local independiente | Diseñado, no ejecutado; objetivos RPO/RTO y destino siguen pendientes |

### Plan de límites y parada

- Mantener el proyecto en Supabase Free, sin seleccionar plan pago, medio de pago, add-on, compute adicional, custom domain ni upgrade.
- Antes de crear: dirección debe confirmar en la interfaz `Free`, costo mensual USD 0, ausencia de método de pago obligatorio, ausencia de cambio automático de plan y cupo de proyectos. Si un punto no se puede verificar, cancelar la creación.
- En pruebas, fijar tope del conjunto a 20 anuncios sintéticos, 5 fotos de prueba por anuncio como máximo, máximo 250 KB por archivo y menos de 20 MB de objetos en total. No ejecutar carga masiva, prueba de estrés ni descargas offline de tiles.
- Revisar uso al inicio y final de cada sesión. Detener si aparece aviso de upgrade, facturación, método de pago, cuota inesperada, suspensión, servicio inesperado o acceso a cualquier recurso ajeno a Ubícate.
- OpenFreeMap no presenta un límite contractual de vistas, pero evitar bucles/prefetch y mantener caché HTTP normal. No automatizar barridos ni descargar regiones.
- Borrar organización/proyecto de evaluación y artefactos remotos al terminar, después de exportar resultados no sensibles, comprobar eliminación y guardar acta. No borrar ni tocar otro proyecto.

## Datos ficticios y casos Tunja

El archivo [`fixtures-tunja.json`](fixtures-tunja.json) contiene anunciantes sintéticos, inmuebles con varias unidades, una habitación y coordenadas de prueba generadas. Son puntos y sectores de ensayo (“Centro”, “Norte”, “Sur” y “Occidente”), **no polígonos oficiales, direcciones, propiedades reales ni representación validada del tejido urbano**. No se deben mostrar a usuarios como inventario real.

Casos espaciales propuestos:

1. Centro de mapa dentro del punto de prueba del sector Centro: devolver solo las unidades dentro del radio de 1 km, con filtro de precio y disponibilidad.
2. Búsqueda desde punto Norte: devolver los resultados dentro del radio; excluir el punto Sur. Comparar `ST_DWithin` en metros con selección visual.
3. Consultar el punto en el límite del radio y otro a 20 m fuera para verificar inclusividad y conversión de metros.
4. Verificar orden de cercanía, paginación estable, ausencia de duplicados cuando un inmueble contiene varias unidades y conteos coherentes.
5. Cargar mapa sin tiles o con respuesta fallida simulada: lista de resultados sigue accesible, mensaje explica el fallo y los marcadores no inventan cobertura.
6. No inferir precisión de sectores a partir de puntos sintéticos. Para aceptar el ajuste a Tunja, dirección debe aportar sectores/puntos de búsqueda que apruebe y su definición de precisión.

## Protocolo técnico y aceptación

### PostgreSQL/PostGIS

- Esquema de prueba: `extensions` para PostGIS y esquema de aplicación separado. No exponer tablas de prueba al cliente sin RLS.
- Entidades mínimas: advertiser, property, rental_unit, listing_photo y availability. FK e integridad para inmueble → unidades y unidad → fotos.
- Insertar los fixtures y consultar radios de 250, 1.000 y 2.000 m; comparar IDs esperados y distancia calculada localmente con `ST_DWithin` y GiST.
- **Aceptación:** extensión habilitada sin exponer esquema de sistema; restricciones e índices presentes; resultados coinciden con los esperados, sin duplicados y con orden determinista.
- La PoC SQL/PostGIS se ejecutó en el proyecto aislado con clientes portátiles `psql` 17.11, bajo autorización específica; sus resultados se limitan a los seis objetos y fixtures descritos en su informe. Se confirmaron radios de 250 m y 1 km con puntos sintéticos. El caso general de 2 km y sectores aprobados de Tunja no se consideran validados.

### Permisos de anunciantes y administración

- Roles de prueba: anunciante A, anunciante B, usuario anónimo y administrador separado.
- Verificar propiedad y edición de inmueble/unidad/fotos; B no lee ni modifica recursos de A; anónimo no escribe; administrador solo puede moderar con rol explícito.
- Probar tanto Data API/RLS como Storage policies. Alterar `advertiser_id` en solicitudes y probar acceso por ID conocido.
- **Aceptación:** cero lecturas/escrituras cruzadas, acceso público limitado exactamente a publicaciones aprobadas y acciones administrativas denegadas por defecto.

### Autenticación y recuperación

- Dentro de F01-H00, evaluar sesión/JWT, autorización y aislamiento HTTP solo si existe identidad de prueba y autorización específica para las operaciones remotas. Estos casos no incluyen envío ni confirmación de correo.
- Las pruebas reales de registro con confirmación, recuperación por correo, expiración/reuso de enlaces y anti-enumeración quedan diferidas fuera de F01-H00 por decisión de dirección del 2026-10-16. No se deben marcar como ejecutadas ni son una tarea abierta de este hito; se validarán antes de operar con usuarios reales.
- No usar SMTP compartido para simular entrega de producción. Una futura validación de correo requiere evaluar y autorizar un SMTP compatible, sus condiciones y remitente de prueba.
- **Aceptación aplicable a F01-H00:** las pruebas autorizadas de sesión/JWT y autorización deben demostrar el aislamiento esperado. La entrega de correo no forma parte de esta aceptación. Los criterios completos de confirmación y recuperación permanecen como requisito futuro previo a usuarios reales.

### Fotografías

- Generar fixtures de imagen sin datos personales: JPEG válido, archivo no imagen con extensión `.jpg`, MIME falso, archivo sobre el tamaño, dimensiones extremas y JPEG con EXIF de ubicación.
- Verificar límite de archivos/bytes/dimensiones, content-type real, stripping EXIF, nombres aleatorios no sensibles, acceso Storage por propietario, borrado de metadatos/objeto y URL pública solo para anuncios aprobados.
- El pipeline de optimización/miniaturas no está seleccionado. En esta preparación no se instalará transformador; no se afirmará que la cuota de fotos es suficiente sin medir imágenes procesadas y tráfico.
- **Aceptación:** rechazar inválidos y exceso; impedir que anunciante B lea/elimine fotos de A; no conservar EXIF GPS; referencia de foto íntegra después de exportar/restaurar.

### Exportación, copia y restauración

- Export separado de filas PostgreSQL, roles/usuarios Auth en formato soportado, schema/policies/migrations, reglas de acceso y manifiesto/bytes de Storage. No incluir claves secretas en export compartido.
- Calcular SHA-256 de cada objeto y manifiesto; almacenar backup cifrado fuera del proyecto y verificar la clave de descifrado bajo custodia autorizada.
- Restaurar en un recurso de prueba aislado solo tras autorización, reconstruir estructura y comparar conteos, IDs, hashes, FK y resultados de las pruebas de tenant.
- **Aceptación:** restauración sin acceso al proyecto origen, diferencias explicadas, login/roles/RLS efectivos y RPO/RTO medidos contra valores que dirección aún debe fijar.
- Supabase Free no incluye backup automatizado de base de datos como prestación de plan según la comparación previa; la copia independiente y prueba de restore son responsabilidad de evaluación, no se sustituyen por recuperación de proyecto pausado.

## Seguridad, dependencia y riesgos

- Separar proyecto/organización de evaluación; llaves `service_role` nunca en navegador, repositorio o fixtures. Aplicar least privilege y rotar/borrar secretos al eliminar el recurso.
- PostGIS y consultas espaciales son capacidades de PostgreSQL, pero auth, API, Storage y operación del proyecto siguen dependiendo de Supabase. Exportar SQL no migra Auth ni bytes de Storage por sí solo.
- Cuotas pequeñas pueden agotarse con egreso, almacenamiento, crecimiento de base o archivos; tamaño y egress deben medirse con bytes reales. Inactividad puede pausar el proyecto. Agotamiento o suspensión debe activar lista, mensajes degradados y bloqueo de nuevas cargas, sin upgrade automático.
- OpenFreeMap puede cambiar/discontinuar el endpoint sin SLA. Sus solicitudes pueden revelar al proveedor y su CDN la URL de tile (que codifica el área solicitada), el referente y metadatos de cliente según su política. Mantener cliente independiente del URL, atribución, una vista de lista y un parámetro/configuración de estilo intercambiable. Revisar términos y privacidad antes de cada evaluación/operación.
- La aceptación comercial y privacidad de Supabase debe verificarse contra términos de cuenta y tratamiento de datos. Este test solo usará datos ficticios; no prueba cumplimiento para personas reales.
- El resultado “USD 0” de cuenta Free no incluye horas humanas, dominio, correo externo ni coste de oportunidad de autohospedaje.

## Estado de preparación

| Área | Resultado actual | Evidencia requerida para pasar |
| --- | --- | --- |
| Fuentes oficiales, términos/cuotas | Revisadas al 2026-10-16; condiciones de cuenta sin comprobar | Inspección de alta/cuenta y nueva revisión fechada |
| Fixtures y lógica de distancia sintética | Verificador local y PoC SQL/PostGIS ejecutados para 250 m y 1 km | Casos con sectores/puntos aprobados por dirección y cliente de mapa |
| Supabase Auth y Data API | Propuesta y matriz revisadas; sin cuentas, correos ni JWT reales | Autorización específica, cuentas/destinatarios de prueba y ejecución segura |
| RLS SQL | Suite PostgreSQL con identidades/claims simulados confirmada por dirección | No sustituye Auth real ni HTTP; no repetir la suite aprobada |
| Supabase Storage | Diseñado, no ejecutado | Carga limitada, controles de acceso y pruebas de contenido con autorización |
| Tiles, atribución y mapa en cliente | Revisión oficial de guía, términos y privacidad; no se ejecutó cliente ni solicitud de tiles | Smoke test visual de bajo volumen, atribución/fallback y casos Tunja aceptados |
| Export/restore | Dump pre-PoC externo con checksum y listado legible; no se ha probado restauración. No incluye validación integral coordinada Auth/Storage/config | Objetivos RPO/RTO, destino autorizado y restore drill aislado |
| Uso comercial/privacidad | No certificado para cuenta ni uso con datos personales | Revisión jurídica/contractual específica antes de piloto |

## Registro histórico: verificación MCP Supabase de solo lectura antes de la PoC, 2026-10-16

- Servidor cargado en esta sesión: `supabase_ubicate`. La configuración de proyecto apunta a `project_ref=ivzjijagahkczdghoqkz`, `read_only=true`, `features=database,docs`.
- `list_tables` con esquema `public` y `verbose=false` respondió `{"tables":[]}`.
- `list_extensions` respondió correctamente. PostgreSQL informa `postgis` versión disponible `3.3.7`, con `installed_version=null`; por tanto PostGIS está disponible para evaluación, pero todavía no está instalado en el proyecto. También aparecen extensiones ya instaladas como `pgcrypto`, `pg_stat_statements`, `uuid-ossp` y `supabase_vault`.
- Atribución de respuesta: ambas llamadas se hicieron exclusivamente por la herramienta namespaced `supabase_ubicate`, cuyo endpoint de sesión está configurado con el `project_ref` indicado. Ningún otro MCP de Supabase fue invocado. Las operaciones disponibles no devuelven el project ref como campo del resultado, por lo que la identificación se basa en el enlace fijo de la configuración del servidor, no en una consulta SQL independiente del servidor.
- No se detectaron errores de autenticación ni permisos. No se ejecutó SQL de escritura ni se modificaron recursos.
- Revalidación para preparar la PoC: se consultó de nuevo `list_tables` y `list_extensions` usando únicamente `supabase_ubicate`. `public` continúa sin tablas; `postgis` ofrece versión predeterminada `3.3.7` y mantiene `installed_version=null`. La configuración local consultada aún fija el ref `ivzjijagahkczdghoqkz` y `read_only=true`. La herramienta de extensión no incluye el project ref en cada respuesta, por lo que el alcance se verifica por el endpoint configurado, no por una consulta SQL independiente.
- Paquete de prueba PostgreSQL/PostGIS y RLS preparado en [`poc-postgis-rls/README.md`](poc-postgis-rls/README.md), con migración versionada, fixtures y suite de pruebas reproducibles. No se ejecutó SQL remoto. La suite y sus criterios están pendientes de validación en PostgreSQL real.

## Puerta de autorización externa

Dirección ya identificó el proyecto de evaluación y completó OAuth para habilitar consultas del MCP en modo `read_only=true`. Esta autorización cubre las lecturas informadas arriba. No se crean cuentas o proyectos adicionales durante esta comprobación. SMTP externo, Backblaze, escritura de datos, instalación de PostGIS, migraciones, cambios de políticas, facturación, producción y despliegue no quedan autorizados por el acceso MCP de lectura; requerirán autorización específica antes de ejecutar esas acciones.

## Registro histórico de preparación del paquete local PostGIS/RLS

El diseño y sus artefactos están en [`poc-postgis-rls/README.md`](poc-postgis-rls/README.md): migración `20261016_01_postgis_listing_rls.sql`, fixtures `seed.sql` y suite `rls_geospatial.sql`. El baseline MCP registró que `public` no tenía tablas y que PostGIS no estaba instalado. Los scripts locales no se han ejecutado contra Supabase, y no se afirma que su sintaxis o comportamiento hayan sido validados en PostgreSQL.

La autorización solicitada para una ejecución futura tendría exactamente este alcance: instalar PostGIS en `extensions`; crear seis tablas `public.ubicate_poc_*`, índices y una función auxiliar SQL con ejecución solo para `authenticated`; aplicar grants y policies RLS; insertar dos anunciantes ficticios, tres inmuebles, cuatro unidades, tres espacios comunes y cuatro disponibilidades; ejecutar las aserciones RLS y consultas geográficas de 250 m y 1 km en transacción que termina con `ROLLBACK`. No incluye usuarios Auth, Storage, otros proyectos, ni operaciones fuera de ese prefijo. Antes de cualquier escritura se requiere respaldo legible del estado inicial.

El MCP actual permanece `read_only=true` y no puede aplicar el paquete. Para una ejecución asistida se requiere autorización de dirección para una vía de escritura separada, limitada al proyecto `ubicate-f01h00-pruebas` (`ivzjijagahkczdghoqkz`), o ejecución humana por SQL Editor del mismo proyecto con el rol administrativo; no cambiar ni reutilizar otro MCP. La limpieza posterior es una operación destructiva separada y requerirá autorización después de revisar evidencias y dependencias.

### Preflight inicial detenido antes del respaldo, 2026-10-16

La autorización condicionada se revisó y la ejecución se detuvo antes de habilitar escritura. El dashboard identificado por nombre y ref muestra organización `Ubicate-Evaluacion-F01H00 FREE`; en respaldos, la interfaz declara que Free no incluye respaldos de proyecto y muestra que no hay respaldos. El entorno no tiene `pg_dump`, `pg_restore` ni `psql`, por lo que no se produjo el respaldo externo requerido. La interfaz no se usó para activar pagos ni cambiar ajustes.

Con el único MCP de Supabase invocado, `supabase_ubicate`, una consulta de catálogo de solo lectura devolvió cero relaciones/funciones públicas con prefijo `ubicate_poc_` y ninguna extensión PostGIS instalada. La herramienta no devuelve el ref dentro de la respuesta; la asociación al proyecto procede de la URL configurada. `codex mcp list` falló con `Error: failed to resolve CODEX_HOME` y `Could not find home directory`; no se añadió ni habilitó un MCP de escritura. La configuración existente permanece sin cambios durante este preflight.

La auditoría estática de la migración no encontró sentencias `DROP`, `CASCADE` ni operaciones que alteren objetos existentes; las guardas abortan ante colisiones. La función auxiliar usa `SECURITY DEFINER`, `SET search_path = ''`, nombres de objeto cualificados, `REVOKE ALL` para `PUBLIC`, `anon` y `authenticated`, y luego concede `EXECUTE` a `authenticated`. El script no establece explícitamente el propietario de la función. Su propietario dependería del rol de ejecución, que no se pudo fijar ni verificar antes de crearla. Ese punto debe quedar resuelto por una vía que garantice el rol de creación o mediante un cambio revisado del SQL antes de ejecutar.

`pg_restore --list` se reconoce solo como verificación de legibilidad/listado del artefacto, no como prueba de restauración integral. No hubo cambios en Supabase, fixtures persistentes, activaciones, consumo/costo de la PoC ni operaciones destructivas. La identidad simulada tampoco se ha validado con usuarios reales de Supabase Auth.

### Actualización de herramientas y puertas de seguridad, 2026-10-16

- Se descargó del origen oficial de EDB el ZIP portátil de PostgreSQL 17.11 para Windows, ubicado en `%LOCALAPPDATA%\Temp\ubicate-postgresql-client-17.11\postgresql-17.11-4-windows-x64-binaries.zip`. SHA-256: `B9424EE7BC60B52450FF910A3630225DF32E633F3CB29C1D126D9299D59AEA28`, coincidente con la publicación del proveedor. Se extrajeron solo `pg_dump`, `pg_restore`, `psql` y DLL requeridas a una carpeta temporal fuera del repositorio. Las tres herramientas reportaron versión 17.11. No se instaló servidor/servicio ni se tocó PATH global.
- Consulta de lectura mediante exclusivamente `supabase_ubicate`: PostgreSQL `17.11`, `transaction_read_only=on`, sesión `supabase_read_only_user`; la fila de `pg_roles` para `postgres` informó `rolbypassrls=true`, `rolsuper=false`. Esta consulta acredita el catálogo, no prueba qué rol ejecutaría la futura migración.
- El Session Pooler del proyecto de evaluación respondió por IPv4 en TCP 5432; la conexión directa no respondió desde esta red. El certificado se descargó mediante el botón de Database Settings del proyecto, se guardó fuera del repositorio como `%LOCALAPPDATA%\Temp\ubicate-postgresql-client-17.11\prod-ca-2021.crt` y se parseó localmente como `Supabase Root 2021 CA`; SHA-256 `700723581420DD1AC98FD7E9AC529F0EF210EADCAF87FC868A3AD7D114C2F3B7`. Un primer PowerShell no resultó visible, quedó detenido y el archivo de 0 bytes no se acepta como respaldo. Se dejó preparado `create-ubicate-backup-visible.ps1` para ejecución manual en una terminal visible; aún no hay conexión TLS confirmada ni respaldo. No se registró credencial.
- El dashboard muestra el plan Free y declara que no incluye backups de proyecto. La alternativa autorizada es una exportación lógica local. Se verificará con código de salida de `pg_dump`, tamaño no nulo, `pg_restore --list` y SHA-256. La legibilidad/listado no sustituye una restauración integral.
- `codex mcp list` falló en la terminal por `CODEX_HOME` sin definir (`Error: failed to resolve CODEX_HOME` / `Could not find home directory`). El proceso CLI funcionó al establecer solo para ese proceso `CODEX_HOME=$USERPROFILE\.codex`; la lista efectiva incluye `supabase_ubicate` con ref `ivzjijagahkczdghoqkz` y `read_only=true`. Persisten avisos `Acceso denegado. (os error 5)` al limpiar alias y directorios temporales. No se cambió configuración global ni `.codex/config.toml`.
- La auditoría encontró que el helper actual está en `public`, tiene `SECURITY DEFINER` y no fija propietario. Se propone un esquema privado, exigir `current_user = 'postgres'`, verificar propietario y `BYPASSRLS`, acotar grants y añadir pruebas negativas. La propuesta material está pendiente de revisión humana en `poc-postgis-rls/revision-seguridad-pendiente.md` y `poc-postgis-rls/review/20261016_01_postgis_listing_rls.proposed.sql`; la migración original no se modificó.
- No se abrió MCP de escritura ni se ejecutó DDL, DML o pruebas remotas con escritura. La PoC no puede reanudarse hasta revisar la propuesta, actualizar y reauditar el paquete SQL, producir y verificar el dump, y superar las puertas de plan y acceso definidas.

- Supabase SSL: [conexión a PostgreSQL](https://supabase.com/docs/guides/database/connecting-to-postgres), [enforcement y modos SSL](https://supabase.com/docs/guides/platform/ssl-enforcement), [conexión mediante psql](https://supabase.com/docs/guides/database/psql).
- Herramientas EDB: [binarios oficiales PostgreSQL para Windows](https://www.enterprisedb.com/download-postgresql-binaries), [ZIP y checksum EDB 17.11](https://github.com/EnterpriseDB/edb-installers/issues/706).

## Fuentes oficiales consultadas el 2026-10-16

- Supabase: [planes y cuotas](https://supabase.com/docs/guides/platform/billing-on-supabase), [control de costos](https://supabase.com/docs/guides/platform/cost-control), [pausa de proyectos Free](https://supabase.com/docs/guides/platform/free-project-pausing), [tamaño de base de datos](https://supabase.com/docs/guides/platform/database-size), [límites de Auth email](https://supabase.com/docs/guides/auth/rate-limits), [SMTP personalizado y restricciones del SMTP compartido](https://supabase.com/docs/guides/auth/auth-smtp), [PostGIS](https://supabase.com/docs/guides/database/extensions/postgis), [Términos](https://supabase.com/terms).
- MapLibre: [documentación de GL JS](https://maplibre.org/maplibre-gl-js/docs/) y [licencia BSD-3-Clause del repositorio](https://github.com/maplibre/maplibre-gl-js).
- OpenFreeMap: [servicio público, uso comercial, atribución y licencia](https://openfreemap.org/), [términos vigentes](https://openfreemap.org/tos/), [privacidad del servicio público](https://openfreemap.org/privacy/), [guía de integración](https://openfreemap.org/quick_start/).
