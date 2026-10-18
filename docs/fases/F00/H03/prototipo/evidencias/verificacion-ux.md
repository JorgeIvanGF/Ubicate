# Verificación UX/UI de F00-H03

## Alcance y método

Se sirvió el prototipo estático con Python 3.14.5 mediante `python -m http.server 8765 --bind 127.0.0.1` y se abrió en Chromium DevTools en `http://127.0.0.1:8765/index.html`. No se instaló software ni se integró un servicio. Los datos y ubicaciones son ficticios.

La inspección cubrió las alternativas Patio y Nido, anchos de 320, 390, 768 y 1440 px, tamaños táctiles, estructura accesible del DOM, acciones principales, consola y solicitudes de red. Las capturas guardadas en esta carpeta muestran el primer viewport en 390 × 844 y 1440 × 1000 para cada alternativa. El renderizado final incluye ilustraciones SVG locales para las fichas.

## Resultados

- **Responsive:** ambas alternativas se probaron en 320 × 740, 390 × 844, 768 × 1024 y 1440 × 1000. No se detectó desbordamiento horizontal ni desbordamiento de las fichas. Todos los controles visibles medían al menos 40 px de alto o ancho en esos anchos.
- **Controles:** Enter activó la alternativa Nido. Tab alcanzó el control de ordenamiento con un indicador de foco visible de 3 px. `prefers-reduced-motion: reduce` se aplicó durante las comprobaciones.
- **Búsqueda:** el filtro de ubicación «Centro» junto al presupuesto máximo de $700.000 mostró una ficha; la búsqueda «sin coincidencias» mostró el estado vacío y ocultó los precios del mapa; el filtro «Habitación compartida» mostró La Casa del Arrayán.
- **Mapa y tarjetas:** seleccionar el precio ficticio 3 marcó la ficha correspondiente y anunció el nombre; Guardar cambió `aria-pressed`; el ordenamiento produjo precios ascendentes; después se restauraron los tres ejemplos.
- **Accesibilidad automatizada:** Lighthouse en modo snapshot obtuvo 100 en Accesibilidad, Buenas prácticas, SEO y Agentic Browsing, con 36 auditorías aprobadas y ninguna fallida, tanto en móvil como en escritorio. El primer análisis encontró un desacuerdo entre el nombre accesible del logotipo y su texto visible; se corrigió y ambos análisis finales terminaron sin fallos.
- **Contraste calculado para tokens:** texto secundario Patio `#59635c` sobre papel `#f5f1e8`: 5,54:1; texto secundario Nido `#526b63` sobre papel `#f1f3eb`: 5,15:1; texto blanco en botones Patio `#b34e35`: 5,18:1; texto blanco en botones Nido `#386b58`: 6,15:1; etiquetas de mapa `#536253` sobre los fondos Patio y Nido: 5,34:1 y 5,44:1. El cálculo cubrió estos pares de tokens, no toda combinación de estilos posible.
- **Red y consola:** en los tamaños revisados no hubo recursos externos registrados. Chromium no reportó mensajes de consola.

## Evidencia visual

- [Patio, móvil 390 × 844](390x844-patio.jpg)
- [Nido, móvil 390 × 844](390x844-nido.jpg)
- [Patio, escritorio 1440 × 1000](1440x1000-patio.jpg)
- [Nido, escritorio 1440 × 1000](1440x1000-nido.jpg)
- [Registro de evidencia para el verificador ECC](design-evidence.json)

## Límites de esta revisión

Lighthouse no certifica conformidad WCAG. No se realizó una sesión con lector de pantalla ni pruebas con personas usuarias. Las ilustraciones SVG de habitaciones son conceptuales y el mapa es un diagrama esquemático; no son fotografías ni cartografía. La revisión humana de las direcciones visuales y su selección siguen pendientes.

## Iteración de integración de identidad cromática original

### Spec y plan

Se autorizó una tercera dirección que conserva de Nido la composición ordenada, las tarjetas y formularios, la tipografía clara, el espaciado y el enfoque mobile-first. Se incorporó la paleta de referencia de Ubícate. La selección visual definitiva permanece pendiente.

