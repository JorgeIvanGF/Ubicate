# Análisis inicial de F00-H04

**Fecha:** 2026-10-16. **Evidencia:** revisión estática de checkout/historial, ratificación humana recibida, y fuentes oficiales consultadas para la investigación comparativa.

## 1. Estado de Fase 0

| Hito | Evidencia | Estado que se puede afirmar |
| --- | --- | --- |
| F00-H00 | No hay artefacto original en el checkout; el contexto previo constaba en documentos actuales y una síntesis secundaria | Visión ratificada actualmente el 2026-10-16. Cierre histórico no verificado |
| F00-H01 | No hay artefacto original ni evidencia primaria de estudio de mercado | Contexto de mercado ratificado actualmente el 2026-10-16. Sin hallazgos estadísticos inventados. Cierre histórico no verificado |
| F00-H02 | No hay artefacto original | Orientación provisional ratificada: búsqueda gratuita, monetización futura para anunciantes; no hay planes, precios, periodicidad o proveedor de pagos aprobados. Cierre histórico no verificado |
| F00-H03 | Hito, prototipo y aceptación humana documentados | Cerrado para el alcance de identidad/UX y recorrido de prototipo el 2026-10-16 |
| F00-H04 | Spec, plan, tasks, matriz ratificada, recuperación contextual y comparación arquitectónica | En curso; revisión humana pendiente |

La ausencia del original en el checkout no prueba que el hito nunca ocurrió. No se reconstruye evidencia o cierre histórico. Ver [recuperación histórica](recuperacion-contexto-historico.md).

## 2. Estado del MVP

El mandato de dirección del 2026-10-16 ratificó A01-A05 como núcleo, B01-B03 como opcionales/condicionados y los elementos C fuera del MVP inicial. Incluye búsqueda pública sin cuenta, Tunja, mapa real y lista, filtros, publicaciones inmueble/unidad, disponibilidad, fotos reales, gestión de anunciantes, WhatsApp y moderación básica. Pagos de alquiler y cobros de Ubícate a anunciantes están excluidos. La definición canónica se encuentra en [alcance MVP](propuesta-alcance-mvp.md).

El nivel de precisión geográfica, privacidad del teléfono, campos del dominio, operación de moderación, presupuesto y metas no funcionales requieren detalle antes de seleccionar arquitectura. Estos pendientes no invalidan la autorización de comparación documental.

## 3. Resultado del análisis técnico

La [comparación arquitectónica](investigacion-arquitectonica-comparativa.md) examinó patrones gestionados, desacoplados y autogestionados; alternativas de renderizado; modelo conceptual inmueble/unidad; persistencia geoespacial; proveedores de mapas y geocodificación; medios y 360°; identidad; riesgos de autorización/privacidad; costos ilustrativos y capas de prueba/operación.

La recomendación de evaluar primero patrón gestionado y contrastarlo con servicios desacoplados es provisional. El modelo relacional es una base de comparación apropiada por las relaciones del dominio y las búsquedas geográficas, pero no está aprobado como decisión. No se eligieron proveedores o stack.

Los precios consultados son publicados en USD y no incluyen impuestos, condiciones negociadas, cambio, todos los servicios o contrato. Los escenarios son supuestos aritméticos, no proyecciones de demanda. No se verificaron cobertura cartográfica de Tunja, precisión de geocodificación, latencia, costo COP, región de datos o calidad con datos reales.

## 4. Riesgos y decisiones pendientes

- Decidir si la dirección exacta de un inmueble se publica o se mantiene aproximada hasta el contacto. La recomendación del informe es una propuesta de privacidad, no una política aprobada.
- Especificar presentación/consentimiento del número al abrir WhatsApp.
- Definir propiedad y permisos por cuenta, rol administrativo, moderación y registro de acciones.
- Definir derechos, formatos, tamaños, procesamiento de metadatos, retención y eliminación de medios.
- Revisar requisitos legales y de privacidad aplicables a Colombia antes de producción.
- Obtener presupuesto, estimación operativa y cargas que permitan escoger entre servicios gestionados y autogestionados.
- Confirmar cobertura/calidad de mapa y geocodificación en Tunja con un método de prueba aprobado.
- Determinar si B01 (visor 360° simple) cabe en la primera versión después de evaluación práctica.
- Confirmar nombre y numeración de fase/hito siguiente; no existe especificación F01 en el checkout.

## 5. Diagnóstico

**Preparado para revisión y decisión arquitectónica informada; no preparado para una selección definitiva ni para implementación.** El alcance ya tiene una base funcional aprobada. La comparación ayuda a ordenar opciones, pero no verifica su desempeño en el escenario de Ubícate ni reemplaza requisitos no funcionales, revisión especializada de privacidad/seguridad, revisión humana o costos contractuales.

El siguiente paso es que dirección revise esta comparación, resuelva o asigne las preguntas pendientes y confirme estructura/nomenclatura SDD posterior. No es necesario realizar encuestas para iniciar análisis técnico; las hipótesis de mercado siguen sin evidencia estadística.

## 6. Límites de evidencia

No se realizaron entrevistas, encuestas, pruebas de usuario nuevas, auditoría de seguridad, asesoría legal, pruebas con servicios de mapas, evaluación de carga, cotización personalizada, implementación o despliegue. Las recomendaciones, riesgos y alternativas son análisis documental; ver [fuentes y límites completos](investigacion-arquitectonica-comparativa.md#15-límites-de-evidencia).
