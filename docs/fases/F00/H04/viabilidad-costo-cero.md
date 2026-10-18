# F00-H04: Viabilidad real a costo cero

**Fecha de consulta:** 2026-10-16
**Estado al 2026-10-16:** evaluación documental de entrada para F01-H00; F00-H04 fue cerrado por dirección. La política económica está aprobada; no se seleccionan proveedores ni arquitectura y las estimaciones siguen condicionadas.
**Alcance:** resolver brechas de autenticación/correo, backups/restauración, medios, cuotas y permiso comercial. No se crearon cuentas ni se activaron servicios.

## Dictamen ejecutivo

No se demuestra un costo mensual mínimo inevitable para un piloto si se aceptan subdominios gratuitos, cuotas con apagado, gestión manual y ausencia de SLA. Sí se demuestra que USD 0 no equivale a operación garantizada: alcanzar límites puede detener hosting, correo o servicios; no se confirma en cuentas reales la elegibilidad comercial, los controles de facturación, el correo remitente ni la restauración.

[Inferencia] La opción A puede reducir la integración entre identidad, datos y permisos por usar un backend integrado, aunque Supabase Storage y correo agregan brechas de capacidad. La opción B se beneficia de autenticación, correo de verificación y hosting con topes publicados por Firebase, pero divide la operación entre Firebase, Cloudinary, un firmador de cargas, almacenamiento de backup y mapas. Con el modelo compacto de imágenes, Cloudinary sería el primer límite cuantificable cerca de 1.333 anuncios. No hay ganadora universal: B tiene más topes de apagado publicados y A menos componentes a integrar en el backend; ambas requieren comprobación humana y técnica antes de producción.

Dirección aprobó la política “USD 0 por defecto, con gastos únicamente mediante autorización humana expresa” el 2026-10-16. Desarrollo apunta a infraestructura USD 0/mes; el piloto prioriza gratuidad; producción inicial mantiene USD 0 cuando sea técnica, legal y operativamente sostenible. Seguridad, privacidad, respaldos y recuperación son requisitos previos a operar con usuarios reales. La decisión y sus ocho reglas constan en [decisiones](../../../direccion/decisiones.md). Esta política no selecciona arquitectura ni proveedor. El costo de operación humana, dominio propio, equipo/conectividad, asesoría y recuperación debe hacerse visible en la evaluación.

## Supuestos comunes de capacidad

Son cálculos ilustrativos reproducibles, no pronósticos de demanda. Cada anuncio activo conserva cinco fotos, cada una optimizada a un máximo objetivo de 250 KB antes de subir. No se retienen originales, variantes ni panoramas 360° en el piloto de cálculo. Se estiman diez aperturas de detalle por anuncio al mes y cinco fotos descargadas por apertura. Se asume un anunciante activo por anuncio para aproximar MAU. La tasa real de uso, codificación, caché, borradores y duplicados no se conoce.

| Anuncios | Fotos activas | Almacenamiento | Descargas de foto al mes | Transferencia estimada |
| ---: | ---: | ---: | ---: | ---: |
| 200 | 1.000 | 0,25 GB | 10.000 | 2,5 GB |
| 1.000 | 5.000 | 1,25 GB | 50.000 | 12,5 GB |
| 5.000 | 25.000 | 6,25 GB | 250.000 | 62,5 GB |

El cómputo excluye HTML/JS, mapas, reintentos, miniaturas, varias resoluciones, cargas fallidas, backups, otras páginas y actividad de búsqueda. Los tamaños y frecuencias deben medirse en una prueba autorizada antes de confiar en estos umbrales.

## Arquitectura candidata A: plataforma gestionada integrada

