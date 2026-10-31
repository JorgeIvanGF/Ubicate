# Decisiones y propuestas

Este documento registra decisiones vigentes de producto y las distingue de su historia documental y de las propuestas técnicas. La fuente canónica del alcance MVP es [F00-H04: matriz A/B/C](../fases/F00/H04/propuesta-alcance-mvp.md). Las alternativas técnicas se encuentran en [investigación arquitectónica comparativa](../fases/F00/H04/investigacion-arquitectonica-comparativa.md).

## Identidad visual aprobada, 2026-10-15

- Logotipo original entregado por dirección con símbolo azul/turquesa, U blanca, acento lima y palabra Ubícate azul oscuro.
- Identidad cromática: azul `#185BE7`, turquesa `#35C7AE`, lima `#D7F46B`, superficie clara `#F5F7FB` y texto oscuro `#17243A`.
- D-UX-004 y el recorrido público del prototipo recibieron aceptación humana el 2026-10-16. F00-H03 está cerrado para su alcance documentado. No se reabre ni se modifica aquí.
- La foto adjunta elegida para el hero se conserva solo en la copia local; sus derechos no están verificados y no se incluye en Git. Consultar el cierre H03 para el alcance y su recurso alternativo documentado.

## Ratificaciones estratégicas actuales, 2026-10-16

Dirección ratificó actualmente:

- **Visión (H00):** Ubícate es una plataforma digital de descubrimiento de alojamientos para estudiantes universitarios, con Tunja como mercado piloto. Es responsive; la búsqueda geográfica es central; el acceso de exploración no exige registro obligatorio. Se consideran inmuebles, unidades y espacios compartidos, con posible expansión futura al alquiler general.
- **Mercado (H01):** estudiantes universitarios de Tunja son el público prioritario; la experiencia debe ofrecer búsqueda visual, rápida, moderna y apoyada en mapas y presentar habitaciones y espacios comunes. Las observaciones previas son contexto, no evidencia estadística. No se requiere inventar o realizar encuestas para esta ratificación.
- **MVP:** categorías A y B ratificadas, C fuera del alcance MVP actual. El detalle canónico está en la matriz vinculada arriba.

Estas son ratificaciones actuales. Los documentos y cierres históricos de H00/H01 no están disponibles en el checkout y no se reconstruyen como si hubieran existido en su momento. La procedencia se explica en [recuperación histórica](../fases/F00/H04/recuperacion-contexto-historico.md).

## Orientación provisional de negocio, H02

- Búsqueda gratuita para quienes buscan alojamiento.
- Monetización futura orientada principalmente a anunciantes.
- No se han aprobado planes, precios, periodicidad o proveedor de pagos.
- Los pagos de alquiler entre partes y los pagos comerciales de Ubícate a anunciantes están fuera del MVP actual.

Esta orientación no declara H02 históricamente cerrado. Tarifas, monetización y cualquier transacción futura requieren decisión humana posterior.

## Decisiones pendientes de aprobación humana

- Stack, arquitectura, persistencia y APIs.
- Proveedores externos de mapas/geocodificación, identidad, almacenamiento, hosting y monitoreo.
- Precisión y momento de exposición de ubicación; tratamiento del número de WhatsApp.
- Requisitos y controles de seguridad, privacidad, retención, auditoría y respuesta a incidentes.
- Inclusión efectiva de 360° B01 después de comparar complejidad, rendimiento, costos y seguridad.
- Presupuesto operativo, disponibilidad objetivo, carga prevista y capacidad de mantenimiento.
- Estrategia de pruebas, entornos, respaldos, CI/CD y despliegue.
- Planes comerciales, precios y periodicidad, cuando se reabra esa decisión.
- Nomenclatura y estructura canónica de Fase 1, que no consta en la documentación disponible.

## Autorización de investigación

El 2026-10-16 se autorizó investigar, comparar, documentar y recomendar alternativas técnicas de manera provisional. No se autorizaron selección definitiva, implementación, creación de infraestructura, contratación, dependencias importantes, despliegue, publicación o push. La investigación completada está en [F00-H04](../fases/F00/H04/investigacion-arquitectonica-comparativa.md); su recomendación no es una decisión aprobada.

## Prioridad estratégica Open Source First, 2026-10-16

Dirección estableció priorizar tecnologías open source y servicios de costo cero cuando satisfagan los requisitos funcionales, legales y técnicos, con objetivo de costo mensual USD 0 para el MVP y preferiblemente el lanzamiento. La comparación debe incluir licencia abierta frente a gratuidad comercial, cuotas, riesgo de suspensión o discontinuación, dependencia, autoalojamiento y migración, seguridad, privacidad, rendimiento, mantenimiento y costos al superar cuotas.

