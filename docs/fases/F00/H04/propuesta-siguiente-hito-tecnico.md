# Propuesta del siguiente paso técnico

**Estado:** investigación comparativa autorizada y documentada dentro de F00-H04. El siguiente hito formal no se abre con esta propuesta.
**Nombre descriptivo provisional:** decisión de arquitectura para el MVP.

## Criterio estratégico vigente

La política económica USD 0 por defecto fue aprobada por dirección el 2026-10-16 y no autoriza stack ni servicio. La [evaluación focalizada](viabilidad-costo-cero.md) compara A gestionada integrada y B desacoplada, pero no certifica uso comercial de cuentas, correo de producción, caps, backups restaurables o disponibilidad. Antes de seleccionar se requiere acordar escenario, capacidad operativa, recuperación esperada y tolerancia a cuotas/pausas.

## Trabajo ya autorizado y completado

Actualización del 2026-10-16: esta propuesta fue ratificada como F01-H00 y abierta formalmente por dirección junto con la aceptación del cierre de F00-H04. Se conserva el contenido como registro de transición; consultar el [spec F01-H00](../../F01/H00/spec.md) y la [evaluación inicial](../../F01/H00/evaluacion.md) para su estado vigente.

## Propuesta de siguiente hito SDD

Después de la revisión humana de H04, se propone preparar un hito que formalice requisitos no funcionales, prioridades/ponderaciones de evaluación y la decisión arquitectónica del MVP. El hito tendría los artefactos:

1. **Spec:** alcance de la decisión, criterios de éxito y requisitos aprobados para arquitectura.
2. **Plan:** fuentes, comparaciones, análisis de seguridad/privacidad y verificación.
3. **Tasks:** secuencia trazable y puertas humanas de aprobación.
4. **Implementación del hito:** investigación o diseño documental únicamente, salvo autorización explícita posterior.
5. **Pruebas y análisis:** revisión de escenarios, cobertura, costos, riesgos y límites.
6. **Documentación/cierre:** decisión humana registrada como aceptada o propuesta pendiente, con evidencias.

## Preguntas de entrada

- ¿La investigación de H04 es suficiente o se requiere profundizar en alternativas específicas?
- ¿Qué presupuesto, cargas, disponibilidad y capacidad operativa se deben usar?
- ¿Qué indexación pública se requiere para publicaciones?
- ¿Se confirma la ubicación aproximada pública y el momento de divulgar dirección exacta?
- ¿Qué requisitos adicionales de moderación, privacidad y datos personales aplican?
- ¿Se acepta el nivel de evaluación de B01 o se difiere el visor 360°?
- ¿USD 0 mensual es un límite absoluto que permite diferir correo transaccional, copias descargables y garantías de disponibilidad, o se debe definir un presupuesto mínimo para producción?
- ¿Se autoriza en un futuro hito una prueba técnica aislada con datos ficticios para medir cuotas, consultas espaciales, subida/entrega de fotos y migración? Esto no autoriza crear cuentas o activar facturación ahora.
- ¿Qué nivel de dependencia y operación manual se acepta para mantener mapas, copias y disponibilidad cuando se prioriza costo cero?
- ¿Cuál es el nombre, fase y numeración canónicos que dirección aprueba para la siguiente etapa?

## Puertas de aprobación

- Esta investigación no aprueba stack, arquitectura, proveedor, seguridad, gasto ni despliegue.
- La estructura del repositorio disponible llega hasta F00-H04; no se encontró una definición canónica de F01. No crear `F01/H01` ni asignar numeración hasta que se confirme la nomenclatura.
- La documentación de especificación/plan/tasks no autoriza implementación productiva.
- La selección arquitectónica final, cambios estratégicos, contratación y despliegue requieren aprobación humana explícita.

## Recomendación inmediata

Revisar el informe comparativo y aceptar/corregir sus límites y recomendaciones. Si dirección lo acepta, aprobar el nombre y objetivo del siguiente hito SDD y sus requisitos de entrada. No cerrar F00-H04 automáticamente ni iniciar desarrollo con la sola aceptación de este informe.