| Capa | Candidato concreto | Tipo y operación |
| --- | --- | --- |
| Cliente web responsive | React, biblioteca open source, servido estáticamente | OSS; Ubícate mantiene código, despliegue y accesibilidad. El stack está pendiente. |
| Identidad | Supabase Auth Free, correo/contraseña y enlaces de verificación/recuperación | Servicio propietario. SMTP predeterminado de Supabase no es productivo: limitado a destinatarios del equipo, 2 mensajes/hora y best effort. Requiere SMTP externo y remitente verificado. |
| Datos | Supabase PostgreSQL Free; PostGIS para búsquedas espaciales | Motor PostgreSQL/PostGIS abierto; servicio gestionado propietario. Tope publicado de 500 MB DB; almacenamiento de archivo de 1 GB. Al superar 500 MB la base se vuelve de solo lectura. |
| Fotos | Supabase Storage, 5 × 250 KB por anuncio; reglas privadas/públicas según decisión | Servicio propietario. Fácil de integrar, pero su cuota de 1 GB equivale a unos 800 anuncios bajo el modelo (1 GB / 1,25 MB). El flujo de lectura puede agotar egreso antes. No incluir documentos personales. |
| Mapa | MapLibre GL JS + instancia pública OpenFreeMap + datos OSM | MapLibre OSS. OpenFreeMap es servicio público gratuito sin SLA; sus términos permiten discontinuación. Ubícate mantiene atribución y fallback de resultados en lista. |
| Backend y permisos | Supabase API, Row Level Security y Edge Functions cuando se requieran secretos | Servicio gestionado. Equipo define políticas por anunciante, validación de solicitudes, revisión de roles, cuotas y registros. No usar claves privilegiadas en el cliente. |
| Hosting | Firebase Hosting Spark o Netlify Free, sujeto a términos de cuenta | Servicio propietario. Firebase Hosting publica 10 GB/mes de transferencia y 10 GB de storage; en Spark las páginas se deshabilitan tras alcanzar la cuota de transferencia. Elegir uno sería decisión pendiente. |
| Backups independientes | Exportación programada y cifrada de PostgreSQL + archivos a B2 o almacenamiento local existente separado | Operación propia. Supabase Free no da backups descargables administrados. Exportar DB, Auth, Storage y objetos por separado; el procedimiento y la restauración aún deben probarse. B2 no se presume aprobado ni habilitado. |
| Correo transaccional | Brevo Free como candidato externo, dominio/remitente verificado | Servicio propietario, hasta 300 envíos/día publicado y no acumulable. La guía de plan lo presenta para explorar y no certifica por sí sola que una cuenta Ubícate pueda usarlo comercialmente. La verificación de remitente/dominio y aceptación de mensajes requieren cuenta autorizada. |

**Ventajas:** modelo relacional y PostGIS, API y acceso a datos integrados, una superficie operativa menor que el conjunto desacoplado y mejor ajuste a inmueble/unidad. **Riesgos:** Supabase Storage no soporta ni el escenario de 1.000 anuncios bajo el modelo; SMTP y backups requieren componentes externos; almacenamiento/exportación/restauración tienen mayor trabajo de integración de lo que su etiqueta “integrado” sugiere. Supabase Free puede pausar proyectos inactivos. Egreso de fotos (5 GB cached + 5 GB uncached) puede agotarse antes que almacenamiento o DB.

## Arquitectura candidata B: servicios gratuitos desacoplados

