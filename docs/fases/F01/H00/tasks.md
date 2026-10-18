# Propuesta de tasks: F01-H00

**Estado vigente, 2026-10-17:** hito abierto. La evaluación documental/local y las pruebas esenciales PostgreSQL/PostGIS/RLS y Auth/JWT/Data API/RLS A/B fueron ejecutadas y documentadas. AC-05 avanzó con una PoC local de compresión, pero Storage y autorización de imágenes siguen pendientes. La selección de arquitectura, el restore integral y el cierre requieren sus puertas pendientes y decisión humana.

## Entrada y diseño

- [x] Ratificar nombre F01-H00, objetivo y límites de la evaluación, sin autorizar selección o implementación.
- [x] Aplicar la política económica aprobada y definir el registro comparativo de infraestructura, dominio, energía, equipo, operación humana y recuperación en `evaluacion.md`; valores sin evidencia quedan como no determinados, no cero.
- [x] Ratificar escenario de referencia de 200 alojamientos, cinco fotos de hasta 250 KB, RPO/RTO de 24 horas, retención de 7 diarias y 4 semanales, y dirección como responsable operativo con apoyo de Codex. El presupuesto adicional es USD 0.
- [ ] Aprobar disponibilidad objetivo y límites operativos de piloto.
- [x] Definir método/casos sintéticos para sectores de Tunja y tratamiento de ubicación en `protocolo-pruebas-tecnicas.md`; la validación de sectores/precisión reales por dirección sigue pendiente.
- [ ] Aprobar matriz ponderada y puertas no compensables.
- [ ] Autorizar específicamente cuentas/servicios que serían creados o probados.

## Evaluación local y documental

- [x] Inventariar a nivel documental candidatas OSS, servicios propietarios, obligaciones conocidas y proceso de salida para A/B/autohospedaje; confirmar en cuentas/contratos queda pendiente.
- [x] Reproducir localmente el modelo de consumo de imágenes, tráfico y lecturas para los escenarios documentados; medición técnica de queries geográficas sigue pendiente.
- [x] Definir fixtures sintéticos sin datos personales para propiedades multiunidad, anunciantes y búsquedas radiales de prueba en Tunja (`fixtures-tunja.json`).
- [x] Preparar y ejecutar verificación local estándar de IDs, coordenadas sintéticas y consultas radiales de fixtures (`verificar_fixtures.py`).
- [x] Preparar protocolo de PostGIS, autorización, fotos, autenticación, recuperación, exportación/restauración, cuotas y contingencia; las pruebas de servicios reales están pendientes.
- [x] Reutilizar la revisión fechada de términos públicos en F00-H04; validar cuenta/contrato aplicable sigue pendiente.

## Pruebas acotadas

