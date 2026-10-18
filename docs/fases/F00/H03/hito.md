# F00-H03: Preparación del repositorio y diseño UX/UI inicial

## Propósito

Dejar lista la base documental y la configuración local de Codex, establecer la política de autonomía supervisada e iniciar el diseño UX/UI con alternativas de prototipo locales. Este hito no implementa la aplicación de producción.

## Flujo del hito

1. **Spec:** preparación documental, configuración ECC local, política de autonomía y diseño inicial mediante prototipos con datos ficticios; decisiones pendientes claramente señaladas.
2. **Plan:** revisar el repositorio y el catálogo ECC; definir tareas verificables; preparar documentos y prototipos locales; comprobar visualización, controles y accesibilidad básica; registrar evidencia.
3. **Tasks:** auditar documentos; añadir política; preparar dos alternativas UX/UI; revisar interacción, responsive y accesibilidad; actualizar evidencias.
4. **Implementación:** completada para el alcance autorizado, incluyendo documentos, política y prototipo estático local.
5. **Pruebas y verificaciones:** verificaciones de Git, configuración, `.gitignore`, interacción, responsive y accesibilidad ejecutadas. Los métodos y resultados están en [verificacion-ux.md](prototipo/evidencias/verificacion-ux.md) y las capturas en [evidencias](prototipo/evidencias/).
6. **Análisis:** la revisión encontró que faltaba política explícita de autonomía. No se encontró contradicción material entre el contexto acordado y las propuestas pendientes.
7. **Documentación:** completada en este archivo, `docs/direccion/` y el README del prototipo, con resumen y evidencia verificable.
8. **Cierre:** aprobado por dirección de producto el 2026-10-16; el registro de cierre al final de este documento es el estado vigente. Las menciones anteriores a revisión pendiente son historia de iteraciones previas.

## Alcance

- Configurar ECC para este proyecto mediante `.codex/config.toml`.
- Establecer instrucciones de trabajo en `AGENTS.md` y orientación inicial en `README.md`.
- Registrar exclusiones generales apropiadas para un futuro proyecto web, sin elegir framework.
- Organizar la documentación de dirección y de este hito.
- Mantener explícita la separación entre contexto de producto acordado y decisiones pendientes.
- Definir una política de autonomía supervisada que respete los controles del entorno.
- Preparar alternativas visuales locales con datos ficticios, sin dependencias o servicios externos.

## Criterios de cierre

- La configuración del proyecto habilita el plugin ECC sin duplicar secciones.
- La documentación describe el propósito, el alcance previsto y los límites de decisión.
- Las decisiones técnicas pendientes no se presentan como aprobadas.
- Se presentan y comparan tres direcciones de prototipo, todas claramente marcadas como propuestas no aprobadas.
- El prototipo local usa datos ficticios, no depende de backend ni integra servicios externos.
- Se comprueban los tamaños móvil y escritorio, la búsqueda, los estados de resultados y la navegación por teclado; se registran resultados y límites.
- No se instala dependencias ni hooks, ni se crea base de datos o aplicación de producción.

## Criterios de aceptación UX/UI

- **AC-001, alternativas:** al elegir Patio, Nido o Ubícate, el prototipo cambia paleta y orden del mapa/resultados y comunica cuál alternativa está seleccionada; la interfaz aclara que ninguna está aprobada. Verificación: cambio por ratón y teclado y revisión renderizada de cada propuesta.
- **AC-002, búsqueda ficticia:** al filtrar por texto, precio o tipo y pulsar Buscar, solo aparecen los ejemplos coincidentes; una búsqueda sin coincidencias muestra un estado vacío y el mapa oculta pines no aplicables. Verificación: búsqueda con un resultado y búsqueda vacía.
- **AC-003, responsive:** a 390 × 844 y 1440 × 1000 la página no presenta desbordamiento horizontal y conserva accesibles la búsqueda, las fichas y el mapa. Verificación: navegador emulado y captura por alternativa y tamaño.
- **AC-004, accesibilidad básica:** etiquetas de campos asociadas, nombres accesibles para controles, semántica y títulos jerárquicos, foco visible, soporte de movimiento reducido y controles de al menos 40 px de alto. Verificación: árbol de accesibilidad, navegación con teclado e inspección de medidas/contrastes.
- **AC-005, aislamiento local:** ningún anuncio se presenta como real y la página no descarga fuentes, imágenes o datos externos. Verificación: inspección de etiquetas y solicitudes de red del navegador.