| Capa | Candidato concreto | Tipo y operación |
| --- | --- | --- |
| Cliente web responsive | React y MapLibre GL JS | OSS; código y versiones operados por Ubícate. |
| Hosting | Firebase Hosting Spark | Servicio propietario. 10 GB/mes de transferencia y 10 GB de releases; al exceder transferencia en Spark, sitio temporalmente deshabilitado hasta siguiente mes. Nunca pasar a Blaze para el objetivo USD 0. |
| Identidad | Firebase Authentication Spark con email/contraseña | Servicio propietario. Cuotas publicadas: hasta 1.000 confirmaciones de correo/día, 150 restablecimientos de contraseña/día, 3.000 usuarios activos diarios de nivel 1 en el plan Spark y creación de cuenta limitada a 100/hora/IP. Cuentas registradas sin límite publicado. Términos de Firebase expresan uso relacionado con actividad comercial/profesional. |
| Datos | Cloud Firestore Spark, con documentos de anuncio, unidades y coordenadas/geohash | Servicio propietario. Cuotas: 1 GiB, 50.000 lecturas/día, 20.000 escrituras/día, 20.000 eliminaciones/día y 10 GiB/mes de egreso. El modelo documental exige diseñar consistencia inmueble/unidad y consultar/filtrar geohashes. |
| Fotos | Cloudinary Free | Servicio propietario. 25 créditos mensuales compartidos entre almacenamiento, transformación y transferencia; un crédito representa 1 GB almacenado, 1 GB de transferencia o 1.000 transformaciones según la métrica. Carga firmada desde función backend, nunca se expone el secreto. |
| Firma/control de carga | Supabase Edge Function Free | Servicio propietario adicional. Supabase publica 500.000 invocaciones/mes Free, sin sobreuso incluido. Validar Firebase ID token, rol y dueño del anuncio, mime/tamaño, cuota por cuenta, frecuencia y parámetros permitidos; secreto Cloudinary solo servidor. Firebase Cloud Functions se excluye porque exige plan Blaze y vincular cuenta de facturación. Supabase puede pausar proyectos Free inactivos; uso/condiciones de cuenta firmadora quedan pendientes. |
| Mapas | MapLibre + OpenFreeMap/OSM, barrios y puntos conocidos de Tunja como filtro inicial; selección de pin por anunciante | OSS más servicio público sin SLA. No depender del servidor público Nominatim para autocompletado. Geocodificación y precisión en Tunja no verificadas. |
| Backups independientes | `firebase auth:export` + export lógico Firestore + export de metadatos y descarga de objetos desde Cloudinary a B2/local | Operación propia. Guardar copias cifradas, versionadas y separadas de credenciales. Restauración con CLI/Admin SDK debe probarse. Firebase managed Firestore export/import exige Blaze, así que se excluye en Spark. |
| Correo | Correos nativos de Firebase Auth para confirmar/verificar y recuperar contraseña | Servicio propietario integrado, cuota pública y sin servidor SMTP propio. Verificar entregabilidad, dominio, branding, límites por IP, políticas antispam y experiencia desde una cuenta antes de habilitar. |

**Ventajas:** autenticación/verificación/recuperación y hosting con límites publicados que apagan el servicio en el plan sin facturación, sin requerir un SMTP de prueba. No se aloja foto en hosting ni se carga el egress de fotos sobre Firestore. **Riesgos:** más terceros, integración de roles y firmas, datos documentales menos portables que SQL, límites de correo diarios y ausencia de SLA. Cloudinary impone el primer límite cuantificable en la carga modelada. Si el firmador requiere activar facturación, B deja de ser candidato USD 0 hasta hallar un firmador bajo cuota sin facturación.

## Costos, primer límite y capacidad en escenarios

Los planes gratuitos publican $0, no un mínimo de costo de producción universal. Ningún dominio propio, SLA, soporte, monitoreo, recuperación administrada o alta disponibilidad está presupuestado. La cuenta real, región, impuestos, moneda, condiciones promocionales y reglas de conversión a pago no se han comprobado. Se asume que no se habilita facturación ni se registra medio de pago; sin esa restricción, cualquier alerta de presupuesto sería insuficiente como freno.

### B: Cloudinary bajo el modelo común

Se calcula una versión almacenada por foto (250 KB), una descarga por foto en cada vista de detalle y una transformación por foto. A efectos de cuota: créditos = GB almacenados + GB servidos + transformaciones/1.000. Ignora cambios de imagen, reintentos y otros recursos.

| Anuncios | GB guardados | GB de transferencia | Transformaciones | Créditos estimados | Lectura |
| ---: | ---: | ---: | ---: | ---: | --- |
| 200 | 0,25 | 2,5 | 1.000 | 3,75 / 25 | Dentro del plan publicado, sujeto a variación |
| 1.000 | 1,25 | 12,5 | 5.000 | 18,75 / 25 | 75% del allowance; cercano al límite |
| 5.000 | 6,25 | 62,5 | 25.000 | 93,75 / 25 | Supera en 3,75×; entrega puede degradarse/suspenderse según el plan |

Con estos supuestos, 25 créditos se alcanzarían aproximadamente en 1.333 anuncios activos si se mantienen las mismas visitas y tamaños. Cloudinary dice que su free tier se puede usar en producción mientras el consumo esté en la allowance, pero sus términos limitan el uso a sitios/apps de propiedad u operación del cliente y excluyen reventa/comercialización ulterior del servicio. El uso como infraestructura de Ubícate parece encajar en esa descripción pública, pero la cuenta y la interpretación legal no están verificadas. El servicio notifica el exceso y puede deshabilitar; no se debe depender de conversión automática a pago.

