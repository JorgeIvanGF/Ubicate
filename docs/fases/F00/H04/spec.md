# F00-H04: Validación integral de Fase 0 y preparación de decisiones técnicas

## Estado

**CERRADO el 2026-10-16** tras la aprobación de dirección y la comprobación de AC-01 a AC-12 registrada en [acta de cierre](cierre-propuesto.md). No se reconstruyen cierres históricos H00-H02 y no se han seleccionado tecnologías.

## Spec

Validar el estado documental disponible de F00, registrar ratificaciones actuales sin reescribir el pasado, consolidar el alcance MVP ratificado, investigar alternativas arquitectónicas de forma comparativa y emitir un diagnóstico para que dirección pueda decidir la siguiente etapa. La investigación puede recomendar provisionalmente, pero no seleccionar stack, proveedor, arquitectura, controles de seguridad, estrategia de pruebas o despliegue.

## Contexto verificado al 2026-10-16

- El checkout contiene README, dirección de producto, política de autonomía y documentación de F00-H03.
- F00-H03 fue aceptado y cerrado por dirección de producto el 2026-10-16, dentro del alcance de prototipo local y documentación.
- No se encontraron los documentos de H00, H01 ni H02 en el checkout actual. Su estado, aprobaciones, artefactos y decisiones no se pueden verificar.
- Dirección ratificó el 2026-10-16 la visión actual de H00, el contexto de mercado H01 y el núcleo MVP. Estas ratificaciones no prueban ni declaran el cierre histórico de dichos hitos.
- H02 se mantiene como orientación provisional: búsqueda gratuita, monetización futura orientada a anunciantes, sin planes, tarifas, periodicidad o proveedor de pagos aprobados. Pagos de alquiler y pagos de Ubícate a anunciantes están fuera del MVP ratificado.
- La matriz A/B/C ratificada se encuentra en [alcance MVP](propuesta-alcance-mvp.md); su evidencia histórica y sus límites en [recuperación histórica](recuperacion-contexto-historico.md).
- La [investigación arquitectónica comparativa](investigacion-arquitectonica-comparativa.md) se preparó con fuentes oficiales consultadas el 2026-10-16. Sus opciones y recomendaciones son provisionales.
- Dirección incorporó el criterio estratégico de priorizar open source y costo cero cuando los requisitos funcionales, legales y técnicos se cumplan. La investigación amplía criterios de licencias, uso comercial, cuotas, salida del proveedor y costos a 200, 1.000 y 5.000 anuncios. No se elige arquitectura ni se valida un servicio.
- Dirección aprobó el 2026-10-16 la política económica “USD 0 por defecto, con gastos únicamente mediante autorización humana expresa”. Los criterios y excepciones están en [decisiones](../../../direccion/decisiones.md). Esto no selecciona proveedor ni autoriza gasto.
- La revisión focalizada de autenticación, correo de recuperación, copias/restauración, mapas, almacenamiento de imágenes, hosting, backend, límites y prevención de cargos se documenta en [viabilidad costo cero](viabilidad-costo-cero.md). Los permisos y condiciones de cuenta no verificados quedan como tareas que requieren autorización posterior.
- La auditoría final y el cierre están en [acta de cierre](cierre-propuesto.md). Dirección autorizó F01-H00 y las tareas de evaluación están en [su spec](../../F01/H00/spec.md), [plan](../../F01/H00/plan.md) y [tasks](../../F01/H00/tasks.md).

## Objetivo y alcance

1. Inventariar los artefactos canónicos de Fase 0 y anotar faltantes y contradicciones.
2. Verificar que las decisiones del producto y del prototipo se etiqueten como aprobadas, propuestas o pendientes.
3. Registrar la ratificación actual, la priorización A/B/C y las decisiones todavía provisionales.
4. Comparar alternativas de arquitectura, interfaz, datos, geolocalización, multimedia, identidad, seguridad, costos, pruebas y operación con fuentes verificables.
   - Incluir al menos tres opciones completas: máximo de OSS/cuotas gratuitas, opción modular portable con servicios gratuitos candidatos y autoalojamiento con costo y carga operativa.
   - Diferenciar código abierto, software gratuito y servicio propietario de cuota gratuita; evaluar permiso comercial, límites, suspensión, salida y primer umbral de cuota superado en escenarios explícitos.
5. Identificar requisitos, supuestos, riesgos y decisiones que necesitan validación humana antes de seleccionar arquitectura.
6. Proponer la siguiente estructura SDD sin inventar una numeración de fase o hito que no esté documentada.
7. Resolver incertidumbres económicas específicas con arquitecturas A/B completas y escenarios comparables de 200, 1.000 y 5.000 anuncios; clasificar límites publicados, estimaciones, costos no demostrados y comprobaciones que requieren cuenta.