Esto aprueba un criterio de evaluación, no una arquitectura, lenguaje, framework, proveedor, base de datos, servicio externo ni gasto. “Gratis” no equivale a código abierto ni demuestra autorización comercial. La investigación comparativa actualiza el análisis de F00-H04; cualquier selección o activación continúa pendiente de aprobación humana.

## Política económica: USD 0 por defecto, 2026-10-16

Dirección aprobó expresamente:

1. Desarrollo: objetivo de infraestructura USD 0 mensuales.
2. Piloto: priorizar funcionamiento gratuito.
3. Producción inicial: mantener USD 0 cuando sea técnica, legal y operativamente sostenible.
4. Priorizar software de código abierto y soluciones portables.
5. No contratar ni activar servicios de pago, facturación o medios de pago sin autorización humana expresa.
6. Toda excepción requiere justificar necesidad, alternativas gratuitas descartadas, costo estimado y consecuencias.
7. Seguridad, privacidad, respaldos y recuperación son requisitos obligatorios antes de operar con usuarios reales.
8. Si no existe una solución gratuita suficientemente segura, presentar la limitación y solicitar decisión; no asumir gastos ni reducir controles.

Esta política es una decisión económica aprobada. No selecciona arquitectura, stack, proveedor, cuenta, servicio externo ni autoriza un gasto concreto. Ninguna alerta o presupuesto se considera un límite de cargos. La evaluación de candidatas continúa en [F00-H04](../fases/F00/H04/viabilidad-costo-cero.md).

**Numeración:** la estructura previa de este documento utiliza encabezados descriptivos y no contiene identificadores numéricos de decisiones. Se conserva esa convención, sin crear una serie nueva de IDs.

## Decisiones históricas de H03

Las aprobaciones de identidad y experiencia visual se mantienen como registro del hito cerrado. Los diseños anteriores solo tienen valor histórico/comparativo. Esta sección no autoriza cambios de paleta, logo ni prototipo.

## Estado de hitos ratificado, 2026-10-16

Dirección aprobó el cierre de F00-H04 después de revisar AC-01 a AC-12 y autorizó abrir F01-H00 para evaluar la arquitectura base del MVP. El acta y el resultado verificable están en [cierre de F00-H04](../fases/F00/H04/cierre-propuesto.md). Esta aprobación no selecciona arquitectura ni proveedor, ni autoriza cuentas, facturación, despliegue o implementación.

El estado global de Fase 0 se registra como **no cerrado por historial incompleto**: F00-H03 y F00-H04 tienen cierres verificables; H00 y H01 tienen ratificaciones actuales, sin evidencia disponible de sus cierres históricos; H02 permanece provisional. No se deduce que los hitos sin artefactos nunca ocurrieron.

## Apertura F01-H01 aprobada por Dirección, 2026-10-30

Dirección aprobó formalmente abrir y ejecutar **F01-H01: Exploración funcional local del MVP** con React + TypeScript, MapLibre GL JS y OpenFreeMap, uso local y ficticio, presupuesto adicional USD 0, instalación de dependencias gratuitas y pruebas locales. Alcance y AC-FE-01 a AC-FE-09, con viewport 320, 390, 768 y 1440 px, están registrados en [F01-H01 Spec](../fases/F01/H01/spec.md). La autorización se limita a este hito y no selecciona la arquitectura productiva definitiva.

F01-H00 permanece abierto; AC-04 continúa parcial, bloqueado y no satisfecho. No se repiten las pruebas de restauración. Supabase/PostgreSQL/PostGIS sigue candidato futuro, pero no se conectará al remoto ni se selecciona como arquitectura productiva por esta apertura.

## Alcance de pruebas de correo de F01-H00, 2026-10-16

Dirección decidió dejar fuera de F01-H00 las pruebas que envían correos reales de confirmación de registro y recuperación de contraseña. No se requiere añadir las direcciones de prueba al equipo Supabase ni contratar/configurar un SMTP externo para completar esta evaluación arquitectónica. La decisión no aprueba cambios de configuración Auth ni afecta la política USD 0.

La entrega de correo, confirmación de cuenta y recuperación deberán evaluarse antes de operar el producto con usuarios reales, como parte del hito de implementación/preparación de piloto que corresponda. F01-H00 documentará las condiciones públicas y límites observados, pero no afirmará que dichos flujos fueron probados. Los demás casos de Auth/Data API que no envíen correo mantienen su estado individual y se realizarán solo dentro de las autorizaciones vigentes.