### Límites comparados

| Sistema / límite público | 200 anuncios | 1.000 anuncios | 5.000 anuncios | Primer cuello de botella conocido |
| --- | --- | --- | --- | --- |
| A: Supabase Storage 1 GB y egreso 5 GB cached + 5 GB uncached | 0,25 GB; 2,5 GB de fotos descargadas | 1,25 GB; 12,5 GB descargados | 6,25 GB; 62,5 GB descargados | Si la entrega usa un solo tipo de egreso, alcanza 5 GB cerca de 400 anuncios; Storage alcanza 1 GB cerca de 800. La composición cached/uncached y egress de DB/Auth/funciones se debe medir. |
| A: Supabase DB, 500 MB | No puede calcularse sin esquema/datos | No calculable | No calculable | Datos de usuario/inmueble, índices y logs; exceder 500 MB vuelve DB read-only |
| A: Supabase SMTP predeterminado | No apto | No apto | No apto | 2 correos/hora y destinatarios de equipo; debe reemplazarse antes de registro público |
| A: Brevo, 300 correos/día | Cubre ritmo bajo de registros, recuperación y notificaciones si no se concentran | Igual, pero no soporta un lanzamiento de 300+ correos en el día | Igual | Tope diario y revisión/entregabilidad; sobre 300/día, cola o no entrega según tipo de correo; sin recarga implícita asumida |
| B: Cloudinary, 25 créditos/mes | 3,75 créditos | 18,75 créditos | 93,75 créditos | Cerca de 1.333 anuncios en este patrón de tráfico |
| B: Firebase Auth email | Cuotas amplias para el modelo | Hasta 1.000 verificaciones/día y 150 resets/día | Un lanzamiento con >1.000 verificaciones o >150 resets el día correspondiente | Ritmo pico, antispam y reputación, no cantidad acumulada de cuentas. El límite general publicado también incluye 3.000 usuarios activos diarios Tier 1 y alta de 100 cuentas/hora/IP. |
| B: Supabase Edge Function para firma, 500.000 invocaciones/mes | 1.000 | 5.000 | 25.000 | No es límite esperado en estos escenarios si se llama una vez por foto; la función crea una dependencia y una cuenta independiente. |
| B: Firestore | Datos/lecturas requieren volumen de búsqueda real | Igual | Igual | Supuesto ilustrativo: 5 búsquedas × hasta 20 fichas y 10 detalles × 7 lecturas = 34k, 170k y 850k lecturas/mes (promedio 1,1k, 5,7k, 28,3k/día). Bajo 50k/día, pero picos, paginación y filtros pueden cambiarlo. |
| B: Firebase Hosting, 10 GB/mes | Transferencia depende del bundle y mapas | No computable de los anuncios solamente | No computable | Tras 10 GB/mes el hosting Spark se deshabilita después de gracia; medir tamaño y sesiones. No incluir fotos de anuncio aquí. |
| Backup B2, 10 GB gratis | Un conjunto de 0,25 GB de fotos cabe | 1,25 GB cabe | 6,25 GB cabe una copia, sin DB/configuración | Dos copias completas de fotos a 5.000 anuncios sumarían 12,5 GB antes de datos; mantener segunda copia cifrada en disco existente o limitar retención. Disponibilidad de $0/cero tarjeta debe comprobarse en cuenta. |
| Mapa OpenFreeMap | Capacidad publicada sin límite de vistas | Idem | Idem | El primer riesgo es disponibilidad/cambio de términos, no una cuota monetaria publicada. No hay SLA ni precisión medida. |

Por una cuenta/modelo con cinco fotos por anuncio, almacenamiento optimizado y vistas previstas, el primer límite común no es la base de datos: A presenta Storage y correo; B presenta la allowance de Cloudinary y su función de firma. La transferencia del HTML/JavaScript, densidad de consultas y caudal de alta deben medirse. No existe una estimación pública que convierta número de anuncios a uso real de aplicación sin instrumentación.

## Registro, recuperación, copias y restauración