### Implementación

Se añadió el selector **03 Ubícate**, con azul eléctrico `#185BE7` para acciones prioritarias, turquesa `#35C7AE` para detalles secundarios, lima `#D7F46B` como acento puntual, superficies `#F5F7FB` y blanco, y texto principal `#17243A`. No se usa terracota como protagonista. Se compactó el encabezado, se priorizó el formulario de búsqueda y se ubicó el mapa antes de las fichas en móvil y a la izquierda de los resultados en escritorio. Patio y Nido siguen disponibles para comparación.

Los tokens y la justificación están en [design-tokens.json](../design-tokens.json) y [direccion-03-ubicate.md](../direccion-03-ubicate.md). La propuesta y sus dos capturas no la convierten en identidad aprobada.

### Pruebas y análisis

En Chromium se revisó Ubícate en 320 × 740, 390 × 844, 768 × 1024 y 1440 × 1000. No se detectó desbordamiento horizontal; los controles visibles midieron al menos 40 px. En móvil se ordenan formulario, mapa y fichas; en escritorio el mapa queda a la izquierda. Se verificaron por interacción teclado (Tab y Enter), búsqueda con resultado, estado vacío, filtro de tipo, selección de ficha desde el mapa y guardado. `prefers-reduced-motion: reduce` estuvo activo.

Contrastes calculados: texto principal sobre fondo claro 14,50:1; texto secundario sobre fondo claro 6,36:1; texto blanco sobre azul primario 5,69:1; texto oscuro sobre turquesa 7,36:1; texto oscuro sobre lima 12,62:1. Lighthouse snapshot móvil y escritorio: 100 en Accesibilidad, Buenas prácticas, SEO y Agentic Browsing; 36 comprobaciones aprobadas y 0 fallidas por dispositivo. No se encontraron mensajes de consola. Las solicitudes observadas fueron únicamente HTML, CSS, JavaScript y favicon locales.

- [Ubícate, móvil 390 × 844](390x844-ubicate.jpg)
- [Ubícate, escritorio 1440 × 1000](1440x1000-ubicate.jpg)

### Revisión crítica y límites

La primera captura quedó desplazada tras probar la selección del mapa. Se detectó en la inspección visual, se restauró la posición superior y se reemplazaron ambas capturas. Lighthouse no certifica WCAG. No se realizaron pruebas con personas usuarias ni lector de pantalla. La ilustración de habitación y el mapa son esquemáticos, y el contenido es ficticio.

### Decisiones

**Aprobado para esta iteración:** añadir Ubícate como tercera alternativa de evaluación con los colores de referencia y la jerarquía de búsqueda descrita.

**Pendiente de aprobación humana:** escoger la dirección visual final; convertir la paleta o sus tokens en identidad definitiva; cualquier decisión de arquitectura, stack, seguridad, servicios externos o despliegue.

**Cierre del hito:** pendiente de revisión humana. Esta iteración no cierra F00-H03.

### Skills ECC aplicadas en esta iteración

Se usaron de forma selectiva `frontend-design-direction` para traducir la dirección acordada a una propuesta visual comprobable; `design-system` para separar y documentar tokens; `make-interfaces-feel-better` para simplificar la jerarquía hacia la búsqueda y el mapa; `frontend-a11y` para contraste, semántica, teclado y tamaños de interacción; y `verification-loop` en las comprobaciones aplicables al prototipo estático. No se ejecutaron build, tipado o lint propios de un framework porque el repositorio aún no tiene aplicación ni herramientas instaladas.

## Revisión de iteración cromática 02 de Ubícate

La estructura de búsqueda, filtros, mapa y fichas se conservó. La nueva distribución aumenta la presencia de turquesa en marcas secundarias, marcadores, leyenda, chips e ilustraciones; la lima identifica el punto de marca, elementos del hero, puntos del mapa y señales de disponibilidad. El azul continúa en la acción principal y selecciones.

