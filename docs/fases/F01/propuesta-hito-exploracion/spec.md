# Propuesta de Spec: primer hito funcional de exploración

**Estado:** antecedente trasladado a [F01-H01 Spec](../H01/spec.md) tras aprobación de apertura y ejecución de Dirección del 2026-10-30. Se conserva esta copia para trazabilidad; la versión vigente está en H01.

## Objetivo

Preparar la primera entrega funcional local del MVP: exploración pública, sin registro, de alojamientos ficticios de Tunja mediante filtros, mapa, lista sincronizada y ficha de inmueble con sus unidades y disponibilidad.

## Alcance propuesto

- Aplicación ejecutable localmente, con datos completamente ficticios y sin conexión de escritura a Supabase remoto.
- Búsqueda por zona, presupuesto/precio y características del alojamiento; filtros combinables, estado vacío, carga y error.
- Mapa de Tunja que presenta ubicación aproximada de demostración, selección sincronizada con la lista en ambas direcciones y controles utilizables en teclado.
- Alternativa de lista y detalle de inmueble/unidad: precio y periodo, atributos de unidad y espacios comunes, disponibilidad declarada y ubicación aproximada. Distinguir claramente datos ficticios y diferenciar atributos del inmueble y de cada unidad.
- Diseño responsive para móvil y escritorio, coherente con la identidad aprobada en F00-H03.
- Si el mapa no carga o no tiene conexión, ofrecer lista y filtros utilizables, aviso comprensible y opción de reintento. No depender del mapa para encontrar o abrir un anuncio.
- Ubicación aproximada como valor por defecto; sin direcciones exactas ni geolocalización del visitante.
- Contacto WhatsApp solo como placeholder/simulación, sin número ni envío. La integración real pertenece a su fase correspondiente y requiere decisión sobre consentimiento y exposición del teléfono.
- Funciones 360° fuera del alcance de esta entrega.

## Arquitectura mínima candidata, no aprobada

1. **Cliente:** React con TypeScript y una estructura por vistas/componentes; MapLibre para visualización cartográfica cuando exista aprobación del proveedor de tiles y su política de uso. Mantener listado, filtros y ficha desacoplados de la disponibilidad del mapa.
2. **Datos en esta entrega:** fixtures estáticos locales tipados que modelen inmueble, unidades, características, zona aproximada y disponibilidad. No configurar conexión al proyecto remoto.
3. **Futuro backend candidato:** Supabase con PostgreSQL/PostGIS para consultas geográficas, relaciones inmueble/unidades y disponibilidad. Reutilizar la PoC PostGIS/RLS y Auth/Data API ya completada como evidencia técnica; no repetirla. No habilitar autenticación en exploración pública ni ampliar permisos.
4. **Mapa sin tiles aprobados:** mantener un adaptador de mapa y permitir un modo local de demostración claramente rotulado; confirmar con Dirección si el primer incremento debe incorporar tiles externos o si basta un mapa de demostración antes de esa aprobación.
5. **No incluido:** hosting, despliegue, cuentas, secretos, billing, almacenamiento de fotos o backend productivo.

React, TypeScript, MapLibre y Supabase son candidatas propuestas. Su adopción para producción, servicios de tiles/geocodificación, persistencia, proveedor y arquitectura requieren aprobación. La elección de herramientas de implementación importantes también debe reflejarse en la decisión humana de apertura.

## Fuera de alcance

Registro/login, panel anunciante, creación/edición de publicaciones, moderación, persistencia real, fotografías subidas, mensajería o contacto real, geolocalización, reservas, pagos, analítica, 360°, despliegue y uso de datos personales o anuncios reales.

## Criterios de aceptación propuestos

- **AC-FE-01 Filtros:** al combinar zona, precio máximo y características, lista y marcadores representan el mismo conjunto; limpiar filtros restaura los datos de ejemplo.
- **AC-FE-02 Mapa/lista sincronizados:** seleccionar un marcador resalta y lleva a su tarjeta; seleccionar una tarjeta enfoca su marcador. Si el mapa falla, lista, filtros y apertura de detalle siguen operables.
- **AC-FE-03 Inmueble/unidades:** existe al menos un inmueble con dos unidades distintas; el detalle separa sus precios/atributos/disponibilidades de espacios comunes del inmueble.
- **AC-FE-04 Ubicación:** el usuario ve una zona o punto aproximado ficticio; ninguna interfaz expone dirección exacta o ubicación real.
- **AC-FE-05 Responsive:** a 390 × 844 y 1440 × 1000 se puede filtrar, cambiar entre mapa/lista y abrir/cerrar detalle sin desbordamiento horizontal ni pérdida de acciones principales.
- **AC-FE-06 Fallos del mapa:** con carga de mapa/tiles simulada como fallida, hay aviso, reintento y fallback de lista. El error no borra filtros ni resultados.
- **AC-FE-07 Datos y contacto:** todos los anuncios se identifican como ficticios; no se inicia WhatsApp ni se transmite información; no existe visor 360° funcional.
- **AC-FE-08 Identidad y accesibilidad básica:** se conservan sin modificación el logotipo y tokens aprobados; navegación por teclado, foco visible, etiquetas y anuncios accesibles de estado funcionan en los recorridos esenciales.
- **AC-FE-09 Aislamiento:** la aplicación no realiza escrituras ni lecturas a Supabase remoto, no incluye secretos y no solicita servicios externos fuera de lo que Dirección autorice explícitamente.

La validación de estos criterios se registrará con método y evidencia real. La aceptación funcional no seleccionará por sí sola arquitectura productiva ni cerrará F01-H00.