| Necesidad | A | B | Estado de certeza |
| --- | --- | --- | --- |
| Verificar correo de anunciante | Supabase Auth + SMTP externo verificado; SMTP predeterminado de Supabase no sirve para producción | Flujo nativo de Firebase Auth con cuota publicada | Capacidad pública documentada; dominio, reputación y cuenta real pendientes |
| Recuperar cuenta de forma segura | Token de un solo uso por Supabase Auth, entrega SMTP; rate limit, expiración, respuesta genérica y revocación de sesión a definir/probar | Firebase Auth reset email con cuota publicada; protección abuso y sesión a probar | No se realizaron E2E ni configuración real |
| Exportar cuentas | Supabase Auth Admin API/CLI; datos de credenciales y hashes requieren acceso restringido y procedimiento exacto | Firebase CLI `auth:export`; guardar metadatos y comprobar hash/algoritmo exportado | Documentación permite exportar; importación/restauración real no verificada |
| Copiar datos | Supabase DB export separado de Auth, Storage metadata, objetos y configuración de políticas | Firestore JSON/export lógico, usuarios, reglas/índices/configuración | Supabase `db dump` puede excluir `auth` y `storage`; managed export Supabase/Firestore requiere plan/facturación en escenarios citados |
| Copiar fotos | Objetos Storage descargados a archivo separado | Cloudinary API descarga/sincronización de originales derivados publicados | API/retención/cuotas de cuenta no verificada; presupuesto 0 para almacenamiento externo no certificado |
| Restaurar | Importar SQL y Auth, reponer objetos, políticas, secretos y DNS; requiere entorno limpio y un ejercicio | Reimportar usuarios/documentos/reglas y volver a subir objetos; validar IDs de usuario y rutas | Restauración verificable pendiente. No llamar “backup” completo hasta pasar ejercicio aislado |
| Copia independiente gratuita | B2 publica 10 GB de almacenamiento free; local cifrado puede ser $0 marginal solo si existe capacidad | Igual | Términos/cuenta y caps de gasto requieren cuenta y revisión. Copiar en la misma cuenta/proveedor no es independencia suficiente |

Para ambas opciones se propone, sin aprobar, copia diaria cifrada de datos cambiados, copia semanal completa, checksums, al menos dos custodios autorizados de secretos, retención definida, prueba mensual de restauración aislada y registro de RPO/RTO observado. El cifrado de backup no sustituye control de acceso. Las credenciales/hashes de contraseña y datos personales requieren acceso mínimo y eliminación segura conforme a política futura.

## Mapas, Tunja y mitigación de agotamiento

MapLibre es software open source de visualización. No trae datos, tiles, geocodificador ni operación. OpenFreeMap publica instancia gratuita sin límites de solicitudes, con términos “as-is” y sin garantía de continuidad; atribución de OpenStreetMap y licencia ODbL aplican a datos OSM. Un eventual mapa de Tunja debe probar calles, barrios, campus y puntos de interés con una muestra representativa. Para el piloto puede evaluarse búsqueda por barrios/sectores aprobados y pin aproximado aportado por anunciante; eso es propuesta pendiente, no política de ubicación. Nominatim comunitario no se recomienda para autocompletado por sus límites publicados.

Controles de uso/costo propuestos:

1. No habilitar planes con facturación, auto-recarga, tarjetas ni vinculación a billing para despliegues de USD 0.
2. Separar cuentas/proyectos de desarrollo y piloto, revisar uso semanal y fijar alerta operativa al 70/85/95% de cada cuota donde haya contador.
3. Rechazar cargas sobre límite en cliente y servidor; máximo propuesto de cinco fotos por anuncio y 250 KB por archivo optimizado, dimensiones y formatos explícitos. No aceptar panoramas ni PDFs en este cálculo.
4. Mostrar miniaturas y cargar imágenes diferidas; una sola versión responsive en el piloto; medir bytes servidos por página. Optimizar herramientas OSS locales, no subir el original si no se necesita.
5. Poner paginación y límite de fichas por consulta; restringir abusos por IP/cuenta, validar coordenadas y evitar consultas de toda la colección.
6. Mantener formulario de búsqueda utilizable en lista si proveedor de mapa no responde; no hacer geocodificación automática por cada tecla.
7. Registro humano de uso y corte preventivo antes de cuota. Si el servicio suspende, desactivar nuevas publicaciones/cargas y mantener una página estática con canales de contacto previamente aprobados; nunca cambiar automáticamente a un plan pago.