- Variantes de símbolo preparadas en [logo-variantes.svg](../logo-variantes.svg): lima + azul; turquesa + lima; azul + turquesa con acento lima. El header usa de forma provisional la tercera combinación, implementada en [logo-mark.svg](../logo-mark.svg).
- Nuevas capturas: [móvil 390 × 844](390x844-ubicate-v2.jpg) y [escritorio 1440 × 1000](1440x1000-ubicate-v2.jpg).
- Contraste de texto pequeño revisado con texto oscuro sobre turquesa claro y lima claro; no se coloca texto claro sobre los tonos vivos. Contrastes calculados: texto principal sobre fondo 14,50:1; secundario sobre fondo 6,36:1; texto blanco sobre azul primario 5,69:1; texto turquesa oscuro sobre turquesa claro 5,68:1; texto oscuro sobre chip menta 10,72:1; texto oscuro sobre lima suave 14,10:1 y sobre lima original 12,62:1.

La combinación del logo, el balance de color y la identidad final continúan pendientes de revisión humana. F00-H03 permanece abierto.

### Resultado de comprobación de iteración cromática 02

En 320 × 740, 390 × 844, 768 × 1024 y 1440 × 1000 no se detectó desbordamiento horizontal. Los controles visibles conservaron un borde mínimo de 40 px; el buscador precede al mapa y el mapa se muestra antes de los resultados, arriba en móvil y a la izquierda en escritorio. La selección de alternativas, filtros, estado vacío, marcadores y guardado se mantienen operativos. Las variantes de logo cargan correctamente en su página de comparación responsive.

Contrastes medidos para los elementos de color nuevos: texto turquesa oscuro `#126B59` sobre turquesa claro `#DFF6F1`: 5,68:1; texto oscuro `#173C35` sobre chips turquesa: 10,72:1; texto oscuro sobre lima suave `#F0F8CF`: 14,10:1; texto oscuro sobre lima `#D7F46B`: 12,62:1. Se mantienen los resultados de texto principal 14,50:1, texto secundario 6,36:1 y blanco sobre azul `#185BE7` 5,69:1.

Lighthouse snapshot móvil y escritorio: 100 en Accesibilidad, Buenas prácticas, SEO y Agentic Browsing, 38 comprobaciones aprobadas y ninguna fallida por dispositivo. La consola no mostró errores; las peticiones de la página fueron recursos locales del prototipo. Los resultados de Lighthouse no certifican WCAG ni sustituyen una evaluación con lector de pantalla o personas usuarias.

## Consolidación funcional y de identidad, 2026-10-15

### Capturas comparables

- [Móvil, 390 × 844](390x844-ubicate-consolidacion.png)
- [Escritorio, 1440 × 1000](1440x1000-ubicate-consolidacion.png)

### Verificaciones ejecutadas

- En Chromium con emulación móvil a 390 × 844: ancho del documento 390 px, navegación móvil mapa/lista visible y logotipo cargado a 155 px de ancho sin deformación. La captura se inspeccionó visualmente. En 1440 × 1000: mapa y columna de resultados usan áreas de cuadrícula explícitas y comienzan a la misma altura; no se detectó desborde horizontal.
- Contrastes calculados: texto principal `#17243A` sobre `#F5F7FB`, 14,50:1; texto secundario `#4D5C70` sobre `#F5F7FB`, 6,36:1; blanco sobre acción azul `#185BE7`, 5,69:1; blanco sobre hover azul `#1248B8`, 7,94:1; turquesa oscuro `#126B59` sobre superficie turquesa clara `#DFF6F1`, 5,68:1; texto oscuro sobre lima suave `#F0F8CF`, 14,10:1. La selección del marcador usa texto blanco y fondo azul para conservar contraste.
- Interacción en navegador: el detalle abre con precio mensual, galería rotulada como ilustración/medios pendientes, disponibilidad, ubicación de ejemplo, contacto simulado y estado 360°; el estado de recorrido dice que no hay panorama real cargado. La ficha selecciona el marcador y el marcador correspondiente marca la ficha.
- Búsqueda sin resultados mostró el estado vacío y ocultó los marcadores. La simulación de error ocultó las fichas y los marcadores, mostró un mensaje accesible y actualizó el conteo; “Restablecer búsqueda” restauró los resultados.
- La consola no mostró errores. Las solicitudes observadas fueron HTML, CSS, JavaScript y PNG locales. No se encontraron vínculos internos rotos.

