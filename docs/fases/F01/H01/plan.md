# Plan: F01-H01 Exploración funcional local del MVP

**Estado:** ejecución y verificación técnica local completadas; entrega pendiente de revisión de Dirección. Ver [Spec](spec.md), [Tasks](tasks.md) y [Evidencia](evidencia.md).

## Flujo

1. Formalizar la propuesta previa sin perder la ruta histórica.
2. Revisar árbol de trabajo, prototipo H03, tokens y fuentes de fixtures existentes.
3. Preparar proyecto React + TypeScript y estructura local separada.
4. Implementar fixtures/modelo inmueble-unidad, filtros y vista lista/detalle.
5. Implementar adaptador MapLibre/OpenFreeMap, marcadores ficticios, atribución y manejo de errores/reintento.
6. Verificar AC-FE-01 a AC-FE-09 a 320, 390, 768 y 1440 px; revisar teclado, accesibilidad básica, consola y requests.
7. Analizar brechas y documentar resultados reproducibles sin cerrar el hito.

## Evidencia y alcance de verificación

Registrar comandos ejecutados, versión de Node/dependencias, capturas o pasos manuales, requests externos observados y cualquier limitación. Una compilación no sustituye la revisión de interacción o responsive. No usar Supabase, fixtures reales, fotos sin licencia ni cargas masivas/offline de tiles.

## Riesgos de unidad

OpenFreeMap es servicio público sin SLA, puede estar indisponible o cambiar. La lista y el detalle no dependen de su disponibilidad. MapLibre requiere altura calculada del contenedor y resize correcto en cambios responsive. No copiar el hero de H03, cuya imagen preferida no tiene derechos verificados.