## Diseño UX/UI: dirección inicial

La experiencia se orienta a buscar alojamientos en un mapa y comparar fichas con información relevante. Debe funcionar en celulares y computadores y tener una apariencia contemporánea, fresca, intuitiva y dinámica. Se consideran fotografías convencionales y panorámicas 360° opcionales, inicialmente una por habitación.

Estos lineamientos son contexto inicial, no un diseño aprobado. Las alternativas de prototipo de este hito son exploratorias y no seleccionan identidad gráfica, paleta o sistema visual definitivo. La búsqueda y el mapa son representaciones locales, no una integración real.

Consulta el [prototipo estático](prototipo/index.html), sus [instrucciones](prototipo/README.md) y la [verificación UX/UI](prototipo/evidencias/verificacion-ux.md).

## Avance de tareas

- [x] Auditar README, instrucciones, configuración y documentos del hito.
- [x] Confirmar las once skills ECC nombradas en el paquete instalado y contrastarlas con las skills visibles en la sesión.
- [x] Añadir la política de autonomía supervisada y enlazarla desde `AGENTS.md` y el README.
- [x] Preparar dos alternativas UX/UI en un prototipo estático local.
- [x] Verificar búsqueda filtrada y estado vacío; comprobar cambio de alternativa y navegación con teclado.
- [x] Revisar en escritorio y móvil, estructura semántica, accesibilidad básica, solicitudes externas y consola del navegador.
- [x] Guardar capturas y resumen de verificaciones en `prototipo/evidencias/`.
- [x] Recibir y registrar aceptación humana del recorrido público y de la dirección visual D-UX-004, 2026-10-16.

## Catálogo y uso de skills ECC

Los once slugs solicitados aparecen en el catálogo ECC v2.2.3 y están disponibles en esta sesión: `agentic-engineering`, `intent-driven-development`, `continuous-agent-loop`, `team-agent-orchestration`, `frontend-design-direction`, `design-system`, `make-interfaces-feel-better`, `frontend-a11y`, `verification-loop`, `living-docs-governance` y `architecture-decision-records`.

Se usaron `agentic-engineering` para descomponer el trabajo y definir verificaciones; `intent-driven-development` para los criterios AC-001 a AC-005; `continuous-agent-loop` para limitar y revisar iteraciones; `team-agent-orchestration` para dos revisiones independientes de solo lectura; `frontend-design-direction` para el contrato visual y las capturas; `design-system` para variables CSS y coherencia de cada alternativa; `make-interfaces-feel-better` para jerarquía, foco y objetivos táctiles; `frontend-a11y` para semántica, etiquetas y teclado; y `living-docs-governance` para mantener la política en un documento canónico enlazado desde `AGENTS.md`.

Se evaluaron, pero no se ejecutaron, `verification-loop` y `architecture-decision-records`. El primero propone fases de build, tipos, lint y cobertura que no existen en este prototipo sin stack; se verificó en navegador y Lighthouse en su lugar. El segundo no aplica porque no se tomó una decisión de arquitectura y no se solicitó iniciar un registro ADR.

## Próximo paso

Revisar las alternativas del prototipo, elegir si alguna dirección debe continuar o combinarse y validar los flujos prioritarios. La selección de diseño queda en manos de dirección de producto. La arquitectura, el stack, los servicios externos, seguridad y despliegue siguen sujetos a aprobación humana.

## Revisión y cierre

Este hito queda presentado para revisión. No se considera cerrado hasta que se revise y apruebe su resultado.


## Evolución cromática 03: Ubícate

