# Dirección 03: Ubícate

Dirección visual aprobada para el prototipo local: conserva la organización limpia, las tarjetas, los formularios y el orden mobile-first de Nido, y aplica la identidad cromática y el logotipo aprobados de Ubícate. La composición D-UX-004 y el recorrido público fueron aceptados por dirección de producto; F00-H03 está cerrado. Patio y Nido se conservan como referencias históricas. Las secciones posteriores registran iteraciones anteriores y se leen junto al [cierre aprobado](../hito.md#cierre-aprobado-2026-10-16).

## Jerarquía de interfaz

La introducción se compacta para dar espacio al buscador. En escritorio, el mapa aparece antes de los resultados y ocupa la mitad principal de la composición. En móvil, se apilan primero el buscador, luego el mapa y finalmente las fichas. El contenido mantiene filtros de texto, presupuesto y tipo, controles de precio en el mapa y tarjetas ficticias para comparar.

## Color

El azul eléctrico `#185BE7` identifica la acción principal y la selección. El turquesa `#35C7AE` queda para señales secundarias y detalles de ilustración. La lima `#D7F46B` aparece como acento breve. El fondo usa `#F5F7FB`, con superficies blancas y texto oscuro `#17243A`. El turquesa y la lima no se usan como fondos de texto pequeño; en sus superficies claras se emplea texto oscuro. No se usa terracota como color protagonista.

Los valores implementados están en [design-tokens.json](design-tokens.json) y se aplican a los custom properties de `styles.css`. La identidad de marca está aprobada; sus aplicaciones en componentes y los flujos del prototipo continúan sujetos a revisión.

## Alcance y estado

La página continúa siendo un prototipo local con anuncios y mapa esquemáticos ficticios. No se integra geolocalización, cartografía real, búsqueda remota ni persistencia.

## Iteración cromática 02

Esta iteración mantiene la estructura de búsqueda, filtros, mapa y tarjetas de Ubícate 03. Distribuye más claramente el turquesa `#35C7AE` en el símbolo, marcadores, leyenda, badges e ilustraciones; la lima `#D7F46B` aparece en los detalles del símbolo, hero, puntos de mapa y señales de disponibilidad. El azul `#185BE7` permanece para la acción principal, el estado seleccionado y la base del logo. Se mantienen fondos claros y texto oscuro; turquesa y lima no se usan como texto pequeño sobre fondo claro.

## Variantes de logo

Las láminas [logo-variantes.html](logo-variantes.html) y [logo-variantes.svg](logo-variantes.svg) y los SVG individuales se conservan como registro histórico de exploración. La marca aprobada es el archivo fuente [logotipo-ubicate-aprobado.png](assets/identidad/logotipo-ubicate-aprobado.png). El prototipo no vectoriza ni reconstruye ese PNG.

## Iteración funcional, 2026-10-15

La página prioriza búsqueda, mapa y comparación de resultados. Incluye navegación móvil mapa/lista, selección bidireccional de anuncios, detalle modal, contacto simulado, controles de error/vacío y estado 360° no disponible. Cuatro anuncios ficticios incluyen dos unidades pertenecientes al mismo inmueble. Los recorridos funcionales de anunciante y administración están definidos en [hito.md](../hito.md).

No se recibieron fotografías de alojamientos ni panoramas reales. Las ilustraciones no se presentan como fotografías; la carga de imágenes reales y una experiencia 360° navegable siguen pendientes de recursos y revisión. La identidad aprobada no cierra esta revisión funcional.

La nueva evidencia visual de esta iteración se guarda como `390x844-ubicate-v2.jpg` y `1440x1000-ubicate-v2.jpg`. Las capturas anteriores permanecen disponibles para comparar la evolución.

## Narrativa de vida estudiantil y medios, D-UX-003

La búsqueda, el mapa y las fichas conservan la prioridad. La narrativa humana pasa al primer bloque: texto breve y dos fotografías compactas antes del buscador, con acceso al mapa desde el hero. Se retiró el módulo de ilustraciones SVG inferior para reducir el tono editorial y evitar repetir el mensaje. El aviso no desplaza a la búsqueda en móvil; su orden, altura y tamaños se verifican en cuatro anchos.

| Recurso local | Fuente y autor | Licencia y alcance |
| --- | --- | --- |
| `assets/vida-estudiantil/pexels-estudio-compartido-4126707.jpg` | [Pexels, foto 4126707](https://www.pexels.com/photo/concentrated-girlfriends-working-on-laptop-in-living-room-4126707/), Ketut Subiyanto | Licencia Pexels; foto editorial de estudio en vivienda, no pertenece a alojamiento ni ficha |
| `assets/vida-estudiantil/pexels-cocina-compartida-13334672.jpg` | [Pexels, foto 13334672](https://www.pexels.com/photo/men-cooking-at-home-13334672/), Mizuno K | Licencia Pexels; foto editorial de cocina en casa, no pertenece a alojamiento ni ficha |

El detalle por archivo de autoría, página original, fuente y restricciones está en [CREDITS.md](assets/vida-estudiantil/CREDITS.md). La [licencia oficial de Pexels](https://www.pexels.com/legal-pages/license) permite usar fotos en sitios y aplicaciones sin atribución obligatoria, aunque el prototipo conserva créditos visibles. La licencia prohíbe presentar personas de una manera ofensiva o insinuar que avalan el producto; tampoco permite vender copias inalteradas, redistribuirlas como un banco de imágenes ni incorporarlas a una marca. Por eso el hero avisa que las personas no representan usuarios ni respaldan Ubícate. Se guardaron copias JPEG locales de 1200 × 800 px para no depender de cargar fotos remotas al usar el prototipo.

Las fotos editoriales se diferencian en el hero con rótulos y créditos. Las ilustraciones de habitaciones en fichas y galerías siguen claramente identificadas como conceptuales. No se usan las fotos Pexels como imágenes de anuncios ni prueba de amenidades. No se escogió una fuente de medios para producción; la licencia y selección deben revisarse de nuevo antes de ese uso. La composición actual se presenta para revisión humana; todavía no está aprobada visualmente.

En el detalle, atributos de habitación y espacios compartidos del inmueble siguen en secciones separadas. “Patio común” y “Cocina compartida” proceden de los datos ficticios existentes. No se añadieron amenidades. La identidad cromática y el logotipo permanecen sin cambios. D-UX-003 continúa pendiente de revisión visual humana y no cierra H03.

## Iteración D-UX-004: hero aspiracional

Esta propuesta conserva los flujos existentes y cambia solo la entrada visual. La foto editorial de estudio ocupa el hero a todo lo ancho, con un velo oscuro para sostener la lectura del titular y el CTA de mapa. La foto de cocina se muestra como tarjeta complementaria. El panel de búsqueda se superpone al borde inferior del hero y conserva sus campos, filtros y acción actuales. En móvil la foto tiene altura acotada; el buscador completo queda en la primera vista.

La jerarquía de marca no cambia: azul `#185BE7` para la acción de búsqueda, turquesa `#35C7AE` como detalle de interacción y lima `#D7F46B` en el resaltado del titular y el CTA sobre la fotografía. Los fondos claros, el logo aprobado y los tokens existentes se conservan; no fue necesario crear tokens ni alterar `design-tokens.json`.

Las dos fotos continúan diferenciadas de los anuncios mediante rótulos editoriales y créditos enlazados. El aviso de no representación ni aval aparece debajo del buscador. Autoría, origen, licencia y restricciones constan en [CREDITS.md](assets/vida-estudiantil/CREDITS.md). Las capturas son [390 × 844](evidencias/hero-aspiracional-390x844.jpg) y [1440 × 1000](evidencias/hero-aspiracional-1440x1000.jpg).

La revisión renderizada detectó inicialmente colisión del crédito y el aviso editorial en la parte inferior de la foto y un desborde subpíxel al sangrar el hero en anchos pequeños. Se movió el crédito sobre una zona despejada de la foto, el aviso debajo de la búsqueda y los márgenes del hero se ajustaron a los breakpoints del contenedor. Las verificaciones responsive, funcionales, de enlaces y consola constan en [verificacion-ux.md](evidencias/verificacion-ux.md).

**Estado:** propuesta visual pendiente de valoración humana. No cambia el logo, la paleta aprobada ni el flujo bajo el hero; no constituye la identidad final ni cierra H03.

## Refinamiento final D-UX-004: una imagen y menos capas

El hero conserva su estructura, mensaje, enlace al mapa y buscador integrado. La fotografía principal ahora es la escena de grupo en cocina compartida aportada por dirección para esta iteración. Se retiró la tarjeta de segunda fotografía y el pie superpuesto; una nota discreta debajo del buscador la diferencia de anuncios. Se mantiene un gradiente sobre el área del titular para sostener la lectura. La imagen no corresponde a un anuncio ni a un alojamiento del prototipo.

No cambian el logotipo, la paleta, los tokens ni los controles de búsqueda, filtros, mapa, fichas, detalle o contacto simulado. El archivo adjunto no contiene metadatos de autor, fuente o licencia y no se suministró una URL de origen; por solicitud expresa se usa solo en esta revisión local. No se afirma que su licencia esté verificada. La limitación y la atribución disponible están documentadas en [CREDITS.md](assets/vida-estudiantil/CREDITS.md). No se añadió una foto secundaria porque la imagen de las tres jóvenes no está entre los archivos locales disponibles y el hero debe conservar una sola protagonista visual.

Las capturas de esta pasada son [móvil 390 × 844](evidencias/hero-cocina-grupo-390x844.jpg) y [escritorio 1440 × 1000](evidencias/hero-cocina-grupo-1440x1000.jpg). Los cuatro anchos, legibilidad, enlaces, interacción y consola se registran en [verificacion-ux.md](evidencias/verificacion-ux.md). La dirección queda lista para valoración visual humana; no se registra aceptación ni cierre automático de H03.