### Revisión crítica y límites pendientes

La revisión de escritorio reveló inicialmente que el auto-posicionamiento de cuadrícula dejaba el mapa debajo del inicio de resultados. Se corrigió con áreas explícitas y se volvió a inspeccionar en 1440 px. La revisión de error reveló que `hidden` perdía efecto frente a `display:grid`; se añadió una regla explícita y se comprobó que el estado oculta fichas y marcadores. La revisión móvil ajustó el tamaño del PNG y el ancho mínimo de campos de búsqueda.

No se proporcionaron fotografías auténticas ni panoramas 360°. Se usan ilustraciones conceptuales con aviso visible y marcadores de fotografías adicionales pendientes. No se midió una visita 360° real. Los recorridos de anunciante y administrador están documentados como propuestas; no existe autenticación, autorización, persistencia ni moderación real.

### Identidad, aprobación y estado

El PNG fuente fue comparado por SHA-256 con el recurso original en Descargas: `ACEE19F719EB1173C9B20F2275B2672F29A36D7ECDC6B7DE61B9100851117569`. El prototipo usa el recurso copiado sin vectorización. La identidad está aprobada según instrucción humana; la aceptación de la experiencia funcional sigue pendiente. F00-H03 permanece abierto.

### Skills ECC usadas de forma selectiva

Se usaron `agentic-engineering` e `intent-driven-development` para organizar la continuación y criterios observables; `frontend-design-direction` y `design-system` para mantener la estructura de búsqueda y registrar el mapa de color/token; `make-interfaces-feel-better` para priorizar búsqueda/mapa y corregir jerarquía; `frontend-a11y` para foco, etiquetas, contraste y tamaños táctiles; `verification-loop` para comprobaciones aplicables a una página estática; `continuous-agent-loop` para inspeccionar y corregir defectos en iteraciones limitadas; y `living-docs-governance` para corregir las fuentes canónicas dejando explícito el registro histórico. No se ejecutaron build, tipado o lint de framework porque no hay framework ni dependencias de proyecto.

## Preparación de aceptación funcional, 2026-10-15

### Defectos corregidos

- Los enlaces móviles “Mapa” y “Lista” desplazaban los encabezados debajo de la barra sticky. Se añadió margen de desplazamiento; ahora ambos títulos quedan a 80 px de la parte superior del viewport.
- La acción de contacto simulado solo actualizaba el anuncio accesible, sin confirmación visible. Ahora presenta un mensaje en el detalle indicando que no se envió información.
- El contenedor de ficha tenía una diferencia entre el comportamiento de teclado y ratón. Se añadió un botón con nombre accesible para destacar la ficha en el mapa; al activarlo por teclado, la selección cambia y el foco pasa al marcador correspondiente. La selección desde una ficha también desplaza el mapa a la vista en móvil.

### Recorrido probado

- Texto “Centro” y presupuesto máximo de $700.000: quedó una ficha y un marcador.
- Búsqueda “sin coincidencias”: se vio el estado vacío y no quedaron marcadores visibles.
- Tipo “Habitación compartida”: quedó la habitación 1 de La Casa del Arrayán.
- Marcador → ficha y botón de ficha → marcador: la selección se reflejó en ambos sentidos. Enter sobre “Mostrar … en el mapa” activó la acción, dejó seleccionada la ficha y puso el foco en el marcador.
- Detalle: se comprobaron precio por mes, características, disponibilidad, ubicación ficticia, canal de contacto y estado 360°. El contacto mostró confirmación visible; el estado 360° dijo que no había panorama real.
- Error simulado: la lista quedó oculta, el mapa sin marcadores y el aviso accesible visible. Restablecer devolvió los cuatro ejemplos y el orden inicial.
- Accesos móviles: los encabezados de mapa/lista terminaron en `top: 80px`, fuera del área cubierta por la barra sticky.

### Responsive y calidad

