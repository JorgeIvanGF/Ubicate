# Propuesta de spec: F01-H00

**Estado:** abierto por autorización de dirección del 2026-10-16; evaluación documental/local iniciada. La puerta para cuenta de prueba está descrita en [protocolo técnico](protocolo-pruebas-tecnicas.md). No autoriza facturación, despliegue, selección o implementación. Ver [propuesta completa](propuesta.md) y [evaluación inicial](evaluacion.md).

## Objetivo

Evaluar y recomendar una arquitectura base para el MVP mediante criterios aprobados y pruebas comparables. Contrastar A integrada, B modular y autohospedaje como referencia. La dirección aprueba cualquier selección.

## Alcance

- Candidatas con frontend, backend, datos geográficos, auth, correo, fotos, mapa, backup, restore y despliegue.
- Candidatas expresamente autorizadas para evaluación inicial el 2026-10-16: Supabase Free, MapLibre GL JS y OpenFreeMap. La autorización se limita a evaluación y no implica elección definitiva.
- Escenarios 200/1.000/5.000 y piloto controlado propuesto de hasta 200 anuncios.
- Pruebas con datos sintéticos y condiciones de proveedor/licencia/comercialidad.
- Pruebas de seguridad, recuperación, límites, consumo, experiencia de búsqueda por sectores de Tunja y resiliencia.

## Fuera de alcance

- Construir la aplicación o migrar el prototipo H03.
- Implementar backend o arquitectura productiva.
- Elegir proveedor/stack o aprobar gastos.
- Crear cuentas, aceptar términos, asociar pagos, activar billing, enviar correo real o desplegar sin la autorización externa específica descrita en el protocolo.
- Probar con datos personales, viviendas reales o fotos sin permiso.

## Requisitos de entrada

La apertura y el nombre del hito fueron autorizados. Antes de ejecutar las pruebas externas, dirección debe decidir los límites/datos del piloto, alcance contable de costos de infraestructura/operación, RPO/RTO y disponibilidad, responsabilidades operativas, precisión pública de ubicación y autorización condicionada de los recursos detallados en el protocolo. La política USD 0 por defecto ya fue aprobada y debe aplicarse como restricción.

## Criterios de aceptación

Aplican los AC-01 a AC-10 de [propuesta.md](propuesta.md). En particular, seguridad, legalidad/comercialidad, restauración, ajuste funcional y ausencia de gasto no autorizado son puertas obligatorias. Una candidata que no pase una puerta no puede seleccionarse por su bajo costo o velocidad.

## Cierre

Requiere resultados trazables, riesgos residuales, recomendación y una decisión explícita de dirección. El cierre no autoriza desarrollo o despliegue, que necesitarán hito separado.
