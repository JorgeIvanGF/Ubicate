# Evidencia de aceptación: F01-H01

**Estado:** validación funcional local automatizada ejecutada; pendiente de revisión y aceptación de Dirección. F01-H01 permanece abierto. No se cierra F01-H00 ni se modifica su estado de AC-04.

**Corrección visual de ficha, 2026-10-31:** se reprodujo el solapamiento de «Ilustración de ejemplo» y «Inmueble de ejemplo · Tunja» al abrir el detalle a 1440×1000 y 390×844. La regla `.dialog-hero .art-disclosure { display: none }` oculta solo la etiqueta sobre la ilustración dentro del detalle. La etiqueta del inmueble queda visible; las tarjetas conservan «Ilustración de ejemplo» y el nombre accesible de las ilustraciones no cambia. Playwright verifica ambos viewports y guarda capturas antes/después. La aceptación visual humana de Dirección sigue pendiente.

**Comprobación final del PR #1, 2026-10-30:** se reprodujo con Chromium/Playwright la secuencia de abrir a 390 px, elegir Lista y cambiar a 768 y 1440 px sin elegir Mapa. El CSS mostró el mapa en escritorio y MapLibre redimensionó el canvas; los siete marcadores permanecieron visibles y el clic en `arrayan-2` seleccionó la unidad correcta. No se reprodujo un defecto, por lo que no se modificó `App.tsx`; se añadió esta secuencia como regresión automatizada y se guardaron capturas. El estado de Lista se conservó durante los cambios de tamaño. Esta verificación cubre la observación técnica del PR, no constituye aceptación final del hito.

## Entorno y reproducibilidad

- Aplicación local servida por Vite en `127.0.0.1`; revisión interactiva automatizada con Playwright 1.64.1 y Chromium headless aislado.
- No se usó ni modificó el perfil de Chrome DevTools existente. El recorrido no se conectó a Supabase.
- Pruebas de layout en `320×844`, `390×844`, `768×1024` y `1440×1000`.
- Solicitudes externas observadas: exclusivamente `tiles.openfreemap.org`. En el ensayo de fallo, Playwright interceptó esas solicitudes y respondió HTTP 503 sintético. No se causó una caída real del proveedor.
- Las coordenadas y publicaciones son ficticias. No se usaron datos personales, alojamientos reales, fotografías externas, credenciales ni secretos.
- Las vistas pequeñas son emulación de viewport en Chromium; no son prueba en teléfono físico. La aplicación escucha solo en loopback y no se abrió el servidor a la red local.

Comando reproducible, desde `apps/exploracion-local`, con Vite ya disponible en localhost:

```powershell
npm.cmd run test:browser
```

El recorrido guarda resultados estructurados y capturas en [`capturas-browser`](capturas-browser/). El JSON registra viewports, filtros, selección, errores de accesibilidad, hosts de red, errores de consola y respuestas HTTP. Las capturas `baseline-*` documentan el estado antes de las correcciones; `exploracion-*`, `mapa-*` y `tile-outage.png` corresponden al estado corregido.

## Defectos revisados y correcciones