Se añadió una tercera alternativa que integra la paleta azul, turquesa y lima con la organización mobile-first de Nido. La implementación, las pruebas, las capturas, los tokens y la separación de decisiones aprobadas y pendientes están documentadas en [la iteración de verificación UX](prototipo/evidencias/verificacion-ux.md) y en [la dirección 03](prototipo/direccion-03-ubicate.md). Patio y Nido se conservaron. La elección visual y el cierre de F00-H03 siguen pendientes de revisión humana.

## Iteración cromática 02 de Ubícate

Se mantuvo la estructura de la Propuesta 03 y se incorporó más turquesa y lima en branding, hero, mapa, chips, badges, ilustraciones y estados. Se prepararon tres variantes de logo en una página de comparación y archivos SVG separados. La interfaz, las capturas, los tokens y los contrastes están documentados en [dirección 03](prototipo/direccion-03-ubicate.md) y [verificación UX/UI](prototipo/evidencias/verificacion-ux.md). La revisión y selección visual humana siguen pendientes; este hito no se cierra.

## Continuación: consolidación de identidad y experiencia funcional, 2026-10-15

Esta sección actualiza el estado de las decisiones de diseño anteriores según la instrucción humana adjunta y separa expresamente identidad aprobada de experiencia pendiente. Las referencias a “marca pendiente” y “tres alternativas abiertas” arriba son el registro histórico de su momento y ya no describen la decisión vigente.

### Spec

Preparar una experiencia pública navegable de búsqueda y comparación de alojamientos para evaluación UX/UI local, y definir los recorridos funcionales de anunciante y administración. Mantener anuncios ficticios y sin autenticación, backend, persistencia ni servicios externos. Usar el PNG original aprobado sin transformarlo.

### Decisiones de esta continuación

- **Aprobado:** logotipo proporcionado (`logotipo_ubícate_azul_y_turquesa.png`) y paleta `#185BE7`, `#35C7AE`, `#D7F46B`, `#F5F7FB`, texto `#17243A`. El recurso fuente está preservado en `prototipo/assets/identidad/` y se muestra directamente.
- **Aprobado como base de prototipo:** dirección estructural Ubícate 03, con patrón de búsqueda, mapa y lista. Patio, Nido y las variantes gráficas previas se mantienen como archivo de comparación, no como identidad pendiente.
- **Pendiente de revisión humana:** calidad de los flujos, detalle, composición responsive y componentes implementados. Este trabajo no aprueba de forma automática la experiencia funcional ni cierra H03.
- **No decidido:** arquitectura/stack futuros, autenticación/seguridad, almacenamiento, cartografía, contactos y otros proveedores, despliegue, reglas comerciales y requisitos de moderación en producción.

### Plan

1. **Entender:** auditar el prototipo, documentos vigentes, recursos disponibles y permisos del encargo.
2. **Diseñar:** concretar criterios de búsqueda, detalle, estados y recorridos por rol; mapear identidad aprobada a tokens con contraste legible.
3. **Implementar:** ampliar únicamente el prototipo local en tecnologías existentes.
4. **Probar:** revisar controles, estados, teclado, dimensiones móvil/escritorio, consola, vínculos y contraste.
5. **Analizar:** documentar limitaciones de recursos y defectos detectados y corregirlos dentro del límite de tres iteraciones.
6. **Documentar:** actualizar este hito, dirección, tokens, evidencia y README del prototipo.
7. **Continuar:** esperar revisión humana de la experiencia. No cerrar con criterios pendientes.

### Criterios de aceptación de esta continuación

