# F01-H00: evaluación inicial de arquitecturas

**Estado:** evaluación documental y local completada; comparaciones con proveedores/cuentas reales pendientes.\
**Apertura:** autorizada por dirección el 2026-10-16.\
**Resultado:** recomendación de patrón A como primera candidata para pruebas controladas, no selección final de arquitectura ni proveedores.

**Cambio de prioridad, 2026-10-30:** Dirección eligió priorizar el desarrollo funcional de Ubícate y preparar el primer hito del MVP de exploración pública. F01-H00 permanece abierto; AC-04 se mantiene parcial, bloqueado y no satisfecho según el resultado del 2026-10-21. No se repiten restauraciones ni pruebas de recuperación en esta continuación. La nueva propuesta funcional no selecciona arquitectura ni altera los resultados técnicos de H00. Véase [propuesta del hito de exploración](../../propuesta-hito-exploracion/).

**Actualización posterior:** dirección confirmó la PoC PostgreSQL/PostGIS/RLS con migración, fixtures y suite; véase [evidencia consolidada](poc-postgis-rls/README.md). El 2026-10-17 también se completaron las pruebas esenciales Auth/JWT/Data API/RLS A/B con Chrome DevTools; lecturas propias, aislamiento cruzado, modificación propia y reversión pasaron según [evidencia](poc-auth-data-api-rls/README.md). No se repiten en esta unidad. Dirección excluyó el envío real de confirmación/recuperación por correo de F01-H00. La recomendación de A sigue siendo provisional y el hito continúa abierto.

## Alcance ejecutado

Este apartado registra la evaluación inicial. Las ejecuciones posteriores de PostGIS/RLS, Auth/JWT/Data API y optimización fotográfica se consolidan en sus secciones y evidencias fechadas más abajo; la frase de que no hubo escrituras se limita a esta evaluación inicial.

- Revisé la propuesta, su spec, plan y tasks contra la autorización de dirección y la política económica aprobada.
- Reutilicé la investigación vigente de cuotas, términos públicos y escenarios en [viabilidad F00-H04](../../F00/H04/viabilidad-costo-cero.md); no repetí una búsqueda general de planes.
- Ejecuté la auditoría determinista de documentación ECC y verifiqué enlaces/criterios locales.
- Recalculé con Python estándar el modelo de imágenes de 200, 1.000 y 5.000 anuncios. La fórmula y resultados concuerdan con el documento de viabilidad.
- Revisé estáticamente modelos de datos, autorización, recuperación, términos y dependencias en A, B y autohospedaje.
- Ejecuté la verificación local de fixtures de Tunja: 3 pruebas pasaron, incluida la consistencia de radios de búsqueda.
- Comprobé por HTTPS desde navegador la lectura anónima de los seis endpoints Data API: cinco respondieron con filas filtradas y advertisers fue denegado; detalle en [PoC Auth + Data API](poc-auth-data-api-rls/README.md). No hubo escrituras.
- Revisé enlaces Markdown locales y `git diff --check`; sin errores.

No hay una aplicación implementada de Ubícate contra la cual probar flujos de interfaz, carga real de fotos, fallback visual del mapa o resiliencia del cliente. RLS sí se probó en la PoC SQL y el subconjunto Data API anónimo se probó por HTTP. No se midió consumo real sostenido ni se probó restauración. No se instalaron dependencias ni se activaron servicios.

## Comparación ejecutiva

| Dimensión | A. Plataforma gestionada integrada | B. Servicios gratuitos desacoplados | Autohospedaje, referencia |
| --- | --- | --- | --- |
| Componentes candidatos | React/MapLibre; hosting estático candidato; Supabase API, PostgreSQL/PostGIS, Auth y Storage; SMTP transaccional externo; tiles públicos OSM/OpenFreeMap; copia independiente B2 + copia cifrada local | React/MapLibre + Firebase Hosting/Auth/Firestore; Cloudinary para fotos; Supabase Edge Function para firma; tiles OSM/OpenFreeMap; backup B2 + copia local | Frontend/API, PostgreSQL/PostGIS, identidad, objetos y mapas en software OSS sobre equipo existente o VPS; todo parchado, operado y recuperado por el equipo |
| Encaje con dominio | Relación inmueble → unidades → fotos/disponibilidad se expresa en SQL; consultas espaciales se resuelven con PostGIS | El modelo por documentos obliga a diseñar duplicación/consistencia; búsqueda geo requiere celdas/geohash y filtrar candidatos | El modelo relacional/geoespacial es portable; el equipo asume afinación, upgrades y consultas |
| Auth y correo | Auth integrado, pero correo de verify/reset necesita SMTP de producción; el SMTP de prueba se excluye | Auth ofrece flujos nativos de verify/reset y cuotas públicas. Requiere probar entrega, reputación y límites de cuenta | Identidad puede ser OSS, pero el equipo asume restablecimiento, entrega de correo, rate limits, tokens, hardening y MFA |
| Fotos | Storage integrado simplifica policies, pero 1 GB y egreso publicado se vuelven estrechos; modelo estima 0,25 GB y 2,5 GB para piloto 200 | Cloudinary ofrece 25 créditos/mes; función firmadora protege el secreto y aumenta el número de componentes | MinIO u otro software OSS requiere almacenamiento/discos, HTTPS, CDN o ancho de banda y copias operadas; el costo físico y humano no es cero |
| Seguridad | Menos integración dentro de backend; RLS y pruebas negativas obligatorias. SMTP/backup/delivery son superficies adicionales | Más fronteras de tokens, reglas y credenciales; probar Firebase ID token → firma → Cloudinary, abuso de carga y permisos | Mayor control del sistema y mayor obligación de operación/patching, secretos, firewall, monitoreo y respuesta a incidentes |
| Recuperación | Supabase requiere exportar DB/Auth/objetos/config por separado; prueba de restauración completa pendiente | Firebase requiere exportar Auth, Firestore, índices/reglas y medios aparte; restauración coordinada pendiente | Portabilidad potencial alta, pero backup fuera del sitio, retención, restauración y disponibilidad son enteramente responsabilidad del equipo |
| Uso comercial | Términos públicos parecen permitir servicio para uso empresarial interno, pero términos de cuenta y remitente no comprobados | Hay términos públicos de uso comercial para Firebase y Cloudinary de acuerdo con evaluación previa; la aplicabilidad/estado de cuenta no está verificada | Depende de licencias de cada componente, derechos de datos/mapa, ISP/hosting y contratos de medios. Revisión jurídica sigue pendiente |
| Migración | PostgreSQL/PostGIS permite export SQL; Auth, Storage policies y objetos requieren adaptación | Export de Firestore no evita conversión de documentos/consultas/geohash; Auth puede requerir restablecer contraseñas si no se importan hashes | Salida de software libre favorable, condicionada a procedimientos/copia y formatos probados |
| Operación mensual | Baja-media, con alta atención a cuotas, SMTP, exportación y almacenamiento | Media-alta por multi-servicio, credenciales, cuotas y fallos parciales | Alta; horas del equipo, hardware, energía y conectividad deben contabilizarse |

Las listas de productos son candidatas de prueba conservadas desde F00-H04. No son selección, contratación ni autorización para crear cuentas.

## Modelo económico local reproducido

**Supuestos:** 5 imágenes por anuncio, 250 KB cada una, una copia almacenada, 10 vistas de detalle por anuncio al mes, cinco imágenes por vista. Cloudinary se calcula con una transformación por imagen. Firestore se calcula con cinco búsquedas por anuncio que consultan hasta 20 fichas y diez detalles que leen siete documentos.

| Anuncios | Almacenamiento de imágenes | Egreso de imágenes/mes | Cloudinary créditos estimados | Lecturas Firestore/mes |
| ---: | ---: | ---: | ---: | ---: |
| 200 | 0,250 GB | 2,500 GB | 3,750 | 34.000 |
| 1.000 | 1,250 GB | 12,500 GB | 18,750 | 170.000 |
| 5.000 | 6,250 GB | 62,500 GB | 93,750 | 850.000 |

Modelo reproducido por comando Python local. Umbrales resultantes de esos supuestos: 5 GB de un bucket de egress Supabase equivaldrían a ~400 anuncios; storage Supabase 1 GB a ~800 anuncios; Cloudinary 25 créditos a ~1.333 anuncios. Son límites calculados para ese patrón, no capacidades universales. Faltan cargas del sitio, mapas, tráfico distinto, caché, bytes de API, datos e índices, duplicados, reintentos y copias. Al escenario 5.000 no se le asigna un costo productivo global ni se extrapola precio de proveedores.