## Seguridad mínima para un piloto, pendiente de diseño y pruebas

- Denegar por defecto. Un anunciante solo crea/lee/edita publicaciones y unidades propias. Verificar cada objeto y rol desde reglas/policies servidor, no confiar en ocultar controles UI.
- Roles administrativos asignados por proceso controlado, MFA para cuentas administrativas si el servicio lo ofrece sin cargos, mínimo privilegio y registro de moderación.
- Tokens de sesión con expiración/revocación; enlaces de verificación y reset de un uso, expiración corta y respuestas que no confirmen si un correo existe; límite por cuenta e IP.
- Secretos solo servidor. Carga firmada, comprobación real de MIME/magic bytes, tamaño/dimensiones, cuota por anunciante, eliminación de EXIF y revisión de derechos. Nunca subir identificaciones o datos de pago junto con fotos.
- No publicar domicilio exacto ni teléfono sin decisión de producto/privacidad. Minimizar coordenadas y datos almacenados, proteger exportaciones y definir retención/borrado.
- Mantener dependencias actualizadas, HTTPS, cabeceras adecuadas, CSP donde sea viable, inventario de secretos y respuesta manual a abuso/incidente.
- Copias independientes cifradas y ejercicio documentado de restauración. No considerar la disponibilidad del proveedor como recuperación.
- Probar permisos cruzados (IDOR), abuso de endpoints, reset, cargas maliciosas, límites, eliminación, logs y fallback antes de piloto real. No se ejecutaron estas pruebas porque no hay implementación/servicios autorizados.

Esto no es certificación de seguridad ni asesoría jurídica. El uso de datos personales, correos, proveedores internacionales y publicidad requiere revisión jurídica aplicable en Colombia antes de producción.

## Uso comercial, límites de términos y dependencias

| Servicio | Evidencia pública consultada | Dictamen conservador |
| --- | --- | --- |
| Firebase | Términos actualizados públicamente y permiten uso relacionado con negocio/profesión; Spark tiene cuotas y apagado al límite | Permiso general público compatible en principio. No prueba elegibilidad, jurisdicción, operación o configuración de cuenta Ubícate |
| Supabase | Términos permiten uso del servicio para fines internos del negocio; planes Free publicados | No se encontró prohibición comercial general. Límites de Free y usos exactos de cada componente/cuenta quedan por verificar |
| Cloudinary | FAQ permite Free en producción bajo allowance; ToU limita a apps/sitios propios y prohíbe revender servicio | Uso como servicio interno de fotos parece compatible, pero confirmar interpretación/condición de cuenta y tratamiento de datos |
| Brevo | Plan Free declara $0, correo transaccional y 300/día; la descripción dice que es para empezar/explorar | No puedo certificar uso transaccional de una plataforma comercial de terceros a partir de esa página. Requiere términos vigentes, alta y aprobación de cuenta, identidad de dominio y revisión de remitente |
| Backblaze B2 | 10 GB free y controles de caps publicados | Permiso, no tarjeta, caps que cortan consumo y recuperación de credenciales deben verificarse en cuenta. No usar condiciones de “Computer Backup” para inferir las de B2 |
| OpenFreeMap | No cobra ni publica cuota por vistas; términos permiten uso web, no SLA y pueden discontinuar | Sin cobro publicado, pero permiso concreto y continuidad no certificados. No tratar como infraestructura crítica |
| OSM/Nominatim | Datos ODbL/atribución y políticas explícitas para tiles/Nominatim | Software/datos libres no dan derecho a consumo sin límites de servidores comunitarios; respetar política o usar fuente propia |
| Firebase Storage | No se usa: documentación vigente requiere plan Blaze para crear/usar Cloud Storage for Firebase | Excluido de las candidatas sin facturación |
| Appwrite Cloud | Su documentación limita plan free como hobby/personal y desactiva uploads de archivos; backup/SMTP propios aparecen en niveles superiores | No encaja como backend gratuito comercial con medios; se descarta para esta comparación |