En 320 × 740, 390 × 844, 768 × 1024 y 1440 × 1000, `scrollWidth` coincidió con el ancho del cliente, sin desbordamiento horizontal. Los accesos mapa/lista aparecen en móvil. En 768 y 1440 px, el mapa y los resultados comienzan a la misma altura. Los botones de selección y guardado miden al menos 40 × 40 px. Las capturas nuevas son [390 × 844](aceptacion-funcional-390x844.jpg) y [1440 × 1000](aceptacion-funcional-1440x1000.jpg); ambas se inspeccionaron visualmente.

Lighthouse navegación móvil y escritorio: 100 en Accesibilidad, Buenas prácticas, SEO y Agentic Browsing; 56 comprobaciones aprobadas y ninguna fallida por dispositivo. La consola quedó sin mensajes. Las solicitudes fueron únicamente HTML, CSS, JavaScript y PNG locales. La revisión de 43 enlaces de documentos encontró dos rutas relativas antiguas rotas, que se corrigieron; en la segunda revisión no quedaron rutas locales sin destino. Los vínculos internos del prototipo también resolvieron sus destinos. `node --check` y `git diff --check` pasaron. El verificador local de evidencia ECC terminó con “Evidence record complete”. Contraste del botón nuevo de ubicación, `#126B59` sobre `#DFF6F1`: 5,68:1; blanco sobre azul de selección `#185BE7`: 5,69:1.

Estos resultados automatizados y técnicos no certifican WCAG ni sustituyen una evaluación con lector de pantalla o una revisión con personas usuarias. No se exige que los ejemplos sean alojamientos reales; las ilustraciones están rotuladas. El visor panorámico genuino queda como requisito de implementación posterior, sujeto a disponer de un panorama 360° real. La falta de esos recursos no bloquea la aceptación funcional actual.

La única revisión que falta para el cierre de H03 es la aceptación humana del recorrido público. La guía con pasos y preguntas está en [guia-aceptacion-funcional.md](../../guia-aceptacion-funcional.md).

### Continuación D-UX-003, 2026-10-15

- Las escenas editoriales SVG se cargaron correctamente desde `assets/vida-estudiantil/`. Cada imagen expone texto alternativo y el bloque presenta el aviso visible “Escenas ilustrativas de marca. No representan alojamientos ni fotos de anuncios.” No se incorporó fotografía de terceros ni se copió licencia externa.
- Al abrir La Casa del Arrayán, el detalle presenta atributos de habitación y áreas comunes en secciones distintas. “Patio común” y “Cocina compartida” son datos previos del ejemplo y están clasificados a nivel inmueble. No se agregaron servicios ni condiciones ficticias.
- Se repitieron búsqueda “Centro” con tope $700.000, filtro de habitación compartida, selección desde mapa, detalle, confirmación de contacto y estado 360° sin panorama. Todas las verificaciones devolvieron el resultado esperado. Contacto y disponibilidad siguen siendo demostraciones locales.
- En 320 × 740, 390 × 844, 768 × 1024 y 1440 × 1000 el ancho del documento coincidió con el ancho de cliente. Se corrigió el desplazamiento a la sección editorial para dejar su encabezado fuera del área de la navegación fija.
- Contraste calculado: texto `#17243A` sobre lima `#D7F46B`, 12,62:1; texto turquesa oscuro `#126B59` sobre turquesa claro `#DFF6F1`, 5,68:1; blanco sobre azul `#185BE7`, 5,69:1.
- Lighthouse móvil y escritorio: Accesibilidad, Buenas prácticas, SEO y Agentic Browsing, 100; 56 comprobaciones aprobadas, cero fallidas. Consola sin mensajes. Red limitada a HTML, CSS, JS, PNG aprobado y SVG locales.
- `node --check`, parseo JSON de `design-evidence.json` y `git diff --check` terminaron correctamente. Las capturas verificadas son [móvil 390 × 844](vida-estudiantil-390x844.jpg) y [escritorio 1440 × 1000](vida-estudiantil-1440x1000.jpg); muestran la sección editorial, no sustituyen la revisión humana del recorrido completo.

