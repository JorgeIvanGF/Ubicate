# F00-H04: acta de cierre

**Estado:** CERRADO por aprobación de dirección del 2026-10-16 (America/Bogota), tras comprobar AC-01 a AC-12.
**Base revisada:** `spec.md`, `plan.md`, `tasks.md`, investigación arquitectónica, evaluación de viabilidad costo cero y evaluación F01-H00.
**Resultado:** cierre documental de H04. No implica cierre global de Fase 0, selección de arquitectura ni aprobación de implementación.

## Auditoría de criterios de aceptación

| Criterio | Resultado | Evidencia / límite |
| --- | --- | --- |
| AC-01 Inventario | Satisfecho documentalmente | `spec.md` distingue archivos presentes de H00-H02 históricos ausentes. No se reconstruyeron cierres históricos. |
| AC-01a Procedencia | Satisfecho documentalmente | `recuperacion-contexto-historico.md` y `spec.md` conservan ratificaciones actuales y sus límites. |
| AC-02 Consistencia | Satisfecho documentalmente | `docs/direccion/decisiones.md`, alcance MVP, H03 y H04 separan aprobado, provisional y pendiente. |
| AC-03 Decisiones | Satisfecho como matriz y clasificación | La matriz A/B/C del MVP está ratificada. Priorizar seguridad, privacidad, backup y recuperación está aprobado como requisito; controles concretos, arquitectura, stack, proveedores, gasto específico y operación permanecen pendientes. |
| AC-04 Preparación | Satisfecho como diagnóstico | Investigación y viabilidad documentan recomendaciones provisionales, riesgos, supuestos y puertas de decisión. |
| AC-04a Tarifas | Satisfecho | Cobros dentro de la aplicación siguen fuera del MVP y los planes comerciales siguen sin aprobarse. |
| AC-05 Plan | Satisfecho | H04 mantiene spec, plan y tasks con el flujo SDD requerido. |
| AC-05a Hito siguiente | Satisfecho | Dirección autorizó formalmente F01-H00 el 2026-10-16; su evaluación inicial se documenta en `docs/fases/F01/H00/`. |
| AC-06 Límites | Satisfecho | No se seleccionó ni implementó proveedor, stack, arquitectura, controles, despliegue; la política aprobada no autoriza gasto concreto. |
| AC-07 OSS/costo | Satisfecho documentalmente | Hay comparación de tres patrones y evaluación económica A/B con 200/1.000/5.000. Los resultados dependen de supuestos y no son capacidad universal. |
| AC-08 Viabilidad USD 0 | Satisfecho documentalmente | A/B cubren capas solicitadas, límites y costos modelados; no se demostró arquitectura productiva completamente verificada a USD 0. |
| AC-09 Evidencia comercial | Satisfecho con reservas explícitas | Se separan términos públicos e inferencias de las condiciones de cuenta no comprobadas; se excluye SMTP de prueba. |
| AC-10 Recuperación y gasto | Satisfecho como preparación | Controles, contingencia y verificaciones que requieren autorización están listados. No se probó restauración. |
| AC-11 Transición | Satisfecho | Se entrega spec, plan, tasks, propuestas y evaluación inicial de F01-H00. La autorización abre la evaluación, sin seleccionar arquitectura ni autorizar implementación. |
| Política económica ratificada | Satisfecho | Dirección aprobó el 2026-10-16 USD 0 por defecto y autorización humana expresa para gastos. No selecciona arquitectura ni proveedor. |
| AC-12 Política económica | Satisfecho | La decisión está en `docs/direccion/decisiones.md`; no se habilitó billing, pagos o un servicio. |

## Categorías estratégicas y ratificaciones

### Satisfecho y vigente

- Dirección aprobó priorizar software abierto y minimizar gastos, buscando USD 0 durante desarrollo y piloto.
- La visión actual, mercado de Tunja y núcleo MVP recibieron ratificación actual en la instrucción de 2026-10-16. Esto no declara cierres históricos H00-H02.
- El cierre F00-H03 permanece fuera de alcance y sin cambios.
- La investigación comparativa y la evaluación específica de costo cero están documentadas con límites de evidencia.

### Propuesta que no debe registrarse como aprobada

- Arquitecturas A, B y autohospedaje, todos los proveedores, stack, seguridad, presupuesto, despliegue, volumen real, dominios y objetivos de disponibilidad.
- La aceptación del nombre/alcance F01-H00 como siguiente hito formal.

## Verificaciones trasladadas a F01-H00

Estos asuntos son trabajo de evaluación/selección y validación técnica en el hito propuesto F01-H00, no resultados que H04 pudiera verificar sin cuentas o servicios:

- Confirmar cobertura y precisión cartográfica de sectores de Tunja con un método y datos autorizados.
- Medir cargas, tráfico, latencia, egress, ritmo de altas y consumo real de fotos.
- Verificar con las cuentas concretas permiso de uso comercial, dominio remitente, límites efectivos y comportamiento al alcanzar cuota.
- Probar registro, recuperación, permisos entre anunciantes, copias y restauración en un entorno aislado autorizado.
- Comprobar si el freno de gasto funciona antes de activar servicios. Sin cuenta/activación, no se certifica configuración de facturación.

La implementación, despliegue y puesta en producción quedan después de F01-H00 y de las aprobaciones aplicables. Los casos detallados se encuentran en [spec F01-H00](../../F01/H00/spec.md) y [tasks F01-H00](../../F01/H00/tasks.md).

## Recomendación

Dirección aceptó el diagnóstico y autorizó el cierre de H04 y la apertura de F01-H00 el 2026-10-16. Las pruebas de cuentas, restauración y cobertura quedan dentro de la evaluación de F01-H00. La aceptación no convierte stack ni proveedores en decisiones aprobadas.

## Resultado de cierre

F00-H04 queda **CERRADO** el 2026-10-16. La Fase 0 en conjunto permanece **NO CERRADA / ESTADO HISTÓRICO INCOMPLETO**: H03 y H04 tienen cierre verificable; H00 y H01 cuentan con ratificación actual, sin cierre histórico verificable; H02 conserva orientación provisional y no se declara cerrado. No se afirma ningún cierre histórico ausente.
