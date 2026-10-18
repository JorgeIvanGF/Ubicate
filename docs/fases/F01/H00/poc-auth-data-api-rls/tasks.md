# Tareas verificables: PoC Auth + Data API + RLS

**Estado actual, 2026-10-17:** el baseline y dos propiedades temporales Auth A/B se prepararon y verificaron por MCP. En la repetición posterior mediante formulario local, A y B autenticaron con HTTP 200; anonimato, lecturas propias, aislamiento cruzado y modificación temporal reversible pasaron. Ver resultados y límites en [README](README.md#repetición-authjwtrls-2026-10-17). F01-H00 sigue abierto por pendientes más amplios de evaluación. No se crearán usuarios admin ni se enviarán correos.

## Entender

- [x] Revisar instrucciones, spec/plan/tasks de F01-H00, criterios de aceptación del hito y documentos de la PoC RLS/PostGIS.
- [x] Verificar estado Git, cambios sin confirmar y bloqueo conocido de `.git/index.lock`.
- [x] Revisar documentos oficiales vigentes de Auth, SMTP, API keys, Data API grants/RLS, cuotas Free y PostGIS HTTP/RPC.
- [x] Detectar y corregir el resumen vigente de README PoC para reflejar la suite confirmada, preservando los apartados de preflight como historial.
- [x] Revisar las seis tablas PoC para comprobar el vínculo de sus claves de propiedad con UUID Auth; documentar que `advertisers.id` y `properties.owner_id` no tienen FK a `auth.users` y que el modelo usa IDs coincidentes como convención de prueba.

## Diseñar

- [x] Redactar spec, criterios de aceptación y matriz HTTP Auth positiva/negativa.
- [x] Diseñar enlace de UUID Auth sin alterar fixtures base.
- [x] Especificar diferencia entre fallo GRANT/columna, filtro RLS y error Auth/JWT.
- [x] Registrar límites de SMTP, claves, admin, privacidad, quotas y decisiones pendientes.
- [x] Documentar que el aprovisionamiento de administrador exige un canal confiable y que no hay RPC geoespacial HTTP aprobada.
- [x] Contrastar la matriz HTTP con grants/policies existentes; registrar la limitación de creación de estado por anunciantes y la denegación esperada de DELETE de property.
- [x] Revisión técnica local de la propuesta, la matriz y su coherencia con el SQL vigente.
- [x] Preflight remoto de solo lectura: proyecto Free correcto, estado PostGIS/RLS/helper/fixtures, exposición Data API, configuración visible de registro/confirmación de correo y Security Advisor.
- [x] Dirección autorizó habilitar temporalmente solo las seis tablas PoC en Data API, sin exponer `private`, alterar SQL/grants/RLS ni otros objetos; restaurar luego el estado inicial 0/6.
- [x] Ejecutar GET anónimos de solo lectura sobre los seis endpoints con clave publicable, sin alterar panel, grants o RLS; documentar permisos por endpoint, filas visibles y denegación de advertisers.
- [x] Corregir una consulta exploratoria que usó `id` en `publication_status` en vez de `property_id`; consulta válida posterior confirmó solo 2 estados publicados.
- [x] Confirmar con lectura MCP que `anon` tiene permisos por columna en campos públicos de properties/status y no SELECT sobre advertisers; panel 0/6 no representa por sí solo el comportamiento de cada endpoint.
- [x] Verificar que `private` sigue fuera de los esquemas Data API expuestos; no se guardaron cambios en Dashboard.
- [x] Revisar elegibilidad de correo y roles ofrecidos por el formulario de equipo; las direcciones no son miembros y no se ofrece rol de solo lectura. No enviar invitaciones con roles más amplios.
- [x] Registrar decisión de dirección: pruebas de entrega de confirmación y recuperación por correo quedan fuera de F01-H00; no se invitarán miembros ni se configurará SMTP para esta PoC.
- [x] Operador generó backup baseline EFS; esta ejecución revalidó SHA-256 y listado, y restauró las seis tablas/datos PoC en un contenedor local descartable con aislamiento de red. Ver `restauracion-respaldo.md`; no es una restauración íntegra de todos los esquemas gestionados por Supabase.
- [x] Registrar como histórico el intento del ejecutor PowerShell del 2026-10-17, que falló al ordenar por `id` inexistente en `publication_status` y no inició llamada privilegiada. La ruta vigente de validación RLS es la página temporal Chrome con clave pública y JWT de usuario; no usar el ejecutor con API Secret para estos casos.
- [ ] Separar una spec de RPC geoespacial HTTP y revisar su contrato/grants, si dirección autoriza.

## Implementación de harness futura

- [ ] Confirmar método de prueba HTTP sin dependencias nuevas o solicitar aprobación específica de herramientas.
- [ ] Preparar captura de evidencia saneada fuera de Git y comprobar redacción de credenciales/tokens.
- [x] Revalidar URL, ref, plan, exposición de esquemas/tablas y grants básicos; la configuración Auth/redirect de cuenta queda para el preflight previo a ejecución.
- [x] Operador generó backup previo protegido y baseline de filas/relaciones; el manifiesto reporta verificación del listado, no restauración. Codex corroboró los fixtures mediante MCP de solo lectura.

## Pruebas externas, con autorización condicional A/B

- [x] Verificar que las identidades Auth A/B ya existen; no crear usuarios ni enviar correo. La lectura confirmó ambos UUID.
- [x] Asociar UUID Auth A/B con dos filas paralelas temporales y estados draft; baseline releyó los seis objetos PoC. No se alteraron los tres inmuebles ni los cuatro anunciantes existentes.
- [ ] Ejecutar casos de sesión/JWT sin envío de correo únicamente con identidad y autorización apropiadas; requisito bloqueado por autorización, no por una decisión sobre el correo.
- [x] Confirmación y recuperación por email diferidas fuera de F01-H00 por decisión de dirección; conservar como requisito previo a usuarios reales.
- [ ] Ejecutar los casos HTTP de la matriz con clave publicable más bearer JWT real; nunca secret en cliente.
- [ ] Verificar grants, RLS, contenido HTTP, no enumeración, roles A/B/admin, campos privados y cambios persistentes.
- [ ] Ejecutar geospatial HTTP únicamente si RPC recibe aprobación separada.
- [ ] Comparar baseline y registrar Security Advisor; parar ante diferencia, error de seguridad, cuota, gasto o servicio no aprobado.
- [ ] Limpiar filas/usuarios temporales únicamente con autorización destructiva explícita y verificar la limpieza.

## Restauración local y preparación de ejecución, 2026-10-16

- Se verificó el dump EFS desde el proceso autorizado: tamaño 639.718 bytes, SHA-256 coincidente y `pg_restore --list` 17.11 con 1.393 entradas.
- Se restauraron en Docker aislado las seis tablas, datos, índices y constraints de la PoC con código 0. La imagen fue PostgreSQL 17.5/PostGIS 3.5.2, por lo que no valida igualdad de parches/extensiones ni recuperación integral del stack Supabase.
- El contenedor no tenía red, puertos ni almacenamiento persistente. Se retiraron el contenedor y el tag de imagen al completar la comprobación.
- Se preparó el ejecutor A/B. Su sintaxis PowerShell 7 se verificó. No almacena el secreto; compara baseline de tablas y usuarios, crea usuarios `.invalid` confirmados sin correo, hace peticiones con JWT de usuario, limpia por UUID creados y verifica el baseline.
- El Dashboard muestra diez usuarios estimados. El inventario API se obtendrá antes de cualquier escritura; el script abortará si hay colisión con las direcciones sintéticas o si el inventario cambia durante limpieza.
- La acción pendiente, antes de abrir PowerShell, es desactivar la clave legacy comprometida desde Settings > API Keys del proyecto. Después, ejecutar el script actualizado en PowerShell 7 visible e ingresar la clave publicable actual y la API Secret `sb_secret_` mediante prompts ocultos. No compartir credenciales ni el contenido completo del log.

## Analizar y continuar

- [ ] Marcar por cada prueba PASS/FAIL/BLOCKED/NOT RUN con evidencia reproducible.
- [ ] Confirmar si autenticación real satisface los criterios de F01-H00; documentar limitaciones/residuales.
- [ ] Comparar A/B/autohospedaje, sin preferir Supabase por esta PoC.
- [ ] Presentar recomendación arquitectónica y decisiones de dirección; mantener H00 abierto hasta aprobación formal.

### Actualización de ejecución MCP, 2026-10-17

La creación de filas temporales A/B autorizada quedó completada con supabase_ubicate. Quedan pendientes las pruebas de sesión y Data API que requieran bearer JWT, las comprobaciones cruzadas de RLS y cualquier limpieza destructiva. No interpretar la lectura administrativa como aprobación de esas pruebas.

### Validación Chrome DevTools MCP, 2026-10-17

- [x] Revisar documentación canónica y alcance autorizado para la prueba.
- [x] Confirmar disponibilidad de Chrome DevTools MCP; solo había `about:blank`.
- [x] La clave `sb_publishable_` se introdujo manualmente en el formulario local. Ninguna clave se pidió por chat ni se registró en evidencia.
- [x] Preparar, servir y comprobar página efímera local sin dependencias, sin almacenamiento persistente de sesión y con limpieza de campos al ejecutar.
- [x] Intentar login A/B desde el formulario; Auth devolvió HTTP 400 en ambos casos y el sanitizador no conservó el código específico. No se obtuvieron JWT.
- [x] Ejecutar GET anónimos de propiedades y estados A/B; todos respondieron HTTP 200 con cero filas.
- [ ] Completar lecturas propias A/B, lecturas y escrituras cruzadas, modificación propia reversible y relecturas finales cuando el login Auth funcione.
- [x] Documentar respuestas saneadas y distinguir el error Auth de fallos de permiso. Las operaciones dependientes de JWT se registran `BLOCKED/NOT RUN`.
- [ ] Completar evaluación de seguridad F01-H00 antes de proponer el cierre. La transición a la experiencia de búsqueda queda preparada en el README como propuesta posterior, no autoriza selección de arquitectura o implementación productiva.

Ejecución posterior el 2026-10-17: los dos GET anónimos se ejecutaron y devolvieron HTTP 200 con cero filas. La clave y contraseñas se introdujeron solo en el formulario local. Auth devolvió HTTP 400 para A y B; no se obtuvo JWT. Los demás casos no se ejecutaron. La lectura MCP de claves había sido bloqueada previamente, pero dirección resolvió ese obstáculo al proporcionar la clave manualmente en el navegador. Ver el resultado saneado en README.

### Repetición Auth/JWT/RLS, 2026-10-17

- [x] Regenerar página temporal mínima, verificar sintaxis JavaScript (`node --check`) y comprobar HTTP 200 desde localhost enlazado a `127.0.0.1`.
- [x] Recibir clave y contraseñas únicamente mediante entrada manual del operador en el formulario local; no hubo reintentos adicionales.
- [x] Confirmar login A/B, ambos HTTP 200, sin exponer JWT.
- [x] Verificar anonimato, lecturas propias, lecturas/escrituras cruzadas y modificación/reversión con contenido y relecturas, no solo status HTTP.
- [x] Confirmar títulos originales de ambas propiedades temporales al final. No se tocaron filas originales ni anunciantes.
- [x] Consultar solo texto saneado de resultados en Chrome DevTools; no se leyeron campos, Console, Network, tokens o cabeceras.
- [x] Documentar resultados y límites en README. No se modificaron seguridad, Auth, esquema ni permisos.
- [ ] Completar evaluación de seguridad F01-H00 y obtener decisión de arquitectura antes de cerrar el hito o iniciar implementación de búsqueda.