### Registro económico que se aplicará a las candidatas

Cada opción se reporta por separado en costo monetario recurrente, costo monetario puntual y esfuerzo/recursos operativos. La política aprobada es USD 0 por defecto; los campos desconocidos no se rellenan con cero.

| Partida | Cómo reportar | Estado de evidencia |
| --- | --- | --- |
| Infraestructura, datos, egreso, funciones y medios | USD/mes y cuota consumida por servicio; separar valor publicado y consumo medido | Cuotas públicas y modelo de escenarios disponibles; uso real Auth/Data API/Storage aún no medido |
| Dominio, correo y verificación de remitente | USD/año o USD/mes; indicar si la opción usa subdominio gratuito y sus límites | No se ha comprado dominio ni creado/validado remitente |
| Equipo, conectividad y energía | Recurso existente versus consumo incremental; para autohospedaje reportar kWh, tarifa local y desgaste si se miden | Sin medición del hardware o tarifa atribuible al proyecto; no contabilizar como cero |
| Operación humana | Horas/mes por respaldo, parches, moderación, soporte e incidentes; costo monetario solo con tarifa aprobada | Esfuerzo cualitativo comparado; responsables y tarifa no definidos |
| Backup, recuperación y salida | USD por destino/retención/transferencia; horas de exportar, restaurar y migrar | Dump pre-PoC disponible fuera del repositorio, pero restore y respaldo completo de Auth/Storage/config no probados |
| Costos extraordinarios o activación de pago | Enumerar evento, monto/estimación, condición y alternativa gratuita; bloquear si no está autorizado | Ninguno autorizado; USD 0 sigue siendo el tope de gasto autorizado |

Los rubros se mantienen comparables entre A, B y autohospedaje. Dominio, tarifa de energía, costo hora, cargos/impuestos y costo de recuperación se anotan como **no determinados** hasta contar con dato verificable; no son permiso para incurrir en esos gastos.

### Piloto controlado propuesto para contrastar

- Hasta 200 publicaciones activas.
- Hasta cinco fotos por anuncio; 250 KB por archivo optimizado como objetivo de evaluación, no requisito aprobado de producto.
- Presupuesto de referencia de 0,25 GB para fotos activas y 2,5 GB/mes de descarga de fotos según los supuestos anteriores.
- Una copia de prueba de fotos equivale a 0,25 GB más base/Auth/config; el volumen total de backup aún debe medirse antes de afirmar que cabe en B2 Free.
- Cuotas revisadas manualmente y bloqueo de altas/cargas antes de alcanzar topes. No habilitar billing, autosobrecarga ni medio de pago.

El piloto no se declara listo ni seguro: son límites de prueba propuestos. Aun a 200 anuncios, A requiere margen para egress de DB/Auth y B requiere límites antispam, firma protegida, políticas de Firestore y control de varias cuentas.

## Seguridad, privacidad y portabilidad

| Área | Requisito de prueba previo a selección/producción | Evidencia disponible ahora |
| --- | --- | --- |
| Autenticación/recuperación | Antes de usuarios reales: confirmación y reset, expiración/reuso, rate limit, respuesta sin enumeración y revocación de sesión | Auth/JWT esenciales A/B pasaron; confirmación y recuperación por correo real diferidas fuera de F01-H00. Expiración/refresh, roles administrativos y rate limit siguen pendientes. |
| Anunciante/admin | Denegar por defecto; permitir operaciones propias expresamente concedidas; denegar lectura/escritura cruzada; separar admin; log de moderación | Pruebas HTTP con JWT A/B verificaron lectura propia, denegación cruzada y modificación propia temporal reversible. Rol admin, abuso/rate limit y otros casos extendidos siguen pendientes. |
| Fotografías | MIME real, tamaño/dimensiones, conteo, EXIF, derecho de uso, carga firmada, borrado, URLs y cache | PoC local Canvas confirmó WebP/JPEG, redimensionamiento, tiempos y eliminación de EXIF/GPS sintéticos. AC-05 sigue parcial: validación integral, derechos en publicaciones, Storage/RLS, miniaturas, entrega y borrado pendientes. Evidencia y límites al final de este documento. |
| Ubicación | Permitir ubicación exacta o aproximada elegida por anunciante; aproximada predeterminada; minimización y fallback de lista | Política ratificada por dirección para el piloto; sectores/casos de aceptación Tunja y comportamiento visual aún pendientes |
| Privacidad de tiles | Solicitar solo tiles necesarios y evitar enviar coordenadas exactas del usuario; mantener atribución y fallback | OpenFreeMap publica metadatos de solicitudes anonimizados, IP en ciertos errores/incidentes y posible CDN Cloudflare; evaluación del flujo de datos en cliente pendiente |
| Backups | Copia independiente de usuarios, datos, reglas/config y bytes; cifrado, checksum, RPO/RTO y restore aislado | Plan documental; no existe destino/servicio/dataset ni restore test |
| Salida | Exportar e importar en alternativa; validar IDs, credenciales, fotos y enlaces | Capacidades públicas documentadas, procedimiento no ejecutado |
| Términos/costos | Guardar términos actuales de producto/cuenta, verificar permiso comercial, límites y freno sin billing | Revisión pública con fecha anterior; cuenta, billing UI y contrato individual sin verificar |

La prioridad “seguridad, privacidad, respaldos y recuperación son requisitos obligatorios” se aplica como puerta no compensable. Ninguna puntuación de costo permite bajar ese umbral.

## Pruebas ejecutadas y pendientes

### Ejecutadas

- Auditoría `docs-governance` ECC con scope `full`: pasó los controles deterministas. Informó advertencias progresivas por roles opcionales ausentes (`CLAUDE.md`, `CLAUDE_MAP.md`, `PROJECT_STATUS.md`, `PROJECT_LOG.md`, `CONTEXT.md`, ADR, CONTRACT, TESTS, REGRESSION); no se crean archivos vacíos por esas advertencias.
- La primera ejecución chocó con la codificación CP1252 de la consola al imprimir un checkmark. Se repitió con `PYTHONIOENCODING=utf-8` y terminó con código 0.
- Enlaces Markdown locales y congruencia de AC revisados.
- Cálculos 200/1.000/5.000 reproducidos mediante Python estándar sin dependencias.
- Revisión estática de componentes, responsabilidades, superficies de autorización, migración, costos modelados y límites de evidencia.

### Pendientes antes de seleccionar una arquitectura

- Revisión humana de casos/sectores reales de Tunja y comparación de PostGIS/geohash con conjunto de datos aprobado.
- Completar casos extendidos de permisos admin, expiración/refresh de sesión y abuso/rate limit, además de carga/optimización de fotos y fallo de servicios en prototipo aislado. Las pruebas esenciales Auth/JWT/RLS A/B ya pasaron y no se repiten. Confirmación y recuperación por email quedan fuera de F01-H00 por decisión de dirección; no bloquean esta evaluación.
- Confirmar términos comerciales aplicables, sender y controles de cuotas con cuentas concretas. Requiere autorización para crear cuentas; no se realizó.
- Exportar/restaurar usuarios, DB/documentos, reglas/config y medios en entorno aislado; requiere autorización y servicio de prueba.
- Aprobar tope de piloto, RPO/RTO, retención, disponibilidad, responsables y región/datos personales.

### Pendientes antes de producción

Todas las puertas anteriores, pruebas de seguridad negativas, ejercicio de restauración aceptado frente a objetivos RPO/RTO, revisión legal/privacidad, monitoreo y runbook asignados, cumplimiento de los términos y capacidad del equipo confirmada. No desplegar hasta aprobación humana de arquitectura y de hito de implementación.

## Estado frente a criterios de aceptación