La matriz A/B/C quedó ratificada por dirección el 2026-10-16. H02 permanece provisional; los pagos dentro de Ubícate no forman parte del MVP. Los detalles técnicos y de costos siguen sujetos a aprobación.

## Fuera de alcance

- Cerrar Fase 0 si no se encuentran o validan H00-H02.
- Implementar arquitectura, base de datos, APIs, autenticación, back end o aplicación productiva.
- Seleccionar stack, servicios externos, proveedor cartográfico, infraestructura, estrategia de despliegue o compromisos de costos.
- Crear cuentas, usar datos reales, publicar medios o modificar otros proyectos.
- Inventar investigación de mercado, entrevistas, precios, demanda o resultados comerciales.
- Implementar el visor 360°; fotos de anuncio y panoramas reales requieren recursos y requisitos posteriores.

## Criterios de aceptación

- **AC-01 Inventario:** se informa qué hitos/documentos de F00 están disponibles y se distinguen ausencias de estados verificados.
- **AC-01a Procedencia:** se registra el contexto aportado, la ratificación actual y sus límites; no se recrean originales ni cierres históricos.
- **AC-02 Consistencia:** cada afirmación vigente de visión, identidad, flujo y técnica se clasifica y sus contradicciones conocidas quedan registradas.
- **AC-03 Decisiones:** hay matriz A/B/C ratificada y clasificación de decisiones por autoridad, dependencia y posibilidad de diferir.
- **AC-04 Preparación:** se emite diagnóstico explícito con evidencias, recomendaciones provisionales y decisiones humanas pendientes antes de aprobar arquitectura.
- **AC-04a Tarifas:** se documenta que pagos en la aplicación están excluidos y los planes/tarifas no aprobados se pueden diferir; se exponen sus efectos sin diseñar cobros.
- **AC-05 Plan:** spec, plan y tasks describen el trabajo, pruebas, análisis, documentación y condiciones de cierre conforme a SDD.
- **AC-05a Hito siguiente:** se registra la investigación autorizada y se propone el siguiente paso SDD sin crear una fase o numeración canónica no verificada.
- **AC-06 Límites:** no se aprueba ni implementa una decisión estratégica o un servicio externo durante H04.
- **AC-07 OSS/costo:** la prioridad estratégica y sus límites quedan registrados; comparación con al menos tres arquitecturas y escenarios de 200/1.000/5.000 anuncios distingue licencia, servicio, cuotas, costo y operación sin presentar supuestos como pronósticos.
- **AC-08 Viabilidad USD 0:** comparar A integrada y B desacoplada sin favorecer modularidad; mostrar autenticación/recuperación, respaldo/restauración, mapa Tunja, medios, hosting/backend, límites, topes de cargos, escenarios de consumo, salida y riesgos.
- **AC-09 Evidencia comercial:** distinguir términos públicos, inferencias y condiciones de cuenta no probadas; no recomendar SMTP de prueba ni presentar cuota gratuita como permiso comercial certificado.
- **AC-10 Recuperación y gasto:** presentar controles mínimos de seguridad/recuperación, contingencia ante suspensión y lista de activaciones que requieren autorización. Aplicar la política económica aprobada sin convertirla en selección de arquitectura o permiso de gasto.
- **AC-11 Transición:** entregar auditoría de cierre y propuesta SDD del hito siguiente; mantener H04 abierto hasta aceptación humana. **Resultado:** cumplido; dirección aceptó el diagnóstico y abrió F01-H00 el 2026-10-16. Las pruebas de cuenta/producción pasan al alcance autorizado correspondiente.
- **AC-12 Política económica:** registrar y aplicar la política USD 0 por defecto aprobada expresamente; no habilitar gasto o facturación por esa decisión.

## Entradas canónicas

- [README del proyecto](../../../../README.md)
- [Visión y alcance](../../../direccion/vision-y-alcance.md)
- [Decisiones](../../../direccion/decisiones.md)
- [Autonomía supervisada](../../../direccion/autonomia-supervisada.md)
- [Cierre H03](../H03/hito.md)

## Cierre

Dirección aprobó el cierre de H04 el 2026-10-16 después de verificar sus doce criterios. Las comprobaciones técnicas de cuentas, servicios, geografía y restauración continúan como tareas de evaluación en F01-H00; ninguna arquitectura o proveedor está seleccionado.
