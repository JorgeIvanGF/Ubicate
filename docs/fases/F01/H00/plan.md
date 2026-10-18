# Propuesta de plan: F01-H00

**Estado:** plan de evaluación autorizado para ejecución el 2026-10-16. La matriz, los límites del piloto y las cuentas que requieren activación siguen sujetos a aprobación específica. Ver [spec](spec.md), [propuesta](propuesta.md) y [evaluación inicial](evaluacion.md).

## Flujo SDD

1. **Spec:** ratificar entradas, pilotos, umbrales, puertas de decisión y uso de cuentas.
2. **Plan:** aprobar matriz de pruebas, métodos, responsables, datos sintéticos y controles de gasto.
3. **Tasks:** asignar evaluación documental, pruebas locales, pruebas de cuenta, restore, mapa, seguridad y análisis económico.
4. **Implementación de pruebas:** preparar solo harness/configuración de evaluación autorizados, sin implementar funcionalidad de producto.
5. **Pruebas:** ejecutar local primero; probar cuentas solo con aprobación específica y sin billing no autorizado.
6. **Análisis:** calcular resultados reales, límites, brechas, incidentes y costo/operación.
7. **Documentación:** publicar comparativa reproducible, evidencia, limitaciones y alternativas de salida.
8. **Cierre:** obtener aceptación humana de arquitectura base; abrir luego un hito distinto de implementación.

## Secuencia de ejecución propuesta

1. Apertura humana registrada. Acordar aún piloto, objetivos de recuperación, matriz y responsables antes de pruebas externas.
2. Completar análisis local/documental de licencias y términos públicos, arquitectura y queries.
3. Preparar prototipos de prueba desechables con datos ficticios; no construir funcionalidad de producto.
4. Tras autorización específica, ejecutar pruebas de auth, aislamiento de anunciantes, medios, mapas, cuotas y contingencia.
5. Ejecutar copia/restauración independiente y verificar checksums/IDs/relaciones con destino autorizado.
6. Completar matriz de puntuación y análisis de seguridad, carga operativa, costo y migración.
7. Presentar recomendación y someter selección a decisión humana.

## Evidencia y límites

Cada resultado se marca como inspección documental, cálculo, prueba local, prueba de cuenta o revisión humana. Las condiciones de cuenta, restauración, elegibilidad comercial y límites de facturación no pueden etiquetarse como probados mediante solo documentación pública.
