# Propuesta de Tasks: primer hito funcional de exploración

**Estado:** antecedente trasladado a [F01-H01 Tasks](../H01/tasks.md) tras aprobación de apertura de Dirección del 2026-10-30. Se conserva esta copia para trazabilidad; el estado vigente está en H01.

## Entrada y decisiones

- [ ] Aprobar el nombre/número del hito y registrar apertura en el lugar canónico de F01.
- [ ] Aprobar el alcance AC-FE-01 a AC-FE-09 y la primera entrega local ficticia.
- [ ] Resolver si React/TypeScript se adopta para esta unidad, y si MapLibre forma parte del primer incremento.
- [ ] Resolver tiles: proveedor y uso externo con costo USD 0 verificable, o mapa local de demostración hasta tener esa aprobación.
- [ ] Confirmar el modelo de fixtures y las categorías mínimas de zona, características y disponibilidad.
- [ ] Confirmar el contacto como simulación sin número/envío y mantener 360° diferido.

## Preparación e implementación, tras autorización

- [ ] Revisar estado Git, árbol de aplicación existente, recursos aprobados y dependencias instaladas; no modificar H03.
- [ ] Definir tipos locales de inmueble y unidad, con ejemplos completamente ficticios y ubicación aproximada.
- [ ] Crear experiencia responsive de filtros por zona, precio y características.
- [ ] Crear mapa/adaptador cartográfico desacoplado con estados loading, ready, error y retry.
- [ ] Vincular selección de mapa y lista en ambas direcciones, incluyendo navegación por teclado.
- [ ] Crear ficha de inmueble con unidades, atributos, espacios comunes y disponibilidad diferenciados.
- [ ] Añadir modo fallback que conserva lista, filtros y resultados cuando el mapa/tiles no carga.
- [ ] Marcar claramente datos ficticios y eliminar acciones reales de contacto.

## Pruebas y análisis, tras autorización

- [ ] Verificar AC-FE-01 a AC-FE-09 según métodos acordados en Spec/Plan.
- [ ] Registrar resultados en móvil 390 × 844 y escritorio 1440 × 1000, consola, errores simulados, navegación teclado y solicitudes de red.
- [ ] Confirmar ausencia de conexión al Supabase remoto y de secretos en el código.
- [ ] Revisar que la identidad aprobada no haya cambiado y documentar diferencias funcionales frente a H03.
- [ ] Presentar evidencia, brechas y propuesta de cierre a Dirección; no cerrar automáticamente.

## Fuera de estas Tasks

- No repetir PoC PostGIS/RLS ni Auth/JWT/Data API/RLS.
- No diagnosticar o repetir el restore AC-04; permanece parcial/bloqueado y requiere una autorización separada para reabrir diagnóstico.
- No borrar, reiniciar ni modificar contenedores, redes o volúmenes preservados del ensayo.
- No modificar Supabase remoto, crear cuentas, activar servicios, instalar dependencias antes de aprobación, desplegar, gastar o hacer `git push`.