| Criterio | Estado actual | Evidencia o brecha principal |
| --- | --- | --- |
| AC-01 Fuentes y trazabilidad | Parcial | Investigación pública fechada y evidencia PoC disponibles; confirmar condiciones específicas de cuenta/contratos para servicios aún no probados |
| AC-02 Comparación A/B/autohospedaje | Parcial | Comparación documental y diagramas de flujos A/B/C registrados en `propuesta.md`; pesos y puertas aún propuestos, y faltan mediciones de servicios |
| AC-03 Auth y aislamiento | Parcial | Pruebas esenciales Auth/JWT/Data API/RLS A/B pasaron: anónimo sin drafts, lectura propia, aislamiento cruzado, modificación propia reversible y lectura final. No cubre admin, expiración/refresh, abuso/rate limit ni correos reales, estos últimos diferidos fuera de H00. |
| AC-04 Backup y restore | Parcial, bloqueado | Dump cifrado y recuperación OpenPGP verificados; base PostgreSQL restaurada en un destino local limpio y nueve comprobaciones de conteo pasaron. Auth, Realtime y Storage no quedaron saludables; falta completar el ensayo con fotos sintéticas, segundo respaldo/restauración y RTO/RPO. |
| AC-05 Fotografías | Parcial | PoC local confirmó reducción con Canvas/WebP y retirada de EXIF/GPS sintéticos. Siguen pendientes validación de archivos integral, derechos/consentimientos de publicaciones, autorización RLS/Storage, carga y lectura de objetos, miniaturas y borrado. Evidencia al final de este documento. |
| AC-06 Mapa Tunja | Parcial | Distancias SQL con puntos sintéticos confirmadas; sectores de aceptación humanos y fallback visual/client-side pendientes |
| AC-07 Resiliencia | Pendiente | No se ejecutó simulación de fallos de proveedor/cuotas |
| AC-08 Economía | Parcial | Modelos de 200/1.000/5.000 y protocolo de costos preparados; medición real de cuotas y parámetros de piloto sin aprobar |
| AC-09 Condiciones | Parcial | Fuentes públicas revisadas; permisos comerciales de cuenta, tratamiento/privacidad y condiciones individuales sin certificar |
| AC-10 Recomendación y decisión | Parcial | Recomendación provisional de secuencia A documentada; no hay selección ni decisión final de dirección |

Esta matriz evita tratar una prueba SQL como prueba Auth/HTTP y separa la lectura de términos públicos de la verificación de cuenta. F01-H00 no cumple todavía todas sus puertas de aceptación y permanece abierto.

## Recomendación

**Recomendación provisional: llevar A, el patrón relacional gestionado con PostgreSQL/PostGIS, como primera candidata a las pruebas autorizadas de F01-H00.** La razón es el modelo ratificado de inmuebles con varias unidades, medios, disponibilidad, moderación y filtros geográficos; las relaciones y reglas de integridad son una correspondencia directa con SQL/PostGIS y exportación relacional. Frente a B, evita sincronizar la misma lógica de permisos y dominio entre una base documental, identidad y media service separado. El escenario de piloto de 200 cabe aritméticamente en las cuotas consultadas para almacenamiento/egress de A con margen limitado, sujeto a contar todo el tráfico.

No recomiendo seleccionar A todavía. Sus límites de egress, entrega transaccional, backup de usuarios/objetos y cuenta comercial deben aprobar pruebas antes. B es una alternativa válida si pruebas muestran mejor entrega de correo/medios y se demuestra acceso seguro entre servicios, restore coordinado y consumo suficiente. A 1.000 anuncios, los dos patrones muestran presión importante (egress/storage en A; Cloudinary credits en B). A 5.000 ambos exceden al menos una cuota modelada. Autohospedaje queda como alternativa si existe operador y recurso dedicado; aún no hay estimación comprobada que permita llamarlo USD 0 total.

La recomendación es de orden de evaluación, no un ADR de arquitectura elegida, ni selección de Supabase, Firebase, Brevo, Cloudinary, OpenFreeMap, Backblaze, React o MapLibre.

## Próximo punto de decisión humana

La comparación documental y las pruebas locales/solo lectura continúan sin intervención. La decisión estratégica necesaria antes de cerrar F01-H00 será seleccionar o descartar una arquitectura con base en la matriz y aceptar los riesgos/costos residuales. Antes de cualquier prueba que cree cuentas, datos, copias en servicios externos o infraestructura, se presentará una autorización agrupada con alcance, permisos, costo USD 0 verificable y reversión. La decisión de diferir correo evita pedir membresías o SMTP para esta fase.

## Evaluación de respaldo cifrado en Google Drive Personal, 2026-10-17

**Estado:** evaluación documental y preflight de solo lectura completados; arquitectura no seleccionada y ningún recurso creado. Esta actualización cubre solo recuperación y no repite la comparación general de proveedores de F00-H04 ni las pruebas Auth/JWT/RLS A/B ya documentadas.

### Criterios vigentes y conclusión

