# Ubícate, exploración local

Primera versión local de F01-H01 para explorar alojamientos totalmente ficticios en Tunja. Esta app no se conecta a Supabase ni contacta anunciantes.

## Requisitos

- Node.js 20.19+ (o una versión compatible con Vite 8).
- npm.
- Navegador moderno.
- Conexión a Internet para cargar OpenFreeMap. Sin conexión, la lista, filtros y detalle continúan disponibles; el mapa muestra un estado de error con reintento.

## Instalar y ejecutar

Desde esta carpeta:

```powershell
npm install
npm run dev
```

Abre la dirección local que imprime Vite, normalmente `http://127.0.0.1:5173/`. Vite escucha en loopback. Para detenerlo, pulsa Ctrl+C en esa terminal.

## Pruebas y compilación

```powershell
npm test
npm run build
npm audit --audit-level=moderate
```

Vitest cubre las funciones de combinación de filtros y consistencia básica del modelo de fixtures. La compilación ejecuta TypeScript y crea `dist/`.

### Recorrido automatizado en Chromium aislado

Instala el navegador de prueba una sola vez y deja corriendo el servidor local en otra terminal:

```powershell
npm run test:browser:install
npm run dev
```

En una segunda terminal, desde esta misma carpeta:

```powershell
npm run test:browser
```

El test abre Chromium headless de Playwright, sin usar el perfil del navegador del usuario. Por defecto visita `http://127.0.0.1:5173/`. Para apuntarlo a otro servidor local:

```powershell
$env:UBICATE_URL = 'http://127.0.0.1:4173/'
npm run test:browser
```

El recorrido verifica filtros compuestos y vacíos, sincronización de los dos sentidos, cada viewport de 320, 390, 768 y 1440 px, foco del diálogo, axe WCAG 2.2 A/AA, resize del mapa, aislamiento de red y un HTTP 503 de tiles inyectado en la ruta OpenFreeMap después de cargar el estilo. Produce capturas y `browser-qa-result.json` en `../../docs/fases/F01/H01/capturas-browser/`.

El servidor está enlazado a `127.0.0.1`, así que el teléfono físico no puede abrirlo en la red local. Las capturas Playwright a 320 y 390 px sirven como comprobación automatizada de layout móvil, no como prueba en dispositivo físico. No se abre el servidor a la red ni se cambia el firewall en este hito.

## Recorrido

1. Filtra por zona, precio y una o más características.
2. Cambia a Lista en móvil o selecciona un marcador para localizar su ficha.
3. Abre “Ver inmueble” para comparar habitaciones/unidades, precio, atributos y disponibilidad propia.
4. Usa “Simular caída del mapa” para revisar el fallback; filtros, lista y detalle conservan los datos.
5. Pulsa “Reintentar mapa” para solicitar de nuevo el estilo.

El control de fallo es un recurso de demostración local y no modifica el servicio.

## Dependencias

- React y React DOM: interfaz.
- MapLibre GL JS: mapa vectorial y marcadores.
- Vite y TypeScript: desarrollo y build.
- Vitest y jsdom: pruebas de dominio.
- Playwright y Chromium: recorrido aislado responsive, interacción, red y capturas.
- axe-core: revisión automatizada de accesibilidad local.

Las versiones exactas se fijan en `package-lock.json`. No hay cliente ni URL de Supabase en el proyecto.

## Cartografía y atribución

El adaptador solicita el estilo `https://tiles.openfreemap.org/styles/liberty`. La atribución del mapa se deja activa para que MapLibre la presente junto al mapa. OpenFreeMap atribuye los datos a OpenMapTiles y OpenStreetMap. No descargar tiles para uso offline, precargar áreas ni ejecutar scraping. El navegador realiza las solicitudes necesarias para mostrar el área visible.

Antes de usarlo, consulta las [condiciones OpenFreeMap](https://openfreemap.org/tos/), su [política de privacidad](https://openfreemap.org/privacy/) y la [guía de integración y atribución](https://openfreemap.org/quick_start/). El servicio es público y “as-is”, sin SLA; sus términos y disponibilidad pueden cambiar. Las solicitudes al proveedor/CDN pueden revelar metadatos de conexión. Esta exploración usa únicamente coordenadas sintéticas aproximadas y no solicita ubicación del visitante.

## Fixtures, identidad y limitaciones

- Los puntos de mapa y anuncios son inventados para Tunja. No se deben interpretar como viviendas, disponibilidad o precios reales.
- Los gráficos de habitación son ilustraciones CSS, no fotografías de alojamientos.
- Se reutiliza el logo aprobado de F00-H03 y sus colores. La imagen editorial de H03, cuyos derechos no están verificados, no se copia.
- WhatsApp, registro, contacto, reservas, autenticación, persistencia, backend, Supabase y visor 360° no forman parte de esta versión.
- El estado reproducible de AC-FE-01 a AC-FE-09 está en el [registro de evidencia de F01-H01](../../docs/fases/F01/H01/evidencia.md). Responsive y accesibilidad se verificaron en Chromium automatizado; revisión visual de Dirección y dispositivo físico siguen pendientes.