Todos los planes y términos pueden cambiar. La lectura pública no equivale a contrato de la cuenta ni revisión legal de la actividad de Ubícate. No se accedió a cuentas, cotizadores autenticados o pantallas de facturación.

## Migración y respuesta ante suspensión

| Servicio que falla/cambia | Respuesta de continuidad propuesta | Portabilidad y coste oculto |
| --- | --- | --- |
| Correo | Pausar registros/cambios sensibles; mantener sesiones existentes si seguridad lo permite; probar segundo proveedor solo tras aprobación | Plantillas, reputación y dominio requieren nueva configuración; el cambio puede implicar coste. No perder capacidad de reset segura |
| Mapas | Pasar a lista, sector/barrio y enlace externo; conservar coordenadas propias normalizadas y atribución | Geocodificador/tiles no son parte de MapLibre; mapas propios requieren generar/servir PMTiles, actualizarlos y asumir operación |
| Fotos | Conservar backup offline/independiente, IDs lógicos y metadata; bloquear nuevas cargas; luego migrar a otro object store o servir estático temporalmente | Transformaciones y URLs CDN no son portables; se deben reconstruir variantes y links. Verificar descarga masiva antes de escoger |
| Backend/datos | Export diario, manifest/checksums, migraciones SQL o JSON versionadas; página informativa estática mientras se restaura | Supabase Postgres migra a Postgres; Firestore exige conversión de documento/consultas y geohashes. Migración y QA requieren trabajo manual |
| Hosting | Artefacto de frontend versionado y build reproducible; cambiar DNS solo con decisión y configuración preparada | No se ha comprado dominio. El subdominio del proveedor no migra; un dominio propio puede tener costo anual inevitable si se decide usarlo |
| Cuentas | Exportar usuarios y probar importación periódicamente; conservar IDs o mapa de identidades | Hashes/algoritmos pueden limitar migración; forzar reset es posible solo con proceso seguro. No dar por hecho que contraseñas se migran |
| Free tier deja de ser gratuito | Congelar altas y publicar aviso de estado; presentar alternativa gratuita, riesgo y coste mínimo a dirección | No activar pago automático. Recuperar actividad requiere confirmar backup, permisos y autorización humana |

## Recomendación razonada

**No aprobar aún una arquitectura productiva USD 0.** Como referencia para validación técnica posterior, comparar A y B en un piloto pequeño de 200 anuncios usando el mismo patrón de fotos, registro/recuperación, consultas y ejercicios de restauración. A prioriza menor carga de integración y PostGIS; B prioriza email integrado, hosting con hard caps y una salida de factura explícita. B no es preferible por ser modular: Cloudinary y el firmador suman puntos de fallo y su allowance es insuficiente para 5.000 anuncios en el modelo. A también queda limitado antes de 1.000 por el almacenamiento integrado.

Para ambas opciones, la primera condición de viabilidad no es número de anuncios sino aprobar comercialidad de cuentas, confirmar correo de recuperación, demostrar restauración completa y probar controles contra acceso entre anunciantes. Si esas puertas no pasan sin facturación, presentar una alternativa gratuita viable, riesgo y coste mínimo para decisión humana. El tiempo operativo necesario para copias, moderación y respuesta a fallos debe estimarse por dirección.

### Aspectos que no pueden certificarse aún

- Contrato/permiso comercial y disponibilidad en Colombia de cada cuenta concreta, límites reales, facturación/cambio de plan y bloqueos por exceso.
- Verificación del dominio remitente, calidad de entrega, SPF/DKIM/DMARC y límites de cuenta Brevo o reputación Firebase.
- Configuración que impida cargos: medio de pago ausente, no activar Blaze, caps reales de B2 y ausencia de servicios complementarios que requieran billing.
- Capacidad real de backup y restauración incluyendo usuarios, credenciales, datos, reglas, archivos, índices y secretos sin exposición.
- Cobertura, precisión, rendimiento y atribución práctica de mapa en Tunja.
- Tamaño de bundles, tasa de consultas, bytes de fotos servidos, picos de correo, seguridad de reglas y objetivo RPO/RTO.
- Cumplimiento legal de datos personales, publicidad, geolocalización, consentimiento y almacenamiento/procesamiento fuera de Colombia.
- Costos de operación humana, disponibilidad, soporte y recuperación con equipo asignado.