Se toman como entradas ratificadas por dirección: Google Drive Personal dedicado, capacidad de referencia de 5 GB confirmada visualmente por dirección, OneDrive Personal como segunda opción, RPO/RTO de 24 horas, 7 copias diarias y 4 semanales, operación automatizada aunque el portátil esté apagado, costo adicional USD 0 y piloto de 200 alojamientos con cinco fotos de 250 KB cada uno. El repositorio Ubícate es público. Para cuentas Google Personal estándar, Google publica hasta 15 GB compartidos entre Drive, Gmail y Fotos, pero la capacidad visual confirmada para la cuenta dedicada prevalece como parámetro de este cálculo ([cuotas Google](https://support.google.com/drive/answer/6374270)). Dirección también ratificó que cada anunciante podrá elegir ubicación exacta o aproximada, con aproximada como valor predeterminado.

**Conclusión provisional:** Drive API puede almacenar copias cifradas desde un ejecutor remoto y el volumen de fotos del piloto cabe aritméticamente en 5 GB, sujeto al tamaño real de DB/Auth/config y margen de espacio. GitHub documenta que el uso de runners estándar alojados en repositorios públicos es gratis e ilimitado, por lo que el costo de minutos de Actions no bloquea esta modalidad. Aun así, las ejecuciones programadas pueden retrasarse o ser omitidas y OAuth requiere una aplicación fuera del estado temporal de prueba para evitar caducidad a siete días. La opción no demuestra el RPO de 24 horas: falta un monitor independiente para trabajos omitidos. El RTO de 24 horas queda no demostrado hasta medir una restauración completa.

### OAuth y almacenamiento de Drive

- La API requiere OAuth 2.0 de usuario. Google recomienda el alcance no sensible `https://www.googleapis.com/auth/drive.file`, que permite al programa trabajar con los archivos que crea o que el usuario comparte expresamente con él. Es preferible al alcance restringido `drive`, que autoriza todos los archivos del Drive. El alcance no sensible requiere verificación básica de la aplicación, no la revisión de alcance restringido; la cuenta dedicada limita el impacto de una concesión accidental ([alcances Drive](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)).
- `https://www.googleapis.com/auth/drive.appdata` también es no sensible y es más estrecho, pero `appDataFolder` queda oculto en la interfaz, solo lo ve la aplicación que lo creó, no admite compartir/mover/trash y se elimina si se desinstala la app. Es inadecuado como única copia recuperable por el usuario. Para copias que el usuario pueda recuperar, evaluar `drive.file` y archivos ordinarios de Drive; evitar pedir `drive` ([appDataFolder](https://developers.google.com/workspace/drive/api/guides/appdata)).
- El flujo de autorización debe solicitar acceso sin conexión (`access_type=offline`) y custodiar un refresh token en almacenamiento de secretos, nunca en el repositorio, logs, artefactos o dentro de la propia copia. Google indica guardar el refresh token en almacenamiento seguro de largo plazo. Puede dejar de funcionar si el usuario revoca el acceso, permanece sin uso seis meses, supera límites de tokens o por otras condiciones; un usuario debe repetir consentimiento para recuperarlo. Una app externa en estado `Testing` emite refresh tokens que vencen en 7 días para alcances distintos de perfil/correo; para operar habría que completar configuración/publicación OAuth aplicable y mantener el token de producción. No se encontró documentación que establezca rotación obligatoria del refresh token en cada renovación; el cliente debe conservar el vigente y reemplazarlo si el flujo entrega uno nuevo ([OAuth de Google](https://developers.google.com/identity/protocols/oauth2/)).
- El secreto de cliente OAuth y el refresh token serían secretos de GitHub. La renovación/revocación requiere reautorización humana y actualización protegida de secretos. La rotación del secreto de cliente requeriría coordinar nuevo secreto, reconsentimiento o validación de credenciales y actualización del almacén; no hay procedimiento implementado ni cuenta comprobada.
- La carpeta de aplicación no es inmutable: el usuario puede borrar los datos y la aplicación con acceso puede borrar sus archivos. Cifrar protege la confidencialidad, pero no evita eliminación o sustitución. Debe conservarse una copia recuperable fuera de la identidad OAuth que escribe, o aceptarse explícitamente el riesgo de cuenta única.

### Ejecución y alertas

- GitHub Actions puede ejecutar con computador apagado. Los horarios `schedule` se basan en cron UTC por defecto, ejecutan el último commit de la rama por defecto y solo se activan si el workflow está en esa rama. GitHub advierte retraso con carga alta, especialmente al inicio de cada hora, y que puede descartar trabajos pendientes. Un workflow también puede detener sus ejecuciones si se suspende, elimina o desprovisiona la cuenta que figura como actor ([eventos `schedule`](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), [problemas de workflows](https://docs.github.com/en/actions/how-tos/troubleshoot-workflows)).
- Para repositorios públicos, los runners estándar alojados por GitHub son gratuitos y sin límite de minutos; se mantiene la condición de usar runner estándar, no runners larger facturables ([referencia de runners públicos](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)). El código del workflow es público. GitHub advierte que toda persona con permiso de escritura al repositorio puede acceder a los secretos configurados; por tanto, los secretos OAuth/DB exigen permisos mínimos, protección de rama y ejecución solo de código confiable. Los eventos `pull_request` desde forks no reciben secretos, pero no se deben usar `pull_request_target` para ejecutar código de contribución con secretos ([uso seguro de Actions](https://docs.github.com/en/actions/reference/security/secure-use), [pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target)).
- La notificación de fallo de una ejecución existente no detecta un trabajo que nunca se creó o se omitió. Para verificar RPO haría falta un monitor independiente que revise un heartbeat con la hora del último manifiesto íntegro y alerte si supera 24 horas. Un watchdog dentro del mismo workflow/servicio no detecta con independencia la omisión del scheduler. No se identificó ni verificó un monitor independiente con garantía y costo USD 0.
- En consecuencia, Actions sirve como ejecutor de mejor esfuerzo, no como garantía del RPO aprobado. Reintento manual con `workflow_dispatch` ayuda a recuperar una omisión una vez detectada, pero no resuelve la detección autónoma ni el tiempo transcurrido.

### Contenido, estrategia de copias y capacidad

Una copia completa recuperable necesita reunir y verificar, como mínimo:

1. PostgreSQL: roles soportados, esquema, datos, migraciones, extensiones y políticas propias. La guía Supabase de migración documenta archivos CLI separados para roles, esquema y datos y afirma que la restauración contiene `auth.users`; la referencia CLI dice que `db dump` excluye esquemas gestionados como `auth`, `storage` y esquemas de extensiones. La documentación oficial no permite afirmar aquí qué versión/forma de exportación incluye Auth. La prueba debe verificar estructura/conteos sin mostrar hashes, y exportar bytes de Storage aparte ([guía de restauración de plataforma](https://supabase.com/docs/guides/self-hosting/restore-from-platform), [referencia CLI](https://supabase.com/docs/reference/cli/supabase-inspect-db-role-configs)).
2. Auth: usuarios, identidades y hashes de contraseña. Supabase documenta que pueden migrarse desde el esquema `auth`, pero no ofrece un procedimiento universal para exportar solo ese esquema; una restauración de proyecto nuevo también debe considerar secretos JWT y nueva emisión de sesiones.
3. Storage: configuración/buckets y metadatos en `storage.buckets` y `storage.objects`, más descarga separada de cada objeto binario. Los metadatos en la base no contienen los bytes de fotos.
4. Recuperación del proyecto: migraciones/configuración versionada, extensiones, funciones, políticas y valores de configuración necesarios. Secretos no recuperables por exportación deben custodiarse por separado y reintroducirse durante el runbook, no incluirse en claro en el archivo.

Estas separaciones y límites están descritos en la [guía Supabase de backup/restauración](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore), [guía de restauración de plataforma](https://supabase.com/docs/guides/self-hosting/restore-from-platform), [migración de usuarios Auth](https://supabase.com/docs/guides/troubleshooting/migrating-auth-users-between-supabase-projects) y [descarga de objetos Storage](https://supabase.com/docs/guides/storage/management/download-objects). La guía de restauración de plataforma y la referencia del CLI discrepan sobre si su dump contiene Auth; se registra como incertidumbre por resolver con un archivo de prueba. El plan Free no permite descargar las copias automáticas del proveedor; una estrategia propia requiere credenciales y permisos suficientes, cuyo alcance aún no se verificó en un ejercicio de copia completa ([lista de preparación productiva Supabase](https://supabase.com/docs/guides/deployment/going-into-prod)).

**Comparación de estrategia:**

- **Completa diaria:** el procedimiento más sencillo de explicar y restaurar; cada punto se verifica independientemente. A costa de subir todo el volumen cada día y consumir más espacio.
- **Completa semanal + incrementales diarios:** reduce transferencia y almacenamiento cuando cambian pocos datos, pero el restore depende de la completa y de todos los incrementales posteriores, del manifiesto y del orden. Una cadena rota invalida puntos posteriores; debe medirse que el restore no exceda 24 horas.
- **Deduplicación por chunks:** puede ahorrar espacio si fotos y objetos no cambian; añade índices/catálogos, herramienta y complejidad de recuperación. No existe evidencia de contenido repetido o de un deduplicador compatible ya aprobado. No se recomienda como primera prueba.

Para el piloto, la carga máxima estimada de fotos es `200 × 5 × 250 KB = 250.000 KB ≈ 0,25 GB` por copia. Once completas con siete diarias más cuatro semanales requieren `11 × 0,25 = 2,75 GB` solo para fotos. Sobre 4,97 GB disponibles quedan aproximadamente **2,22 GB** para DB/Auth, configuración, manifiestos, índices, metadatos, cifrado y margen. Con un límite operativo prudente de 80% de la cuota reportada (3,98 GB), fotos ocuparían 2,75 GB y quedarían 1,23 GB para los demás componentes; el volumen real de estos componentes no se ha medido. El tamaño binario y el crecimiento de la base y objetos son desconocidos; por ello la capacidad total es **condicionada**, aunque la parte de fotos cabe en este cálculo.

Con completas diarias, el piso de transferencia de fotos es 0,25 GB/día, o unos 7,5 GB por 30 días; no se incluyen dumps, retries ni una restauración. Drive API no cobra por el uso estándar según su documentación actual, pero tiene cuotas técnicas y el documento de límites indica cambios de modelo de cuota durante 2026. Debe revalidarse al autorizar implementación ([límites Drive API](https://developers.google.com/workspace/drive/api/guides/limits)). El costo de runner privado en GitHub también depende del plan/cupo real y no puede certificarse USD 0 desde la evidencia disponible.

### Controles candidatos y restauración

- Comprimir antes del cifrado y cifrar cada punto independientemente con cifrado autenticado, por ejemplo una herramienta interoperable con clave pública. El workflow solo tendría la clave pública de cifrado; la clave privada de recuperación se imprimiría o custodiaría fuera de GitHub, Google Drive y el computador de ejecución. Mantener una segunda copia física/gestor de contraseñas bajo control del responsable. Perder esa clave implica perder todos los respaldos.
- Generar un manifiesto por punto con fecha UTC, versiones, conteos, tamaños y hashes; verificar la autenticidad del cifrado y descargar/descifrar una copia de muestra. No registrar tokens, credenciales ni contenidos personales en los logs. Fijar dependencias de acciones, permisos mínimos del `GITHUB_TOKEN`, revisión de cambios del workflow y evitar exponerse a ejecución desde PRs no confiables.
- Mantener 7 puntos diarios y 4 semanales con política de borrado explícita, comprobación de cuota y espacio temporal para subir y verificar un archivo nuevo antes de borrar el más antiguo. Un fallo de carga no debe sustituir el último punto íntegro. Drive y OneDrive son almacenamiento sincronizado bajo control de una cuenta; ninguno demuestra inmutabilidad ni protección contra borrado por un token comprometido.
- Runbook de recuperación: restaurar primero a un entorno aislado; habilitar extensiones/roles; cargar schema/datos/Auth; reconstruir configuración propia, buckets y policies; subir bytes de Storage; comprobar hashes, conteos, relaciones, login, RLS y URLs. Medir inicio a fin con credenciales recuperables y restauración completa. El proyecto nuevo requiere credenciales administrativas de restauración, que no deben confundirse con credenciales de ejecución del backup.

No se ha probado que exista una forma soportada y completa de extraer los roles/configuración Auth y objetos del proyecto actual con la cuenta de respaldo disponible, ni que una restauración completa termine antes de 24 horas. AC-04 permanece pendiente.

### Contraste decisivo con OneDrive

Ambas alternativas ofrecen acceso OAuth delegado desde un proceso remoto y tienen que recuperar credenciales si se revocan. En la evaluación anterior de OneDrive, Microsoft Graph AppFolder también era candidato condicionado por refresh token, scheduler y espacio real no verificado. Google Drive ofrece un alcance por archivo `drive.file` no sensible apropiado para esta cuenta dedicada, pero las apps OAuth externas de prueba caducan en siete días y siguen exigiendo una transición/publicación y manejo de consentimiento. Ambas opciones comparten la limitación decisiva: ninguna compensa los trabajos programados omitidos por GitHub Actions ni demuestra la alerta independiente. Drive resulta la candidata prioritaria por decisión de dirección y capacidad reportada, no porque ya se haya acreditado mayor cumplimiento de RPO/RTO.

### Matriz de viabilidad

| Requisito | Clasificación | Resultado actual |
| --- | --- | --- |
| OAuth delegado y alcance mínimo Drive | Viable, condicionado | `drive.file` permite acceso limitado; requiere configuración, consentimiento/verificación y flujo offline. No se creó aplicación. |
| Token permanente en ejecución desatendida | Condicionado | Refresh token seguro requerido; consentimiento OAuth `Testing` vence a 7 días; revocación obliga reautorización humana. No hay rotación/recuperación ensayada. |
| Ejecución diaria con PC apagado | Viable, mejor esfuerzo | Actions tiene scheduler remoto, pero retrasos/omisiones documentados. No demuestra 24 horas. |
| Costo adicional USD 0 | Viable para ejecución base, condicionado al alcance | Google publica uso estándar de Drive API sin cargo adicional y Actions estándar en repositorio público no factura minutos. Cuotas/API y cualquier runner larger deben revalidarse; no habilitar billing. |
| 11 copias dentro de cuota | Condicionado | Fotos solas consumen ~2,75 GB de 4,97 GB; quedan ~2,22 GB antes de margen para DB y demás. Falta medir el tamaño real. |
| Completa PostgreSQL + Auth + Storage + configuración | Condicionado | Documentación oficial divergente sobre `auth.users` en `supabase db dump`; objetos Storage, secretos/configuración y extensión Vault requieren verificación por ensayo. |
| Confidencialidad e integridad | Viable como diseño; no probado | Cifrado autenticado independiente, clave privada offline y manifiesto/hash. Custodia y restauración aún no implementadas. |
| Retención y protección contra borrado | Condicionado | Se puede automatizar la retención de archivos, pero la cuenta de almacenamiento y su token pueden borrar snapshots; no hay inmutabilidad ni segunda copia activa. |
| Alertar sobre fallo u omisión | No demostrado | El job puede fallar y notificarse; la omisión del scheduler requiere watchdog externo no identificado/certificado a USD 0. |
| RPO 24 h | No demostrado con USD 0 | Omisión de schedule, revocación OAuth y watchdog ausente permiten exceder 24 horas. |
| RTO 24 h | No demostrado | No se ha hecho restauración completa, cronometrada y aislada. |

### Próximo paso mínimo y puertas pendientes

El preflight de solo lectura confirmó 19,87 MB de base, 1,44 MB de relaciones Auth y cero buckets/objetos Storage; no reveló datos personales ni hashes. El procedimiento de exportación tiene una discrepancia oficial respecto a Auth y aún debe verificarse. El siguiente paso es autorizar una única restauración local aislada según el diseño anterior, incluyendo la exportación cifrada, fixture piloto, runtime temporal y limpieza; sin esa autorización no se crean respaldos ni se instalan/activan componentes.

**Recomendación:** conservar Google Drive Personal como destino candidato prioritario y `drive.file` como alcance inicial a evaluar; no seleccionarlo como mecanismo que satisface RPO/RTO. Mantener OneDrive solo como alternativa secundaria ya comparada. F01-H00 permanece abierto y AC-04 no está satisfecho. Cualquier cambio de objetivo, costo, proveedor o infraestructura requiere decisión humana; ninguna implementación productiva queda autorizada por esta evaluación.

### Fuentes oficiales revisadas el 2026-10-17

- [Google Drive API: elegir alcances OAuth y custodiar refresh tokens](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- [Google Drive API: appDataFolder y límites](https://developers.google.com/workspace/drive/api/guides/appdata)
- [Google Identity: OAuth 2.0, caducidad y revocación de refresh tokens](https://developers.google.com/identity/protocols/oauth2/)
- [Google Drive: cuota compartida de cuenta Personal](https://support.google.com/drive/answer/6374270)
- [Google Drive API: límites/cuotas](https://developers.google.com/workspace/drive/api/guides/limits)
- [GitHub Actions: scheduler y retrasos/omisiones](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows), [solución de problemas](https://docs.github.com/en/actions/how-tos/troubleshoot-workflows), [cobro y cuota](https://docs.github.com/en/actions/concepts/billing-and-usage)
- [Supabase: backup/restauración CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore), [usuarios Auth](https://supabase.com/docs/guides/troubleshooting/migrating-auth-users-between-supabase-projects), [objetos Storage](https://supabase.com/docs/guides/storage/management/download-objects), [límites del plan Free](https://supabase.com/docs/guides/deployment/going-into-prod)
- [Supabase CLI: esquemas excluidos por defecto en `db dump`](https://supabase.com/docs/reference/cli/supabase-inspect-db-role-configs), [stack local](https://supabase.com/docs/guides/local-development)
- [Supabase: restaurar proyecto de plataforma en Supabase autohospedado](https://supabase.com/docs/guides/self-hosting/restore-from-platform)

## Preflight remoto de recuperación, solo lectura, 2026-10-17

### Identidad y método

El MCP utilizado fue `supabase_ubicate`. Su consulta de identidad confirmó base `postgres`, rol de conexión `postgres` y `transaction_read_only=off` fuera de transacción. Para las mediciones, cada lote SQL se ejecutó dentro de `BEGIN TRANSACTION READ ONLY` y el resultado confirmó `transaction_read_only=on`. Se consultaron únicamente tamaño de base y relaciones, catálogos, conteos agregados de `auth.users`/`auth.identities` y metadatos de tamaño de objetos; no se seleccionaron columnas personales, credenciales ni hashes de contraseña. Para Storage se omitieron nombres y UUID de objetos y se solicitó solamente bucket, tamaño y MIME; el resultado fue vacío. `list_extensions` se usó para inventariar extensiones instaladas. No se ejecutaron `pg_dump`, copias, cambios ni solicitudes de API con credenciales.

Consultas efectivas: identidad (`current_database`, `current_user`, `session_user`, `current_setting('transaction_read_only')`); tamaño total (`pg_database_size`); tamaños agregados por esquema/relación (`pg_total_relation_size`); conteos agregados de usuarios/identidades y buckets/objetos; suma y listado saneado de tamaños desde `storage.objects.metadata->>'size'`. Las consultas de medición concluyeron dentro de transacción de solo lectura. Las lecturas MCP administrativas no constituyen evidencia de RLS.

### Medidas verificadas

| Componente | Medida observada | Método y alcance |
| --- | ---: | --- |
| Base PostgreSQL completa | 19.871.411 bytes (19,87 MB; 18,95 MiB) | `pg_database_size(current_database())`; tamaño físico total del database, no tamaño de un dump exportado |
| Esquema `auth` | 1.441.792 bytes (1,44 MB) | Suma de `pg_total_relation_size` de relaciones del esquema, incluidos índices/TOAST |
| `auth.users` | 212.992 bytes | Tamaño de relación; conteo agregado exacto de filas Auth: 2 |
| `auth.identities` | 81.920 bytes | Tamaño de relación; conteo agregado exacto: 2 |
| Esquema `public` | 335.872 bytes | Relaciones; incluye el modelo de PoC, no datos productivos |
| Esquema `storage` | 278.528 bytes | Tamaño de relaciones/índices de metadatos, no bytes de fotos |
| Storage | 0 buckets, 0 objetos, 0 bytes de objetos | Conteos y suma sobre metadata; inventario saneado por objeto: lista vacía; no se revelaron rutas |

Las extensiones instaladas informadas fueron PostGIS 3.3.7, Supabase Vault 0.3.1, `pg_stat_statements` 1.11, `pgcrypto` 1.3 y `uuid-ossp` 1.1, además del lenguaje `plpgsql`. La lista de extensiones disponibles no se interpreta como instaladas. Esta lectura se refiere al proyecto experimental conectado por MCP.

Los conteos de Auth son agregados y no incluyen correos, IDs, secretos o hashes. La lectura de inventario de Storage devuelve `[]`; por tanto, no hubo tamaños individuales que documentar. Estos tamaños representan el estado actual del proyecto PoC, no la aplicación de producción ni el piloto de 200 alojamientos.

### Cálculo actualizado de retención

Para una aproximación decimal consistente con la capacidad reportada, el piloto supone cinco fotos de **hasta 250.000 bytes ya optimizados** por cada uno de 200 alojamientos: `200 × 5 × 250.000 bytes = 250.000.000 bytes = 0,25 GB` por copia completa. Once puntos completos (7 diarios + 4 semanales) implican **2,75 GB de fotos**. No se vuelve a aplicar a esos 250 KB el cociente de compresión medido sobre originales en la PoC.

Como proxy conservador de base/Auth/metadatos, si cada copia ocupara el tamaño físico actual de 19.871.411 bytes, once copias sumarían aproximadamente **0,219 GB**. No se suma Auth ni Storage metadata otra vez porque ya están dentro del tamaño total de PostgreSQL. El total de referencia es **2,969 GB**. Frente a 4,97 GB disponibles reportados, quedarían aproximadamente **2,001 GB**. Con un umbral operativo sugerido del 80% de la capacidad reportada (3,976 GB), el margen sería aproximadamente **1,007 GB**. Son cálculos de referencia, no medidas de archivos de respaldo: un dump comprimido puede variar, la base crecerá y exportación/configuración aún no se midieron.

La transferencia de fotos para una copia diaria sería hasta **0,25 GB**; para 30 copias diarias serían hasta **7,5 GB**, antes de DB, reintentos y recuperación. La cuenta confirma 5 GB como referencia visual según dirección; el preflight no usó OAuth ni verificó cuota en Drive.

### Viabilidad de exportar y restaurar

- La guía oficial de restauración desde la plataforma afirma que el dump CLI contiene `auth.users`, mientras que la referencia CLI advierte que `db dump` excluye esquemas gestionados `auth` y `storage`. Esta discrepancia entre documentos debe resolverse verificando la versión y el contenido de exportación en el ensayo sin imprimir hashes, direcciones ni tokens. La guía también indica que los bytes de Storage y ajustes/secretos de Auth, JWT y APIs requieren pasos aparte. El plan Free no permite descargar los backups automáticos del proveedor; la copia manual necesita conexión PostgreSQL y permisos adecuados. Storage requiere credenciales autorizadas de lectura para listar/descargar objetos si aparecieran. No se comprobó aquí que esas credenciales estén disponibles.
- La configuración recuperable incluye migrations de Ubícate, roles/grants/RLS propios, extensiones instaladas y versiones, ajustes Auth/Data API/Storage, redirect/site URLs, funciones/secretos si existieran, y una decisión sobre JWT secret/sesiones. Los secretos se conservan separados y se reintroducen manualmente; no se imprimen ni se mezclan en el archivo. Los servicios gestionados y la configuración de organización no se reproducen completamente desde un SQL dump.
- El proyecto tiene una migración de PoC local, pero no un árbol `supabase/` con `config.toml` de restauración. En esta sesión `supabase`, `pg_dump`, `pg_restore` y `psql` no están instalados en PATH. El ejecutable Docker 29.8.2 está disponible, pero Docker Desktop/backend no estaba activo. No se inició Docker ni se instalaron dependencias.
- La restauración selectiva anterior usó PostgreSQL 17.5/PostGIS 3.5.2 y recuperó las seis tablas de PoC. No contenía el servicio completo Supabase ni Vault; el origen reportó PostgreSQL 17.11, PostGIS 3.3.7 y Vault 0.3.1. Esa prueba no es compatible como evidencia de restore integral. Supabase documenta un stack local con PostgreSQL, Auth, Storage y otros servicios, pero requiere Supabase CLI y runtime de contenedores; aún hay que confirmar en un target aislado las versiones de extensiones y el procedimiento de cargar `auth`/Storage ([stack local oficial](https://supabase.com/docs/guides/local-development)).

**Resultado:** hay una vía técnica posible con exportaciones por componente y un stack Supabase aislado, pero no un procedimiento integral listo y verificado. El tamaño real de exportación y la restauración total no están demostrados. AC-04 continúa pendiente.

### Diseño histórico de la prueba única de restauración

Proponer un único ejercicio local de punta a punta, sin conexión de escritura al origen: (1) exportar de forma cifrada el estado actual del proyecto; (2) cargarlo en un stack local de preparación; (3) añadir allí un fixture sintético de 200 alojamientos y 1.000 archivos de 250 KB; (4) crear un paquete cifrado representativo y restaurarlo en un stack local nuevo y vacío. Solo el cuarto paso se cronometra como simulacro de recuperación; la preparación y los dos stacks forman parte del mismo ejercicio. El origen permanece en solo lectura y no se añaden datos remotos. El cronómetro RTO empieza al declarar pérdida del origen y termina al validar la restauración, incluyendo recuperación de clave y creación/configuración del destino. El código y archivos temporales se crearían fuera del repositorio y solo dentro del alcance aprobado.

**Criterios de éxito:**

1. El dump cifrado se descifra con la clave de recuperación custodiada fuera del computador y del destino Drive; autenticidad y manifiesto/hash validan sin error.
2. Base, Auth (dos usuarios agregados en el origen, sin registrar identificadores), tablas/configuración propia, extensiones necesarias, 200 alojamientos sintéticos y 1.000 fotos se restauran; conteos, referencias y hashes coinciden.
3. Supabase local inicia Auth y Storage; políticas/grants esperados están presentes. No se repiten las pruebas esenciales A/B ya superadas.
4. Tiempo total de recuperación **≤24 horas** y espacio total del paquete con retención 7+4 permanece bajo el límite operativo; se registran duración, bytes, comandos y fallos sin exponer datos personales.

**Aislamiento y reversión:** stacks locales de nombres/volúmenes únicos, puertos enlazados solo a `127.0.0.1`, sin rutas ni credenciales de origen disponibles al target medido. El origen se consulta con permisos de solo lectura. Al terminar, apagar y eliminar exclusivamente ambos stacks, volúmenes, exportaciones y temporales del ensayo; verificar que Docker no contenga esos recursos. No se usa Drive, GitHub Actions ni servicios remotos durante la restauración.

**Riesgos:** el archivo incluye dos registros Auth y, para restaurar cuentas, puede incluir hashes de contraseña; debe cifrarse antes de almacenarse y tratarse como material sensible. Supabase local puede diferir del servicio administrado o de versiones de extensión. Una máquina apagada no afecta el ensayo local, pero este no demuestra schedule, RPO ni alerta remota. La prueba tampoco convierte una cuenta Drive normal en almacenamiento inmutable.

**Costo:** USD 0 de servicios remotos y licencias según la configuración propuesta; se usan CPU, red, energía y disco local y se descargan imágenes de contenedor. Supabase CLI y el runtime Docker están ausentes/inactivos en el entorno observado, así que iniciar el test requeriría aprobación que incluya instalarlos/activarlos y obtener espacio local temporal. No se propone hacerlo en esta tarea.

La ejecución requiere una autorización agrupada para exportar el estado experimental actual a un archivo cifrado local (incluidos Auth hashes), generar fixture sintético local, instalar/activar runtime local, restaurar y borrar los temporales señalados. No incluye cambios al origen, Drive, GitHub o arquitectura productiva. La prueba solo mediría RTO para ese fixture; RPO de 24 horas seguirá condicionado por el programador y un watchdog independiente.

### Ejecución autorizada y resultado AC-04, 2026-10-20

Dirección autorizó el ensayo integral descrito arriba, con inspección remota solo lectura y reconstrucción en dos entornos locales desechables. El preflight se detuvo antes de exportar porque el daemon Docker no está disponible, Supabase CLI no está en PATH y la conexión Supabase MCP accesible corresponde a otra cuenta/proyectos. No se consultó el proyecto experimental con otro MCP, no se instalaron dependencias y no se hicieron escrituras remotas. La evidencia detallada y clasificación por estado están en [verificación de restauración](poc-auth-data-api-rls/restauracion-respaldo.md#ensayo-integral-autorizado-preflight-bloqueado-2026-10-20).

| Criterio del ensayo | Estado | Resultado medido |
| --- | --- | --- |
| Exportar PostgreSQL, Auth, configuración recuperable y Storage | NOT RUN | Sin exportación ni lectura remota nueva. |
| Generar 200 propiedades y 1.000 fotografías ficticias localmente | NOT RUN | No se generaron datos para este ensayo. |
| Empaquetar cifrado, inventariar y verificar SHA-256 | NOT RUN | No existe paquete, manifiesto o clave del ensayo. |
| Restaurar desde cero en segundo entorno y validar | NOT RUN | No se creó entorno local. |
| Medir tiempo, bytes y consumo de recursos | BLOCKED | Sin duración RTO, tamaños ni consumo medidos; el cronómetro no comenzó. |
| Comparar RTO con 24 h | BLOCKED | No calculable por falta de ejecución. |
| Evaluar retención 7 diarios + 4 semanales | BLOCKED | La estimación aritmética previa (2,969 GB bajo sus supuestos) no es medición de once respaldos. |
| Demostrar RPO de 24 h | NOT RUN | En cualquier caso, un simulacro único no demostraría el RPO operativo. |

**Conclusión vigente:** AC-04 permanece **BLOCKED y no satisfecho**. No se obtuvo FAIL del mecanismo porque el mecanismo integral no se ejecutó. La restauración selectiva de los seis objetos documentada históricamente no equivale a restaurar PostgreSQL + Auth + Storage/configuración ni altera esta conclusión. Se requiere recuperar Docker local, disponer de Supabase CLI y habilitar `supabase_ubicate` de solo lectura para reanudar. F01-H00 permanece abierto.

**Actualización de prerrequisitos, 2026-10-20:** Docker Desktop fue iniciado; `docker info` responde en `default`. Supabase CLI `2.121.0` está instalada en `%TEMP%` y `--version`/`--help` responden. La configuración scoped del MCP ahora indica ref `ivzjijagahkczdghoqkz`, `read_only=true` y funciones `database,docs`, tanto en el archivo del proyecto como en una única entrada global de Codex. Sin embargo, el servidor todavía no aparece en el runtime actual. No hubo nueva lectura/exportación remota. Se requiere reabrir esta sesión de Codex y completar OAuth en navegador si se pide; después validar la identidad del proyecto y el modo de solo lectura. La evidencia de comandos y el estado de Chrome DevTools MCP están en [verificación de restauración](poc-auth-data-api-rls/restauracion-respaldo.md#reanudación-de-prerrequisitos-2026-10-20).

### Continuación de recuperación integral, 2026-10-20

La reanudación corrigió el estado del preflight: `supabase_ubicate` está operativo y el CLI autenticado puede ver el ref objetivo. Se localizaron y verificaron los clientes portátiles PostgreSQL 17.11 en `%TEMP%\ubicate-postgresql-client-17.11\client\bin`; no se instaló ningún componente. `config pull` completó una lectura guardada con EFS fuera del repositorio. El CLI reportó 0 Edge Functions y 7 nombres de secretos. SQL y `storage ls --experimental` confirmaron que Storage tiene 0 buckets y 0 objetos.

La referencia actual de `supabase db dump` excluye esquemas gestionados como `auth` y `storage`, por lo que el export integral se hará con el `pg_dump` 17.11 directo y se inspeccionará el TOC para verificar `auth` y `storage`; el proceso anterior no generó un dump ([backup/restore con CLI](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore)). La guía de migración Auth indica usar un backup completo o `pg_dump` para incluir `auth` ([migrar usuarios Auth](https://supabase.com/docs/guides/troubleshooting/migrating-auth-users-between-supabase-projects)). Los bytes de Storage se exportan aparte del metadata PostgreSQL ([descargar objetos](https://supabase.com/docs/guides/storage/management/download-objects)); el inventario observado está vacío. `config pull` y su lectura están disponibles por CLI; secretos de Edge Functions se limitaron a sus nombres y se reintroducirán manualmente si fueran necesarios ([configuración y secretos](https://supabase.com/docs/guides/functions/secrets)).

AC-04 permanece **BLOCKED y no satisfecho** hasta que se ingrese localmente la contraseña PostgreSQL existente en el prompt oculto del lanzador de `pg_dump`, y se disponga de una clave pública OpenPGP receptora cuya privada esté custodiada fuera del equipo. El lanzador está listo en `%TEMP%\Ubicate-F01-H00-export-preflight\capture-postgres-dump.ps1`; pasó el análisis sintáctico y no se ejecutó. No se restableció la contraseña ni se cambiaron permisos. Cinco contenedores anteriores siguen intactos; los puertos `54321` y `54322` están ocupados, y `55000-55019` se observaron libres como candidatos a revalidar. Todavía no hay dump, paquete, fixture sintético, pilas nuevas ni mediciones. El detalle y la intervención local necesaria están en [restauracion-respaldo.md](poc-auth-data-api-rls/restauracion-respaldo.md#continuación-de-recuperación-integral-2026-10-20).

## PoC local de optimización de fotografías, AC-05, 2026-10-17

### Alcance y método

Se creó una página HTML temporal servida únicamente en `127.0.0.1`, sin dependencias. Las tres fotos de referencia se descargaron temporalmente de Pexels: habitación sin personas de Tatiana Syrikova, sala vacía de Curtis Adams y fachada residencial de Isaac Mitchell. Sus páginas identifican la licencia como gratuita bajo la licencia de Pexels. No son propiedades de Ubícate ni se proponen para anuncios reales. Los archivos de prueba quedaron fuera del repositorio. La página procesó los bytes localmente, no llamó a APIs ni guardó resultados en almacenamiento del navegador. Se creó además un JPEG sintético con Orientation=6 y etiquetas GPS ficticias para revisar normalización, y un archivo `.jpg` inválido de 33 bytes.

En Chrome 154 de escritorio se midieron Canvas y OffscreenCanvas a dimensión máxima de 1.200 y 1.600 px, calidades 0,7/0,8/0,9 y formatos JPEG/WebP/AVIF. Se midieron tamaño, formato MIME efectivo, dimensiones, tiempo de codificación y PSNR. Para calidad 0,8 a 1.600 px se compararon JPEG, WebP y AVIF; se generó una hoja de previsualización para revisión visual en tamaño reducido. Las 84 salidas de la matriz tardaron 18,26 s en total. El PSNR compara pixeles después del redimensionamiento y no reemplaza la valoración visual a tamaño completo.

### Resultados observados

| Foto de referencia | Original | JPEG, 1.600 px, q0,8 | WebP, 1.600 px, q0,8 | PSNR JPEG/WebP |
| --- | ---: | ---: | ---: | ---: |
| Habitación | 1.057.663 B | 186.145 B, ahorro 82,4 % | 113.572 B, ahorro 89,3 % | 36,10 / 35,76 dB |
| Sala vacía | 591.638 B | 227.639 B, ahorro 61,5 % | 145.824 B, ahorro 75,4 % | 37,01 / 36,91 dB |
| Fachada | 1.015.493 B | 225.089 B, ahorro 77,8 % | 125.834 B, ahorro 87,6 % | 35,69 / 35,37 dB |
| Conjunto ponderado | 2.664.794 B | 638.873 B, ahorro 76,0 % | 385.230 B, ahorro 85,5 % | Rango: 35,69–37,01 / 35,37–36,91 dB |

A dimensión máxima 1.200 px y q0,8, WebP produjo 241.480 B para el conjunto, un ahorro ponderado de 90,9 %. Se conserva 1.600 px como referencia porque mantiene más detalle; el balance entre ambas dimensiones requiere revisión visual con fotografías reales autorizadas.

Canvas entregó JPEG y WebP con los MIME esperados. La solicitud `image/avif` devolvió `image/png` en este navegador y generó archivos mayores que sus originales; por ello AVIF no es una salida válida de esta PoC. En Canvas a q0,8, el promedio fue 32,9 ms para JPEG y 155,9 ms para WebP a 1.200 px; a 1.600 px fue 81,0 ms y 332,6 ms, respectivamente. OffscreenCanvas entregó el mismo tamaño, PSNR y dimensiones que Canvas en los tres formatos de referencia a 1.600 px/q0,8; el tiempo varió y no mostró una mejora consistente. Se ejecutó en el hilo principal, así que tampoco se midió el beneficio de un Web Worker.

El tamaño agregado a 1.600 px disminuyó al elevar la calidad: JPEG produjo 494.258 B/638.873 B/983.774 B a q0,7/q0,8/q0,9, con ahorro ponderado de 81,5 %/76,0 %/63,1 %; WebP produjo 281.760 B/385.230 B/714.614 B, con ahorro de 89,4 %/85,5 %/73,2 %. Solo q0,8 tuvo medición PSNR y hoja visual; q0,7/q0,9 se compararon por bytes y dimensiones, no por valoración visual.

El fixture sintético de entrada fue detectado con EXIF y GPS; la decodificación aplicó Orientation=6. Los derivados JPEG/WebP quedaron con dimensiones rotadas esperadas y sin bloques EXIF/GPS detectables. Esto prueba ese caso sintético en Chrome, no todas las variantes EXIF de cámaras o móviles. El archivo inválido no se decodificó y no produjo salidas. La revisión de la hoja visual a escala reducida no encontró una degradación obvia, pero no constituye una comparación humana detallada a tamaño completo.

Se comprobó una emulación móvil de Chrome a 390×844, DPR 3 y limitación CPU 4×. La página no presentó desbordamiento horizontal. En una foto de sala, JPEG q0,8/1.600 generó 239.968 B en 153 ms y WebP 160.528 B en 211 ms bajo esa emulación. No había un navegador ni dispositivo móvil real disponible, por lo que estos valores no describen un teléfono real.

### Comparación de opciones y recomendación

| Opción | Resultado o evidencia | Evaluación para una futura prueba del formulario |
| --- | --- | --- |
| Canvas nativo | Medido en Chrome; sin dependencia; JPEG/WebP funcionan y AVIF cae a PNG | Candidato inicial de menor complejidad. Comprobar siempre el MIME devuelto antes de aceptar la salida. |
| OffscreenCanvas nativo | Mismo tamaño y PSNR que Canvas; sin mejora temporal consistente en ejecución de hilo principal | Reservarlo para un worker si mediciones reales muestran bloqueo de interfaz. No justifica adoptarlo ahora. |
| `browser-image-compression` | OSS y documenta reducción de dimensión, calidad, Web Worker y `preserveExif` desactivado por defecto; paquete no instalado y no medido | Puede simplificar progreso/cancelación y fallback a hilo principal, pero añade dependencia y no se espera que mejore el codificador del navegador. Revisar versión, licencia transitiva y política CSP antes de aprobarla. |
| Sharp | No está instalado ni se midió. Su API documenta JPEG, WebP y AVIF; elimina metadatos por defecto | Útil para procesamiento de servidor por control y consistencia. Añade dependencia nativa de libvips y necesita un entorno backend que aún no está aprobado. |

**Recomendación candidata:** en una futura prueba autorizada del formulario, decodificar la imagen en el dispositivo, respetar orientación, limitar el lado mayor a 1.600 px y emitir WebP a calidad inicial 0,8. Aceptar solo si `Blob.type` es `image/webp`; si no, volver a JPEG q0,8 y confirmar `image/jpeg`. Mantener el procesamiento secuencial por archivo y liberar bitmap/object URLs tras cada resultado. No conservar el original por defecto. La decisión de conservarlo por moderación, edición o recuperación requiere definición de producto y una estimación separada de almacenamiento.

Para el piloto, las 1.000 fotos de hasta 250.000 B cada una constituyen el objetivo de tamaño **ya optimizado**: hasta 250 MB por copia completa y 2,75 GB en once copias. La PoC obtuvo una reducción de 85,5% en su conjunto de tres originales de referencia (2.664.794 B originales y 385.230 B WebP); ese resultado caracteriza únicamente esas muestras. No se aplica de nuevo a los 250 KB del supuesto piloto ni se infiere un tamaño original promedio del piloto sin datos medidos. No se incluyen base de datos, metadatos, miniaturas ni crecimiento. Este cálculo no es una medida de Storage ni de egreso.

### Riesgos, evidencia pendiente y estado AC-05

La compresión del navegador no valida seguridad ni autorización. Antes de guardar en Storage deben verificarse en servidor el tamaño en bytes y pixeles, formato real mediante decodificación, cantidad máxima, nombres generados, límites contra agotamiento de memoria/CPU, permisos de escritura/lectura/borrado y limpieza de objetos. Se deben probar archivos corruptos, MIME falsificado, formatos HEIC/HEIF de móviles, perfiles de color, transparencia, contenido animado y metadatos variados. El formulario deberá solicitar derechos de uso de cada foto y separar ubicación pública exacta o aproximada según política vigente. No se probó subida, acceso por anunciante, Storage/RLS, miniaturas, entrega, borrado ni límites de cuota.

Por lo anterior, **AC-05 queda Parcial**, no completado. Esta PoC aporta evidencia local de optimización, manejo de orientación y eliminación de metadatos sintéticos; las pruebas de almacenamiento y autorización continúan pendientes.

Fuentes consultadas el 2026-10-17: fotos de [habitación](https://www.pexels.com/photo/cozy-bedroom-interior-with-no-people-3933240/), [sala vacía](https://www.pexels.com/photo/an-empty-living-room-7027840/) y [fachada](https://www.pexels.com/photo/facade-of-an-apartment-building-14367789/) y [licencia Pexels](https://www.pexels.com/license/); [Canvas `toBlob`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob), [OffscreenCanvas `convertToBlob`](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/convertToBlob), [`createImageBitmap` y orientación EXIF](https://developer.mozilla.org/en-US/docs/Web/API/Window/createImageBitmap), [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression), [Sharp, salida y metadatos](https://sharp.pixelplumbing.com/api-output/) y [Sharp, redimensionamiento](https://sharp.pixelplumbing.com/api-resize/).

**Actualización AC-04, 2026-10-20:** la clave OpenPGP se generó en la USB conectada y la recuperación se verificó con un archivo ficticio: descifrado en Pinentry y SHA-256 coincidente. Esta evidencia sustituye el estado previo de clave pendiente, pero no demuestra una copia de recuperación independiente. El dump real sigue **NOT RUN**. Antes de ejecutarlo falta guardar y comprobar la clave privada protegida en un segundo medio externo independiente. Después será necesario introducir la contraseña PostgreSQL existente en el prompt oculto local. No se cambió Supabase remoto ni se imprimieron secretos. Véase [evidencia y alcance de recuperación](poc-auth-data-api-rls/restauracion-respaldo.md#validación-de-clave-openpgp-con-archivo-ficticio-2026-10-20).

**Actualización AC-04, 2026-10-20:** ambas copias externas de la clave están preparadas. La copia independiente se importó y recuperó un archivo ficticio en el propio segundo medio, con SHA-256 coincidente; los artefactos temporales se limpiaron. Esto resuelve el prerrequisito criptográfico, pero no constituye una exportación de datos. La exportación real aún requiere que el responsable introduzca la contraseña PostgreSQL existente en dos prompts locales ocultos. AC-04 sigue abierto. Evidencia en [restauración y recuperación](poc-auth-data-api-rls/restauracion-respaldo.md#copia-independiente-de-clave-recuperada-y-validada-2026-10-20).

## Resultado actualizado del ensayo integral AC-04, 2026-10-21

Se completó la exportación PostgreSQL 17.11 con la sesión de lectura verificada (`transaction_read_only=on`), cifrado OpenPGP y recuperación desde la copia externa. El TOC tiene 1.408 entradas y contiene los esquemas `auth`/`storage` y las seis tablas `public.ubicate_poc_*`. El inventario remoto de Storage fue de cero buckets, cero objetos y cero bytes. La configuración recuperable se guardó en EFS fuera del repositorio. La captura de Windows mostró `Device encryption: On`; los comandos de administración no permitieron obtener más detalle del estado del volumen.

El fixture local contiene 200 propiedades ficticias y 1.000 JPEG sintéticos de 640x480, con 16.870.830 bytes. Se restauró el dump en una base nueva creada desde `template0`, dentro del contenedor local PostgreSQL 17.11. `pg_restore` terminó con código 0 y nueve consultas de conteo sobre tablas PoC, `auth.users`, `storage.buckets` y `storage.objects` pasaron. La fase del proceso `pg_restore` midió 0,808 s; esta medida parcial no equivale al RTO del servicio restaurado.

Tras el restore, el contenedor de base de datos quedó saludable, Kong quedó saludable y REST siguió en ejecución. Auth, Realtime y Storage quedaron en estado `unhealthy`/`restarting` con 12 reinicios cada uno. La causa no se aisló. El archivo en claro y el llavero temporal se eliminaron. Los 12 contenedores creados para las dos pilas del ensayo se detuvieron; los volúmenes y redes se conservaron. Los servicios Docker preexistentes no se modificaron y no hubo escrituras remotas.

AC-04 queda **parcial, bloqueado y no satisfecho**. Después de tres iteraciones de corrección se detuvo el trabajo conforme a la política de autonomía supervisada. Siguen pendientes la integración del fixture en la base restaurada, la carga de las fotos sintéticas a Storage local, un nuevo respaldo cifrado, la restauración en el segundo entorno, la verificación de salud integral, las mediciones RTO/RPO y la limpieza final. Se requiere intervención humana para abrir una nueva unidad de diagnóstico local. No cerrar F01-H00.