- **AC-006 Búsqueda y mapa:** filtros por texto, presupuesto y tipo; mapa y lista vinculados en ambas direcciones; navegación móvil directa a mapa/lista; estado vacío y estado de error accesibles.
- **AC-007 Detalle:** desde una ficha se abre un detalle con precio/periodo, características, condiciones, disponibilidad, ubicación aproximada, contacto simulado y entrada al estado de 360°. Los datos no se presentan como reales.
- **AC-008 Inmueble y unidades:** el ejemplo incluye al menos un inmueble con dos unidades diferenciadas.
- **AC-009 360°:** acceso explica que no hay panoramas cargados; ninguna imagen normal se representa como panorama. Una experiencia navegable con recurso real queda pendiente.
- **AC-010 Anunciante:** el flujo se documenta desde creación de inmueble/unidades y publicación, hasta carga de fotografías, disponibilidad y revisión del estado.
- **AC-011 Administración:** el flujo se documenta para revisar publicaciones, atender reportes y consultar actividad; no se simula autorización, seguridad o backend real.
- **AC-012 Marca y accesibilidad:** el PNG original se usa directamente; tokens mantienen contraste de texto, foco visible, controles táctiles y layout sin desborde en móvil/escritorio.
- **AC-013 Evidencia:** capturas de 390 px y 1440 px; pruebas con resultados, consola y limitaciones documentadas.

**Recursos de demostración para AC-007 y AC-009:** no se entregaron fotos de alojamientos ni panoramas. Las ilustraciones se identifican como conceptuales; el estado 360° informa que el recurso no está disponible. Esto permite revisar navegación, contenido y estados con alojamientos ficticios. El visor real queda especificado como trabajo posterior y no es condición de aceptación de este prototipo.

### Recorridos funcionales propuestos

Los pasos para anunciante y administración son propuestas funcionales para revisión, no autorizan implementación productiva ni deciden controles de seguridad. Se detallan más abajo.

#### Anunciante

1. Elegir “Publicar alojamiento” e ingresar información de contacto dentro de una futura experiencia autenticada, decisión de seguridad todavía pendiente.
2. Crear un inmueble con ubicación aproximada, datos generales y condiciones.
3. Añadir una o más unidades alquilables con precio, periodo, características y disponibilidad propias.
4. Adjuntar fotos por inmueble/unidad y, opcionalmente, una panorámica 360° por habitación.
5. Revisar una vista previa y enviar la publicación.
6. Consultar estado de revisión, corregir información solicitada y actualizar disponibilidad.
7. Revisar opciones de publicación/planes; los precios, cobro, contrato y reglas comerciales siguen pendientes.

#### Administración

1. Consultar la cola de anuncios nuevos o modificados.
2. Abrir inmueble y unidades para revisar información, medios, ubicación aproximada y cumplimiento de criterios editoriales aún por definir.
3. Aprobar, pedir cambios o rechazar con motivo trazable.
4. Recibir reportes de usuarios, revisar evidencia y registrar resultado.
5. Consultar historial de decisiones, publicaciones y métricas operativas.

La identidad, permisos de rol, protección de medios/datos, retención, auditoría, apelaciones y medidas antifraude requieren diseño de seguridad y aprobación humana antes de una implementación. Nada de ello se simula como ya resuelto.

### Tareas de esta continuación

- [x] Auditar prototipo y documentos frente al encargo adjunto.
- [x] Registrar en dirección las decisiones de identidad aprobadas y las decisiones estratégicas pendientes.
- [x] Integrar el PNG fuente sin vectorización y conservar las exploraciones anteriores como archivo.
- [x] Implementar interacciones locales de búsqueda, mapa/lista y detalle, además de estados vacíos, error y 360° no disponible.
- [x] Documentar recorridos de anunciante y administración y sus límites de decisión.
- [x] Verificar visualmente el prototipo en 390 px y 1440 px, consola, ancho, interacciones y contraste de controles.
- [x] Corregir problemas hallados en verificaciones y guardar nuevas capturas comparables.
- [ ] Revisión humana del recorrido público de búsqueda a contacto simulado.

### Estado de cierre histórico

En las iteraciones previas H03 permaneció abierto mientras esperaba aceptación humana. La decisión vigente está en la sección “Cierre aprobado, 2026-10-16”, al final del documento. Los datos ficticios e ilustraciones rotuladas permiten revisar el funcionamiento sin propiedades reales. Un visor 360° genuino pertenece a una fase posterior y requiere un recurso panorámico real.

