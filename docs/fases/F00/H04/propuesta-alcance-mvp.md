# Alcance MVP ratificado para preparación arquitectónica

**Fecha de aprobación:** 2026-10-16
**Estado:** categorías A y B ratificadas por dirección. B continúa condicionada a evaluación. C queda fuera del MVP inicial.
**Propietario:** este documento es la fuente canónica de priorización MVP de F00-H04.

La aprobación del alcance permite analizar requisitos y arquitectura. No aprueba stack, proveedor, costos, controles de seguridad, despliegue ni implementación. F00-H03 sigue cerrado y no se reabre.

## Categoría A: núcleo obligatorio aprobado

### A01. Exploración pública

- Consultar alojamientos sin registro obligatorio.
- Buscar en el mercado piloto de Tunja.
- Filtrar por ubicación, presupuesto y características relevantes.
- Consultar resultados en mapa real y listado.
- Navegar al detalle del alojamiento.

### A02. Publicaciones

- Consultar fotografías reales de los alojamientos, diferenciadas del material editorial.
- Consultar precios y condiciones.
- Consultar disponibilidad declarada y actualizada por el anunciante.
- Diferenciar un inmueble de sus unidades alquilables.
- Permitir varias habitaciones o unidades por inmueble.
- Presentar espacios comunes y servicios efectivamente disponibles.
- Asociar fotografías al inmueble o a la unidad a la que corresponden.

### A03. Gestión de anunciantes

- Registro y autenticación de anunciantes.
- Crear y editar inmuebles y sus unidades alquilables.
- Gestionar fotografías.
- Actualizar precios, información y disponibilidad.
- Administrar estados básicos de publicación.

### A04. Contacto inicial

- WhatsApp aprobado como canal de contacto inicial.
- El interesado inicia la conversación directamente con el anunciante.
- No se incluye chat interno ni automatización de mensajes.
- La exposición del número, formato del enlace, consentimiento y datos personales se deben especificar antes de implementación.

### A05. Administración básica

- Capacidad administrativa para revisar publicaciones.
- Ocultar o despublicar contenido problemático.
- Gestionar reportes básicos cuando correspondan.
- Proteger la integridad de los anuncios y la plataforma.
- No se requiere una consola administrativa avanzada para cumplir el núcleo.

## Categoría B: aprobada como condicionada u opcional

| Código | Capacidad | Estado y condición |
| --- | --- | --- |
| B01 | Cargar una imagen panorámica 360° existente, asociarla a habitación o espacio común y mostrarla interactivamente | Incluir solo si una evaluación de complejidad, rendimiento, costo y seguridad resulta aceptable. Debe ser panorama genuino. El visor simple no implica tour guiado |
| B02 | Favoritos | Opcional; revisar alcance y experiencia. Favoritos sincronizados requieren decisión de cuenta/identidad para quien busca |
| B03 | Administración avanzada, indicadores e informes | Complementaria y diferible; no bloquea la moderación básica A05 |

Las capacidades B no son condición de entrega del núcleo A mientras no exista aprobación posterior que las cambie.

## Categoría C: fuera del MVP inicial

- Recorridos 360° guiados y captura asistida desde el móvil.
- Reservas o agendamientos dentro de Ubícate.
- Pagos integrados, tanto alquileres entre las partes como cobros de Ubícate a anunciantes.
- Contratos digitales.
- Valoraciones y reseñas.
- Mensajería interna.
- Funcionalidades basadas en inteligencia artificial.
- Expansión a mercados fuera del piloto de Tunja.

Planes, tarifas, periodicidad y proveedor de pagos no están aprobados. La búsqueda gratuita es una orientación comercial provisional para quienes buscan. La monetización futura se orientaría a anunciantes, sin planes o precios ratificados.

## Dependencias a resolver en preparación arquitectónica

1. Modelo y campos de inmueble, unidad, espacio común, disponibilidad y publicación.
2. Flujo de registro, autenticación, recuperación y permisos del anunciante.
3. Moderación básica, reportes, responsables y estados mínimos.
4. Precisión pública de ubicación, privacidad, consentimiento y tratamiento de dirección exacta.
5. Implementación del enlace de WhatsApp y exposición voluntaria del teléfono.
6. Derechos, límites, validación, formatos y retención de fotografías.
7. Resultado de la evaluación de B01, sin que las funciones B bloqueen A.
8. Presupuesto, cargas de referencia y capacidad operativa para comparar proveedores.

Las dependencias son preguntas de diseño y requisitos, no cambios a la matriz aprobada.

## Trazabilidad

La ratificación actual está registrada en [decisiones](../../../direccion/decisiones.md) y su procedencia/limitaciones históricas en [recuperación H00-H02](recuperacion-contexto-historico.md). El análisis técnico comparativo vigente es [investigación arquitectónica](investigacion-arquitectonica-comparativa.md). H00 y H01 fueron ratificados en la fecha presente; sus cierres históricos no se reconstruyen. H02 conserva su orientación provisional y no se marca históricamente cerrado.
