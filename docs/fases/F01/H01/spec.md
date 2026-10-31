# F01-H01: Exploración funcional local del MVP

**Estado:** abierto por aprobación de Dirección del 2026-10-30; implementación local en curso. No equivale a selección de arquitectura productiva ni cierra F01-H00.

## Objetivo

Entregar una aplicación local en React + TypeScript para explorar alojamientos ficticios de Tunja en mapa real MapLibre/OpenFreeMap, combinar filtros, sincronizar mapa y lista, y consultar inmuebles, unidades y disponibilidad individual.

## Decisiones aprobadas para este hito

- React + TypeScript para el cliente.
- MapLibre GL JS y servicio público OpenFreeMap para el mapa real.
- Instalación de dependencias gratuitas y pruebas locales; presupuesto adicional USD 0.
- Fixtures ficticios para inmuebles, unidades, ubicaciones y medios. Sin personas, datos personales ni anuncios reales.
- Uso local. Sin Supabase remoto, despliegues, cuentas ni cambios productivos.
- Alcance AC-FE-01 a AC-FE-09 y tamaños 320, 390, 768 y 1440 px.
- Se conserva la identidad aprobada de F00-H03. No se edita H03 ni se reabre su decisión visual.
- AC-04 de F01-H00 permanece parcial, bloqueado y no satisfecho; no repetir ni diagnosticar el restore.

## Alcance funcional

- Explorar sin registro los alojamientos de ejemplo ubicados en zonas aproximadas de Tunja.
- Filtrar combinadamente por zona, precio máximo y características.
- Sincronizar selección marcador/lista, abrir detalle y presentar datos del inmueble y sus unidades por separado.
- Presentar disponibilidad propia de cada unidad y ubicación aproximada.
- Adaptar navegación y composición a móvil/tablet/escritorio.
- Aislar MapLibre/OpenFreeMap detrás de un adaptador; fallo de tiles/mapa mantiene filtros, lista y detalle, explica el problema y ofrece reintento.
- No existe contacto real, panel, autenticación, backend, persistencia, fotos de alojamientos reales, geolocalización del visitante ni experiencia 360°.

## Criterios de aceptación

- **AC-FE-01 Filtros:** zona, precio y características se combinan; lista y mapa muestran los mismos resultados; limpiar filtros restaura los ejemplos.
- **AC-FE-02 Sincronización/fallback:** marcador selecciona su resultado y tarjeta enfoca marcador. Si falla OpenFreeMap se preservan búsqueda, filtros, lista y detalle, con aviso y reintento.
- **AC-FE-03 Inmueble/unidades:** al menos un inmueble contiene dos o más unidades distintas; precios, atributos y disponibilidades se distinguen de los espacios comunes del inmueble.
- **AC-FE-04 Ubicación:** solo se muestra zona/punto aproximado ficticio; no hay dirección exacta ni ubicación real.
- **AC-FE-05 Responsive:** recorridos principales comprobados a 320, 390, 768 y 1440 px, sin desbordamiento horizontal ni pérdida de controles esenciales.
- **AC-FE-06 Fallos del mapa:** error simulado o real produce estado informativo, reintento y lista funcional; los filtros permanecen.
- **AC-FE-07 Datos/contacto:** todas las publicaciones se identifican como ficticias; no hay envío WhatsApp ni visor 360°.
- **AC-FE-08 Identidad/accesibilidad:** logo y tokens aprobados sin cambio; recorrido esencial por teclado, foco visible, etiquetas y estados accesibles.
- **AC-FE-09 Aislamiento:** no hay llamadas ni escrituras a Supabase remoto, secretos o descargas offline/masivas de tiles; los únicos requests externos de runtime son los necesarios para tiles/estilo OpenFreeMap autorizados.

## Proveedor cartográfico y privacidad

La guía oficial consultada el 2026-10-30 documenta el estilo `https://tiles.openfreemap.org/styles/liberty`, la atribución automática al usar MapLibre y la ausencia de garantía SLA. Los términos públicos (actualizados el 2026-10-14) permiten el servicio público bajo modalidad “as-is”, prohíben recolección automatizada y definen límites para descargas offline; este producto no realizará descargas offline. El proveedor indica posible CDN Cloudflare. Su política (actualizada el 2026-10-08) describe logs de acceso anonimizados y logs temporales con IP durante errores/incidentes. Las coordenadas transmitidas serán puntos aproximados sintéticos, sin geolocalización del visitante.

Referencias oficiales: [Quick Start](https://openfreemap.org/quick_start/), [Terms of Service](https://openfreemap.org/tos/), [Privacy Policy](https://openfreemap.org/privacy/) y [OpenFreeMap](https://openfreemap.org/).

El uso de un endpoint público no garantiza disponibilidad futura ni SLA y no es una selección cartográfica productiva. No se almacena contenido de tiles ni se precargan áreas.

## Arquitectura de la unidad

- React + TypeScript con Vite, ejecutada desde entorno local.
- Fixtures TypeScript locales como única fuente de datos funcionales.
- Componente/adaptador cartográfico MapLibre que consume fixtures, aislado del estado de filtros/selección y de componentes de lista/detalle.
- OpenFreeMap como fuente de estilo/tiles del mapa de esta unidad.
- Sin configuración, SDK, URL o credenciales de Supabase remoto. La arquitectura productiva sigue pendiente.