### Preparación de aceptación funcional, 2026-10-15

El commit `3e8584e` fue comprobado en `main`; al iniciar esta preparación el árbol estaba limpio. Se corrigieron tres puntos observados durante la prueba móvil: el desplazamiento de “Mapa” y “Lista” deja el título fuera de la barra fija; la confirmación de contacto era invisible visualmente; y una ficha enfocada no tenía una acción de mapa coherente por teclado. Los títulos ahora reservan espacio bajo la barra, el contacto muestra confirmación y la acción “Mostrar en el mapa” es operable por teclado, mantiene el foco en el marcador correspondiente y lleva al mapa en móvil.

Las comprobaciones de aceptación y sus resultados reales están documentados en [la guía funcional](guia-aceptacion-funcional.md) y [la evidencia UX](prototipo/evidencias/verificacion-ux.md). La guía registra la URL local y los pasos de revisión; las capturas son [móvil 390 × 844](prototipo/evidencias/aceptacion-funcional-390x844.jpg) y [escritorio 1440 × 1000](prototipo/evidencias/aceptacion-funcional-1440x1000.jpg). La aceptación del director de producto sigue siendo el único bloqueo actual para cerrar el hito.

### Continuación D-UX-003: vida estudiantil y espacios compartidos, 2026-10-15

**Spec:** complementar Ubícate 03 con fotografías humanas de estudio y convivencia desde el inicio; conservar búsqueda/mapa como objetivo principal, identidad aprobada intacta, y distinguir fotos editoriales de medios de propiedad.

**Plan y tareas:** hero compacto con dos fotos editoriales antes del buscador, avisos y créditos visibles; eliminar ilustraciones editoriales anteriores; mantener detalle con atributos por habitación y espacios comunes por inmueble; documentar procedencia y restricciones; revisar legibilidad, interacción, carga, rendimiento razonable y responsive. Las dos imágenes se identifican como editoriales, no como fotos de anuncios ni aval de Ubícate.

**Criterios incrementales:** AC-014, búsqueda permanece cerca del inicio y el mapa tiene acceso rápido; AC-015, las fotos editoriales se distinguen de imágenes de anuncios y no sugieren respaldo de las personas; AC-016, detalle distingue habitación y espacios comunes usando solo datos ficticios existentes; AC-017, no cambia logotipo ni paleta; AC-018, se documentan autor, fuente, licencia, restricciones y comprobaciones. Las verificaciones técnicas pasan, pero esta composición espera aceptación visual humana y no cierra H03.

### Continuación D-UX-004: rediseño aspiracional del hero, 2026-10-15

**Spec:** dar más fuerza emocional al comienzo con una fotografía de vida estudiantil dominante y el buscador visualmente unido al hero, manteniendo mapa, flujos, logo y paleta aprobados. Las fotos deben conservar atribución y separación entre contenido editorial y anuncios.

**Plan:** auditar el hero, sus créditos y los breakpoints; usar la foto de estudio como imagen principal y la de cocina como apoyo; integrar la búsqueda y mantener el CTA al mapa.

**Tasks:** ajustar la jerarquía y altura en móvil, tableta y escritorio; verificar créditos y diferenciación editorial; probar enlaces, filtros, detalle, contacto simulado, consola y cuatro anchos; actualizar capturas y documentos canónicos.

**Implementación:** se modificaron el marcado del hero y sus reglas CSS. No se cambiaron tokens, logo, paleta, dependencias, stack ni flujo debajo del hero.

**Pruebas:** el formulario completo quedó dentro del primer viewport móvil, sin desbordamiento en los cuatro tamaños. Búsqueda, filtro compartido, selección mapa/ficha, detalle y contacto simulado respondieron. Las capturas comparables y el resto de comprobaciones están en `prototipo/evidencias/` y `prototipo/evidencias/verificacion-ux.md`.

**Análisis:** la primera inspección mostró colisión de créditos/aviso y un desborde subpíxel en el sangrado del hero. Se reubicó el aviso, se movió el crédito a una zona despejada y se emparejaron los márgenes con los breakpoints del contenedor.