Los resultados automatizados no certifican WCAG ni sustituyen una revisión con lector de pantalla o personas usuarias. H03 permanece abierto para revisión humana.

### Ajuste visual con fotos editoriales, 2026-10-15

Esta evidencia sustituye en el prototipo el módulo inferior de SVG editoriales documentado antes. Las dos SVG se retiraron. En la primera vista, el hero presenta una foto de estudio en casa y otra de convivencia en cocina; cada una tiene rótulo editorial y crédito con enlace. Un aviso dice que las personas retratadas no representan usuarios ni avalan Ubícate. Ninguna de las dos fotos se presenta como parte de un anuncio. El registro detallado de autoría, URL, licencia, restricciones y transformación local está en [CREDITS.md](../assets/vida-estudiantil/CREDITS.md).

- **390 × 844:** el botón Buscar y sus campos quedan dentro de la primera vista, junto al acceso mapa/lista. El mapa abre desde el hero.
- **320 × 740:** el enlace al mapa y el botón Buscar quedan visibles; el final del panel y la navegación a mapa/lista terminan en torno al borde inferior del viewport. Sin desbordamiento horizontal.
- **768 × 1024 y 1440 × 1000:** el hero acompaña la intro y el buscador; el mapa/resultados comienzan en el mismo viewport. En los cuatro tamaños `scrollWidth` coincide con `clientWidth`.
- Las fotos locales miden 1200 × 800 px y suman **218.068 bytes**. El navegador hizo seis solicitudes locales para HTML, CSS, JavaScript, logo y dos fotos; consola sin errores. No se descargan fotos de Pexels en tiempo de uso.
- El recorrido de búsqueda “Centro” con $700.000, filtro compartido, selección mapa/ficha, detalle, contacto simulado y estado 360° se mantuvo funcional. Los encabezados de mapa y lista quedaron en `top: 80px` al navegar desde móvil.
- Lighthouse, auditorías móvil y escritorio: Accesibilidad, Buenas prácticas, SEO y Agentic Browsing, 100; 56 comprobaciones aprobadas, cero fallidas. Traza local móvil: LCP observado 172 ms y CLS 0,00, sin throttling de red/CPU; no hay datos CrUX reales para esta página.
- Las capturas iniciales revisadas son [390 × 844](hero-fotografico-390x844.jpg) y [1440 × 1000](hero-fotografico-1440x1000.jpg). `design-evidence.json`, `node --check`, `git diff --check` y el verificador ECC de evidencia terminaron correctamente.

La licencia Pexels se permite para la propuesta de prototipo dentro de sus restricciones. Esto no convierte las fotografías en recursos inmobiliarios ni significa que la composición visual haya sido aprobada. La revisión humana de esta iteración sigue pendiente; H03 continúa abierto.

### Hero aspiracional D-UX-004, 2026-10-15

La foto editorial de estudio pasó a ocupar el ancho completo del hero; el mensaje y el acceso al mapa se superponen a la imagen. La foto de cocina permanece como tarjeta secundaria. El formulario conserva sus campos y filtros y se monta sobre el borde inferior del hero. El aviso de no representación ni aval queda debajo del buscador. Se mantuvieron el logo aprobado, la paleta y los tokens. Autoría, URL de origen, licencia y restricciones siguen en [CREDITS.md](../assets/vida-estudiantil/CREDITS.md).