## Tareas que requieren autorización posterior

No hacerlas en F00-H04 sin aprobación específica:

1. Crear cuentas Firebase, Supabase, Cloudinary, Brevo u Backblaze, aceptar términos o verificar dominios.
2. Activar productos, proyectos, llaves, remitentes, funciones, límites, facturación, tarjetas, DNS, mapas, almacenamiento o proveedores externos.
3. Ingresar medios de pago, habilitar Blaze/planes pagos, enviar correo externo, desplegar, alojar datos reales o transferir archivos.
4. Ejecutar restauración en un proyecto/servicio de prueba o subir datos personales, aun si las cuotas publicadas son gratuitas.
5. Seleccionar arquitectura, stack, proveedor, estrategia de seguridad, retención, SLA, RPO/RTO o política económica definitiva.

La siguiente tarea corresponde a F01-H00: que dirección defina o ratifique el escenario piloto, capacidad operativa y objetivos de recuperación antes de pruebas técnicas. Las pruebas con datos sintéticos pueden prepararse localmente según el spec; crear cuentas o activar servicios requiere autorización explícita. F00-H04 fue cerrado el 2026-10-16.

## Fuentes oficiales consultadas el 2026-10-16

- Firebase: [términos](https://firebase.google.com/terms), [planes y facturación](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans), [cuotas de Auth](https://firebase.google.com/docs/auth/limits), [precios Firestore](https://firebase.google.com/docs/firestore/pricing), [cuotas Hosting](https://firebase.google.com/docs/hosting/usage-quotas-pricing), [exportar/importar Firestore](https://firebase.google.com/docs/firestore/manage-data/export-import), [Storage FAQ](https://firebase.google.com/docs/storage/faq-and-troubleshooting), [CLI Auth](https://firebase.google.com/docs/cli/auth), [Cloud Functions requieren Blaze](https://firebase.google.com/docs/functions/faq-and-troubleshooting).
- Supabase: [términos](https://supabase.com/terms), [control de costos](https://supabase.com/docs/guides/platform/cost-control), [egreso](https://supabase.com/docs/guides/platform/manage-your-usage/egress), [cuota Edge Functions](https://supabase.com/docs/guides/functions/pricing), [SMTP Auth](https://supabase.com/docs/guides/auth/auth-smtp), [backups](https://supabase.com/docs/guides/platform/backups), [pg_dump y RLS](https://supabase.com/docs/guides/troubleshooting/pg_dump-fails-with-query-would-be-affected-by-row-level-security-policy).
- Cloudinary: [FAQ del plan gratuito](https://cloudinary.com/documentation/developer_onboarding_faq_free), [planes y créditos](https://cloudinary.com/documentation/billing_and_plans), [comparación de planes](https://cloudinary.com/pricing/compare-plans), [términos](https://cloudinary.com/tou).
- Brevo: [planes](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans), [límites del Free](https://help.brevo.com/hc/en-us/articles/208580669-FAQs-What-are-the-limits-of-the-Free-plan).
- Backblaze: [precios B2](https://www.backblaze.com/cloud-storage/pricing), [caps y alertas](https://www.backblaze.com/docs/en/cloud-storage-data-caps-and-alerts), [términos](https://www.backblaze.com/company/policy/terms-of-service).
- Mapas/datos: [OpenFreeMap](https://openfreemap.org/), [términos OpenFreeMap](https://openfreemap.org/tos/), [licencia OSM](https://www.openstreetmap.org/copyright), [política Nominatim](https://operations.osmfoundation.org/policies/nominatim/), [MapLibre](https://github.com/maplibre/maplibre-gl-js/blob/main/LICENSE.txt).
- Alternativas evaluadas: [Appwrite free tier](https://appwrite.io/docs/advanced/billing/free), [Firebase Storage FAQ](https://firebase.google.com/docs/storage/faq-and-troubleshooting).
- Seguridad: [OWASP Authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [OWASP File Upload](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).