**Documentación:** se actualizó esta sección, la dirección visual, el README del prototipo, la evidencia UX y `design-evidence.json`.

**Continuar:** presentar el hero para valoración visual humana. H03 no se cierra antes de la aceptación del director del producto.

**Criterios incrementales:** AC-019, el hero comunica búsqueda de vivienda en Tunja con foto dominante, mensaje breve y acceso a mapa; AC-020, el panel conserva filtros y queda unido visualmente al hero sin romper los recorridos; AC-021, cada foto conserva rótulo editorial/crédito y el aviso niega representación o aval, sin usarlas como fotos de anuncios; AC-022, no hay desbordamiento horizontal en 320, 390, 768 y 1440 px y el formulario completo queda en la primera vista móvil. Los criterios técnicos se verificaron y documentaron; AC-019 requiere valoración visual humana para aceptarse. H03 permanece abierto.

### Refinamiento final del hero D-UX-004, 2026-10-15

**Spec:** hacer el hero más limpio, cálido, aspiracional y humano, con menos elementos superpuestos. Mantener la búsqueda integrada, el mapa rápidamente accesible, el logo, la paleta y los flujos actuales. Las imágenes editoriales deben continuar diferenciadas de los anuncios.

**Plan y tasks:** conservar la composición y sustituir la foto principal por una fotografía cálida con fuente/licencia verificables; retirar capas secundarias no esenciales; reducir el peso visual del aviso y el crédito; comprobar cuatro anchos, legibilidad, navegación, enlaces y consola; actualizar evidencia y documentación.

**Implementación:** se usó como única imagen principal la fotografía existente “Men Cooking at Home” de Mizuno K / Pexels. Se eliminó la foto secundaria y las tarjetas de créditos sobre la foto; un crédito y aviso breves quedaron debajo del buscador. El gradiente se suavizó fuera del área del titular. No se modificaron identidad, tokens, controles o flujos. La fuente, autor, licencia y restricciones están en `prototipo/assets/vida-estudiantil/CREDITS.md`.

**Pruebas:** a 320 × 740, 390 × 844, 768 × 1024 y 1440 × 1000 no hubo desbordamiento horizontal. En 320 y 390 px el formulario completo y el CTA de mapa quedan en la primera vista; el mapa comienza inmediatamente después del bloque hero. La foto cargó desde el recurso local. Búsqueda, filtro, selección de marcador y ficha, detalle, contacto simulado y restablecimiento respondieron. Los enlaces internos se resolvieron y la consola no mostró errores ni advertencias. La inspección visual confirma legibilidad, sin cálculo WCAG píxel a píxel sobre la fotografía.

**Análisis y documentación:** se retiró el collage y el crédito superpuesto, y se mantuvo una sola imagen editorial. Capturas y mediciones constan en `prototipo/evidencias/hero-refinado-390x844.jpg`, `hero-refinado-1440x1000.jpg` y `verificacion-ux.md`; la dirección visual y README se actualizaron.

**Continuar (estado histórico):** el refinamiento se presentó para valoración humana. La aceptación posterior consta en “Cierre aprobado, 2026-10-16”.

**Criterios incrementales:** AC-023, una sola foto editorial cálida con procedencia/licencia verificadas, sin capas flotantes que compitan; AC-024, crédito y aclaración editorial mínimos visibles y documentación completa preservada; AC-025, búsqueda, mapa y flujos existentes permanecen operativos y el mapa sigue próximo al hero; AC-026, texto legible, búsqueda visible y sin overflow en los cuatro anchos. La comprobación técnica está documentada; la valoración final de calidez y aspiración corresponde a revisión humana.

### Ajuste final de fotografía del hero, 2026-10-16

**Solicitud:** cambiar la foto de Mizuno K por la imagen del grupo cocinando aportada por dirección; conservar el hero, marca, paleta, búsqueda y flujos; considerar una foto de las tres jóvenes como apoyo si está disponible y no recarga el hero.