- Capturas de esta versión: [móvil 390 × 844](hero-aspiracional-390x844.jpg) y [escritorio 1440 × 1000](hero-aspiracional-1440x1000.jpg). Ambas se inspeccionaron renderizadas.
- Se midió el ancho en 320 × 740, 390 × 844, 768 × 1024 y 1440 × 1000; `scrollWidth` coincidió con `clientWidth`. A 320 y 390 px el panel completo queda dentro del viewport, y el enlace del mapa está en el hero. A 768 y 1440 px el formulario está inmediatamente bajo el titular/foto y el mapa/resultados aparecen en el primer viewport.
- En móvil el panel termina a unos 590 px de scroll en 320 × 740 y 608 px en 390 × 844. El buscador y su botón caben sin desplazamiento vertical. Las dos fotos locales y el logo cargaron correctamente.
- Recorrido de búsqueda: “Centro” con presupuesto hasta $700.000 devuelve un ejemplo y un marcador. El filtro de habitación compartida devuelve “La Casa del Arrayán · habitación 1”. Seleccionar la ficha actualiza su marcador, abrir detalle muestra el diálogo y el contacto simulado presenta la confirmación prevista. El estado del recorrido indica que no hay panorama 360°.
- Los enlaces internos tienen destino; los dos enlaces de crédito apuntan a páginas de fotos Pexels. La consola del navegador no mostró mensajes. El buscador conserva sus tres campos y el envío.
- Se revisaron legibilidad y contraste visual del titular sobre la fotografía y del texto sobre superficies claras; no se calculó una razón WCAG por cada zona de píxeles de la imagen. El color y los tokens estáticos no cambiaron.

La primera inspección del rediseño había mostrado colisiones entre el pie de foto, el aviso y la acción de mapa. El pie de foto se ubicó en la zona libre inferior derecha, el aviso pasó debajo del buscador y se ajustaron los márgenes responsivos para igualar el padding del contenedor. La nueva composición sigue pendiente de valoración humana; no cierra H03.

### Refinamiento final del hero D-UX-004

**Render y responsive.** Se probó a 320 × 740, 390 × 844, 768 × 1024 y 1440 × 1000. `scrollWidth` coincidió con `clientWidth` en cada tamaño, sin desbordamiento horizontal. A 320 px el buscador termina en y=590 y el CTA de mapa queda en y=234–274; el mapa comienza en y=724. A 390 px el formulario termina en y=608, el CTA de mapa queda en y=250–290 y el mapa comienza en y=742. En 768 px el buscador queda en y=384–534 y el mapa inicia en y=599. A 1440 px el buscador queda en y=494–628 y el mapa inicia en y=693. El ancho reportado por el navegador para escritorio/tableta descontó la barra vertical; `scrollWidth` y `clientWidth` se mantuvieron iguales.

**Legibilidad e identidad.** La revisión visual en móvil y escritorio confirma que el titular y el texto breve se leen sobre la imagen con gradiente, y que el formulario conserva etiquetas, campos y acción visibles. La imagen se carga localmente. Se mantuvieron el PNG aprobado, tokens y paleta. No se calculó una razón de contraste píxel a píxel para todas las áreas fotográficas.

**Interacción.** Se aplicó la búsqueda “Centro” con tope de $700.000: quedó un resultado y un marcador. El filtro de habitación compartida devolvió el ejemplo de habitación 1. Seleccionar el marcador sincronizó la ficha; abrir el detalle mostró alojamiento, condiciones y contacto simulado; activar el contacto mostró su confirmación; restablecer devolvió cuatro espacios. Los destinos de enlaces internos presentes resolvieron a elementos de la página. La atribución del hero enlaza a la ficha original de Pexels.

**Consola.** No hubo mensajes de error ni advertencia de consola en la sesión revisada.

**Cambios visuales.** La foto de cocina de Mizuno K / Pexels sustituyó a la de estudio en el hero. Se eliminó la foto secundaria y la tarjeta flotante, se redujo el velo oscuro fuera del área de texto y se movió la atribución con el aviso editorial a una línea discreta bajo el buscador. La documentación completa de procedencia/licencia permanece en `assets/vida-estudiantil/CREDITS.md`. No se alteraron búsqueda, filtros, mapa, fichas, detalle, contacto, logo, paleta o tokens.

Las capturas de la pasada anterior son [móvil 390 × 844](hero-refinado-390x844.jpg) y [escritorio 1440 × 1000](hero-refinado-1440x1000.jpg).

### Cambio de fotografía del hero, 2026-10-16

La foto principal se reemplazó por el grupo en la cocina adjuntado por dirección. Se mantuvo una sola imagen, la composición del hero, el buscador, el logotipo, la paleta y los flujos. El aviso editorial aclara que la imagen no representa un anuncio o alojamiento. No se añadió una fotografía secundaria de las tres jóvenes porque ese archivo no se encuentra entre los recursos del proyecto; no se obtuvo una licencia verificable para otra imagen.