| Hallazgo | Reproducción | Corrección aplicada | Verificación |
| --- | --- | --- | --- |
| Marcadores de unidades coincidentes se superponían | Dos habitaciones de Arrayán y dos unidades de Casa Limón tenían igual posición de pantalla | Separación visual determinista de marcadores que comparten punto; identidad/dato geográfico continúa ligado al punto aproximado | 7/7 marcadores tienen centros de pantalla distintos; el marcador seleccionado queda dentro del mapa y recibe el hit de puntero |
| Selección lista→mapa ambigua por nombre del inmueble | Al existir varias unidades del mismo inmueble no se podía identificar unívocamente el marcador desde el nombre | Selección y lookup por `unitId`; el botón de mapa expone `data-unit-id` | Seleccionar `arrayan-2` activa exactamente ese botón y su nombre accesible, sin seleccionar el de `arrayan-1` |
| Breakpoint CSS/JS distinto | En 720 px el CSS mostraba el selector móvil mientras la lógica conservaba el modo escritorio | Constante de breakpoint compartida en 760 px para CSS y lógica; estados comprobados en runtime | A 720 px ambos informan móvil y cambiar a lista oculta mapa y muestra lista |
| Error cartográfico posterior al estilo | Se inyectó HTTP 503 a tiles luego de cargar el estilo | El adaptador escucha errores de MapLibre también después de `style.load`, conserva el resto de la interfaz y ofrece reintento | Estado informativo visible; filtros y dos resultados sobreviven; reintento repone dos marcadores y retira el error |
| Selector mapa/lista, teclado, foco y resize | Recorrido con Playwright por teclado y cambios de visibilidad | Controles semánticos como botones toggle con `aria-pressed`; foco por unidad al sincronizar; foco inicial/cierre/restauración del diálogo; `map.resize()` al mostrarse y cambiar viewport | Enter cambia a lista; foco del diálogo y retorno comprobados; canvas vuelve a medir 360 px en contenedor de 360 px después de ocultar/mostrar |
| Observación final PR #1: Lista móvil y cambio a escritorio | Playwright, secuencia 390 → 768 → 1440 px sin pulsar Mapa | Mapa visible en escritorio; medidas CSS y bitmap del canvas iguales al contenedor con tolerancia <1 px; siete marcadores visibles e interactivos | PASS; detalles en `listToDesktopResize` del JSON y capturas `lista-resize-*` |
| Etiquetas superpuestas en ficha | Reproducido antes de corregir en 1440×1000 y 390×844; los rectángulos de ambas etiquetas se intersectaban | CSS oculta `.dialog-hero .art-disclosure` solo dentro del hero del diálogo | PASS en escritorio y móvil: solo queda visible «Inmueble de ejemplo · Tunja»; tarjeta conserva «Ilustración de ejemplo» y el `aria-label` original |
| Bundle local de MapLibre no iniciaba worker en Vite | Error del worker impedía dibujar el mapa en Chromium | URL explícita del worker de MapLibre para el bundler Vite | Chromium cargó estilo, tiles y controles; mapa pintado en capturas |
| Contraste/etiquetas detectadas por axe | Primer audit reportó contraste insuficiente y diferencia entre texto visible y nombre accesible | Ajustes de tonos secundarios y nombres de marcadores/control de lista; identidad aprobada y logo sin cambios | axe en vista inicial, móvil y diálogo no reporta violaciones |