**Implementación:** se cambió la imagen principal por una copia JPEG optimizada del adjunto, manteniendo una sola foto y el aviso editorial discreto. La composición, logo, paleta, buscador y código de interacciones permanecen. La imagen de las tres jóvenes no existe entre los assets locales, así que no se añadió una foto alternativa sin fuente/licencia verificada.

**Verificación:** el JPEG cargó correctamente en escritorio y móvil, dimensiones 1600 × 1059 px, 202 KB. En 390 px el formulario completo queda dentro del viewport y no hay overflow; la evidencia de escritorio conserva el viewport de 1440 × 1000. Capturas y límites de verificación están en `prototipo/evidencias/hero-cocina-grupo-390x844.jpg`, `hero-cocina-grupo-1440x1000.jpg` y `verificacion-ux.md`.

**Limitación de procedencia:** el archivo de dirección no tiene datos verificables de autor, origen o licencia. Por instrucción expresa se usa únicamente para esta revisión del prototipo local. Su derecho de uso y permisos quedan sin verificar y deben confirmarse antes de publicación, comercialización o uso como evidencia de un inmueble.

**Continuar:** presentar la captura actualizada para revisión humana. No implica aprobación final de la foto ni cierre de H03.

**Estado AC-023:** la foto adjunta fue aprobada para el prototipo local, con procedencia/licencia no verificadas. La restricción de no versionar ni publicar ese archivo se registra en el cierre. La copia limpia del repositorio tiene como alternativa una fotografía licenciada y documentada; la autorización de uso productivo de cualquier medio queda pendiente.

## Cierre aprobado, 2026-10-16

Dirección de producto confirmó que el informe de consolidación quedaba recibido y aprobó la identidad visual; posteriormente aceptó el recorrido funcional público y la dirección D-UX-004 con la foto del grupo en cocina como protagonista. Se satisfacen los criterios de H03 dentro del alcance de preparación documental, prototipo estático local, identidad visual y demostración del flujo público. **F00-H03 queda cerrado.** Las aceptaciones no equivalen a autorización de producción.

### Alcance aceptado

- Búsqueda y filtros, acceso a mapa/lista, selección entre fichas y marcadores, detalle y contacto simulado.
- Identidad, paleta y composición del hero integradas con el buscador. La fotografía preferida se mantiene en la copia local para revisión visual.
- Datos de alojamiento ficticios, mapa esquemático, estados de simulación e ilustraciones de cuartos rotuladas. No se requiere validar inmuebles reales ni un visor 360° real para este hito.
- Las fotos editoriales se distinguen de las imágenes de anuncios. Ninguna imagen editorial se representa como evidencia de un inmueble.

### Tratamiento de medios y repositorio

La fotografía aportada para el hero no tiene origen, autoría o licencia verificables. Se conserva únicamente en el prototipo local y se excluye del índice Git junto con sus dos capturas, mediante reglas específicas en `.gitignore`. Así se mantiene la composición solicitada en la máquina local sin incorporar a los commits el medio no verificado. Un checkout limpio activa la alternativa local de Mizuno K / Pexels, cuyos créditos y límites están en [CREDITS.md](prototipo/assets/vida-estudiantil/CREDITS.md). La licencia de esta alternativa no valida ni reemplaza los derechos de la foto adjunta.

### Verificación y límites

Las pruebas funcionales, las capturas y los límites de contraste/responsive se detallan en [verificacion-ux.md](prototipo/evidencias/verificacion-ux.md). La guía de aceptación registra el recorrido y la aprobación recibida. El prototipo no tiene backend, persistencia, autenticación, geolocalización, envío de contacto ni datos reales. Un visor 360° solo se implementará con panoramas genuinos. La publicación de medios requiere derechos verificables.

Este cierre no aprueba arquitectura, stack, seguridad, proveedores, modelo comercial, persistencia ni despliegues. La revisión de Fase 0 y preparación de arquitectura se documenta como F00-H04. Los registros H00, H01 y H02 no aparecen en este checkout y no se declaran aceptados por inferencia.