El adjunto no incluye metadatos de autoría, fuente o licencia. Se creó una copia JPEG de 1600 × 1059 px y 202 KB para el prototipo. Esta es una comprobación de carga/peso, no una verificación de licencia ni una aprobación para producción. La limitación queda registrada en `assets/vida-estudiantil/CREDITS.md`.

**Responsive.** En 320 × 740 y 390 × 844 no hubo overflow (`scrollWidth`= `clientWidth`). A 320 px el formulario termina en y=590 y el mapa comienza en y=724. A 390 px el formulario queda en y=326–608, el CTA al mapa en y=250–290 y el mapa en y=742. En 768 × 1024 `scrollWidth` y `clientWidth` coincidieron en 753 px, descontando el scrollbar; formulario y mapa quedan en y=384–534 y y=599. En 1440 × 1000 ambos anchos documentales coinciden en 1425 px, descontando el scrollbar; formulario en y=494–628, mapa desde y=693. La imagen cargó a 1600 × 1059 px y solo hay una foto dentro del hero. Capturas: [móvil 390 × 844](hero-cocina-grupo-390x844.jpg) y [escritorio 1440 × 1000](hero-cocina-grupo-1440x1000.jpg).

La legibilidad del titular se revisó visualmente sobre el gradiente en ambas capturas; no se calculó contraste WCAG píxel a píxel sobre la fotografía. Los recorridos funcionales se mantienen respecto a la pasada previa y no se modificó su código en este ajuste. H03 sigue abierto a revisión humana.

## Estado consolidado y aceptación, 2026-10-16

Las notas anteriores registran el estado de cada iteración al momento de redactarse. Dirección aceptó el recorrido público y la dirección D-UX-004 el 2026-10-15 y 2026-10-16; H03 está cerrado. Esta es la resolución vigente.

- **Automatizado/local:** `node --check` de `app.js`; parseo de `design-tokens.json` y `design-evidence.json`; el servidor local respondió HTTP 200.
- **Navegador:** se verificó carga de la imagen preferida desde el recurso local. Al emitir un error de carga de forma controlada, el manejador cargó el fallback Pexels local, actualizó el texto alternativo y mostró el crédito correspondiente.
- **Responsive:** viewport 320 × 740, formulario y CTA de mapa dentro de la primera vista, sin overflow horizontal (`scrollWidth`= `clientWidth`=320). A 390 × 844, formulario dentro de la primera vista y sin overflow (`390`= `390`). En 768 × 1024 el documento midió 753 px de contenido por la barra vertical, sin overflow (`scrollWidth`= `clientWidth`=753). En 1440 × 1000 fue igualmente 1425 px por la barra vertical, sin overflow (`1425`= `1425`). El mapa aparece inmediatamente después del hero; navegación directa mapa/lista se conserva.
- **Recorrido público en navegador:** `Centro` + presupuesto `$700.000` devolvió una ficha; el detalle abrió y el contacto mostró “Consulta simulada. No se envió información al anunciante.” La guía conserva pasos para revisar filtro de tipo, mapa/ficha, estado vacío, 360° y restablecimiento.
- **Consola:** no se encontraron mensajes tras la recarga del prototipo.
- **Identidad:** no se alteraron logo ni valores de paleta. La revisión previa de contraste de tokens se mantiene; el contraste de texto sobre la fotografía fue valorado visualmente, no medido píxel a píxel. No hubo una nueva auditoría Lighthouse ni prueba con lector de pantalla en esta iteración.
- **Medios:** la imagen aprobada aportada por dirección y las dos capturas que la contienen permanecen en la copia local y son ignoradas por Git. El checkout limpio cuenta con un fallback local Pexels con fuente/licencia documentadas. La licencia del archivo adjunto sigue sin verificarse y no se afirma que esté aprobada para publicación.

El cierre de H03 no aprueba arquitectura, stack, seguridad, proveedores, uso comercial de imágenes, publicación o despliegue. Los pendientes transversales de Fase 0 están en [el análisis inicial H04](../../../H04/analisis-inicial.md).