- [x] Verificar el MCP aislado `supabase_ubicate` y consultar tablas `public` y extensiones en modo de solo lectura; registrar resultados en `protocolo-pruebas-tecnicas.md`.
- [x] Preparar, revisar estáticamente y ejecutar bajo autorización específica la migración aislada PostgreSQL/PostGIS + RLS, fixtures ficticios, búsquedas de radio y casos negativos. La suite PostgreSQL real fue confirmada por dirección y está documentada en `poc-postgis-rls/README.md`; no repetirla.
- [x] Obtener autorización específica y ejecutar la PoC aislada en `ivzjijagahkczdghoqkz`: respaldo previo, migración, fixtures y suite RLS/geoespacial. Resultado SQL confirmado por dirección; evidencia y límites en `poc-postgis-rls/README.md`. No repetir.
- [x] Resolver el preflight condicionado del 2026-10-16: se generó y verificó respaldo externo, se prepararon clientes portátiles PostgreSQL 17.11, se corrigió la comprobación del helper privado y se completó la PoC aprobada. Las notas siguientes en `poc-postgis-rls/README.md` son históricas.
- [x] Revisar resultados y riesgos residuales de la PoC SQL. No se requiere limpieza para preservar evidencia; cualquier eliminación remota requeriría autorización destructiva separada.
- [x] Verificar localmente la integridad del log y por lectura los datos persistentes después de la suite; recuentos, títulos, precios, estados, RLS y helper se registran en `poc-postgis-rls/README.md`. No repetir la suite.
- [x] Auth/JWT/Data API/RLS: verificar anonimato, lectura propia, aislamiento cruzado, modificación temporal autorizada y reversión con A/B; evidencia en `poc-auth-data-api-rls/README.md`. No repetir estos casos esenciales.
- [ ] Auth/sesión extendida: evaluar expiración/reuso, refresh, administración y abuso/rate limit según alcance y umbrales aprobados. Las pruebas de correo real quedan diferidas fuera de F01-H00.
- [x] Confirmación/recuperación por correo: diferidas fuera de F01-H00 por decisión de dirección del 2026-10-16; validar antes de operar con usuarios reales. No son bloqueo para continuar la comparación arquitectónica.
- [x] Permisos esenciales de anunciantes A/B: lectura propia, denegación anónima/cruzada y modificación propia temporal reversible, por Data API con JWT real; evidencia en `poc-auth-data-api-rls/README.md`.
- [ ] Permisos extendidos: DELETE, roles administrativos, Storage y casos no incluidos en la matriz esencial A/B.
- [ ] Backup: exportar datos, usuarios, roles, reglas, configuración, índices, metadata y fotos a destino independiente; checksum e inventario.
- [ ] Restore: recrear entorno limpio; verificar IDs, relaciones, conteos, hashes, policies, login y aislamiento; medir RPO/RTO contra metas aprobadas.
- [ ] Fotos: MIME real, tamaño/dimensiones, máximo de archivos, miniatura, lazy load, entrega, permisos y borrado. La PoC local Canvas/JPEG/WebP, tamaños, tiempos, calidad y eliminación de EXIF/GPS sintéticos está documentada en `evaluacion.md`; no prueba carga a Storage ni autorización.
- [ ] Mapa: búsqueda por sectores y puntos acordados, precisión, lecturas y fallback lista con tiles/geocoder no disponibles.
- [ ] Cuotas: medir uso, alertas y comportamiento ante límite; no provocar sobreuso facturable ni habilitar billing.
- [ ] Indisponibilidad: simular respuestas 429/5xx/timeout del proveedor; evitar corrupción, fuga de datos o transición automática de plan.
- [ ] Cumplimiento: verificar permiso comercial, plan, sender/domain, región y obligaciones contractuales por servicio/cuenta.

## Análisis y cierre

- [x] Comparar escenarios modelados de 200/1.000/5.000 y preparar límites de piloto con supuestos trazables en `evaluacion.md`; mantener pendientes las mediciones reales y aprobación de límites.
- [ ] Puntuar A/B/autohospedaje aplicando puertas obligatorias cuando se aprueben la matriz y los umbrales; no asignar puntuaciones concluyentes antes de obtener evidencia pendiente.
- [x] Documentar riesgos, riesgos residuales, contingencia y migración inicial en `evaluacion.md`, `propuesta.md` y `poc-auth-data-api-rls/riesgos-decisiones.md`; actualizar tras nuevas pruebas.
- [x] Presentar recomendación provisional sin selección automática en `evaluacion.md`; actualizarla cuando se complete evidencia comparable.
- [ ] Obtener decisión humana y completar registro de arquitectura.
- [ ] Cerrar solo con aceptación humana; abrir implementación mediante otro hito.

## Resultado de ejecución inicial

Este registro describe la ejecución inicial. Estado vigente: la suite PostgreSQL/PostGIS/RLS fue confirmada con `ROLLBACK`; luego las pruebas esenciales Auth/JWT/Data API/RLS A/B pasaron con JWT reales, incluyendo lectura propia, aislamiento cruzado y modificación temporal reversible. No repetir estas pruebas. La PoC local de fotos Canvas/WebP/JPEG está registrada en `evaluacion.md`; AC-05 sigue parcial hasta probar validación integral, Storage, autorización, miniaturas, entrega y borrado. Continúan pendientes restore integral aislado, pruebas extendidas de sesión/admin, sectores y fallback de mapa, cuotas/resiliencia, condiciones de cuenta y decisión arquitectónica. Los envíos reales de correo están diferidos fuera de F01-H00.