La configuración del worker sigue el procedimiento oficial de MapLibre para Vite: [`MapLibre GL JS`](https://maplibre.org/maplibre-gl-js/docs/) y [`setWorkerUrl`](https://maplibre.org/maplibre-gl-js/docs/API/functions/setWorkerUrl/).

## Resultados de ejecución

| Verificación | Resultado | Evidencia |
| --- | --- | --- |
| `npm.cmd test` | PASS, 1 archivo y 3 pruebas | Combinación de filtros, resultado vacío sin mutar fixtures, atributos/precios/disponibilidad |
| `npm.cmd run build` | PASS, TypeScript y Vite | Bundle inicial 237 kB minificado; chunk MapLibre diferido 1.079,56 kB con advertencia de Vite >500 kB |
| `npm.cmd audit --audit-level=moderate` | PASS, 0 vulnerabilidades reportadas | Auditoría del árbol npm instalado |
| `git diff --check` | PASS, sin errores whitespace | Salida local; solo advertencias CRLF de Git |
| `npm.cmd run test:browser` | PASS | El proceso termina 0 y guarda `browser-qa-result.json`; todos los asserts del recorrido completados |
| Regresión de etiquetas de ficha | PASS en 1440×1000 y 390×844 | `detailDisclosure` en el JSON: etiqueta ilustrativa oculta en detalle; etiqueta del inmueble visible; etiqueta de tarjetas y nombre accesible conservados |
| Secuencia final PR #1: Lista 390 → 768 → 1440 | PASS | En 390 px el mapa queda oculto y mide 0×0; en 768 mide 334×468 y en 1440 mide 729×491. Canvas CSS/bitmap coincide con el contenedor dentro de 1 px; siete marcadores visibles y clic en `arrayan-2` selecciona la misma unidad. No se pulsó Mapa entre cambios de viewport. |
| axe WCAG 2.2 A/AA automatizado | PASS en las tres vistas auditadas | Vista inicial, viewport móvil 390 px y detalle abierto: arrays de violaciones vacíos |
| Consola/errores JS | PASS | `consoleErrors=[]`, `pageErrors=[]` |
| Aislamiento HTTP | PASS con cuatro cancelaciones de tiles observadas | Hosts: `127.0.0.1` y `tiles.openfreemap.org`; solicitudes Supabase vacías. MapLibre/navegador canceló cuatro solicitudes PBF obsoletas durante cambios de cámara (`ERR_ABORTED`). No hubo fallo DNS/TLS/5xx real sin interceptación |
| Respuesta 503 y reintento | PASS, error sintético | 6 solicitudes de tiles reciben 503 en la interceptación; fallback conserva zona Centro, precio máximo 750.000, característica Amoblada y 2 resultados; reintento recupera 2 marcadores y elimina el aviso |

La prueba de errores ejercita respuestas HTTP 503 para el cliente mediante interceptación local. No afirma haber probado una indisponibilidad real de OpenFreeMap. Cuatro solicitudes fallidas del recorrido no simulado fueron `ERR_ABORTED`, cancelaciones al cambiar la cámara; el JSON conserva el detalle para revisión.

## Matriz AC-FE

| Criterio | Estado de verificación | Evidencia |
| --- | --- | --- |
| AC-FE-01 Filtros | PASS automatizado | Zona Centro + máximo 750.000 + Amoblada produce los mismos 2 resultados en lista y 2 marcadores; limpiar filtros devuelve 7. Estado vacío incluido en unit tests y recorrido |
| AC-FE-02 Sincronización/fallback | PASS automatizado | Selección de marcador/lista en ambas direcciones por ID único; error 503 conserva filtros/lista, mensaje y botón de reintento |
| AC-FE-03 Inmueble/unidades | PASS automatizado | Detalle de propiedad multiunidad muestra 2 unidades separadas, con precios y disponibilidad individual |
| AC-FE-04 Ubicación | PASS estático e interactivo automatizado | Datos de fixtures inventados y aproximados; sin dirección exacta ni geolocalización del visitante. Puntos de distintos marcadores coincidentes se separan solo visualmente |
| AC-FE-05 Responsive | PASS emulado en Chromium | Los cuatro tamaños no presentan scroll horizontal (`scrollWidth=innerWidth`); controles mapa/lista coherentes en 320/390 y modo escritorio en 768/1440. No probado en teléfono físico |
| AC-FE-06 Fallos del mapa | PASS con fallo HTTP sintético | Fallback y reintento cubiertos después de cargar estilo, con filtros activos. No hubo indisponibilidad real del proveedor |
| AC-FE-07 Datos/contacto | PASS automatizado | Anuncios/fotos son ficticios; ilustraciones CSS; no se encontraron enlaces WhatsApp ni visor 360° en el recorrido |
| AC-FE-08 Identidad/accesibilidad | PASS automatizado, revisión humana pendiente | Logo y tokens H03 sin modificación; axe sin violaciones en tres vistas; toggle por teclado, foco del diálogo, cierre Escape y restauración de foco verificados. Inspección visual humana de Dirección pendiente |
| AC-FE-09 Aislamiento | PASS en tráfico observado | Solo localhost y tiles OpenFreeMap; cero solicitudes Supabase; no hay URL/cliente/secretos Supabase en código runtime; no descarga offline ni masiva de tiles |

Estos resultados representan verificación técnica reproducible, no aceptación humana final ni cierre del hito.

## Capturas

- [Vista inicial antes de correcciones, 1440 px](capturas-browser/baseline-1440.png)
- [Vista inicial corregida, 320 px](capturas-browser/exploracion-320.png)
- [Vista inicial corregida, 390 px](capturas-browser/exploracion-390.png)
- [Vista inicial corregida, 768 px](capturas-browser/exploracion-768.png)
- [Vista inicial corregida, 1440 px](capturas-browser/exploracion-1440.png)
- [Mapa corregido, 390 px](capturas-browser/mapa-390.png)
- [Mapa corregido, 1440 px](capturas-browser/mapa-1440.png)
- [Lista seleccionada a 390 px antes del cambio de viewport](capturas-browser/lista-resize-390.png)
- [Mapa visible con Lista aún seleccionada a 768 px](capturas-browser/lista-resize-768.png)
- [Mapa visible con Lista aún seleccionada a 1440 px](capturas-browser/lista-resize-1440.png)
- [Detalle antes de la corrección, solapamiento a 1440 px](capturas-browser/detail-overlap-1440.png)
- [Detalle antes de la corrección, solapamiento a 390 px](capturas-browser/detail-overlap-390.png)
- [Detalle corregido, 1440 px](capturas-browser/detail-fixed-1440.png)
- [Detalle corregido, 390 px](capturas-browser/detail-fixed-390.png)
- [Fallback durante respuesta 503 sintética](capturas-browser/tile-outage.png)
- [Resultado estructurado completo](capturas-browser/browser-qa-result.json)

## Pendiente de Dirección

- Revisión visual humana de las capturas y del recorrido local.
- Prueba opcional en un teléfono físico, fuera de este entorno de loopback.
- Decidir si el umbral de advertencia del chunk MapLibre se acepta para esta entrega local o se aborda en una unidad posterior; build sí pasa.
- Aceptación visual explícita de Dirección y aceptación final de F01-H01. El commit de esta corrección mantiene el hito abierto.
