# Instrucciones para Codex

## Método

Mantén el flujo del proyecto: ENTENDER → DISEÑAR → IMPLEMENTAR → PROBAR → ANALIZAR → DOCUMENTAR → CONTINUAR.

Cada hito debe seguir: Spec → Plan → Tasks → Implementación → Pruebas → Análisis → Documentación → Cierre. Conserva el orden y documenta el resultado antes de cerrar el hito.

## Límites de decisión

Las decisiones sobre arquitectura, stack tecnológico, seguridad, servicios externos y despliegues requieren aprobación humana. No las presentes como aprobadas mientras estén pendientes.

No habilites hooks automáticos ni instales dependencias sin una solicitud explícita. No implementes la aplicación de producción hasta que el alcance y las decisiones necesarias estén aprobados. Los prototipos locales con datos ficticios sí pueden prepararse cuando estén incluidos en el alcance autorizado.

## Autonomía supervisada

Sigue la política canónica en [`docs/direccion/autonomia-supervisada.md`](docs/direccion/autonomia-supervisada.md). Lee también `README.md` y los documentos pertinentes de `docs/direccion/` y `docs/fases/` antes de cambiar el alcance o tomar decisiones de producto.

Con una tarea autorizada y sus límites definidos, investiga, diseña, implementa, prueba, corrige, analiza y documenta autónomamente. Continúa con la siguiente tarea ya autorizada sin esperar instrucciones adicionales. Resuelve decisiones técnicas ordinarias con los criterios aprobados y ejecuta las verificaciones locales permitidas sin confirmaciones rutinarias.

Mantén trazabilidad SDD por fases e hitos, evita duplicar documentos y no dependas de ChatGPT como intermediario obligatorio. No solicites confirmación para pasos técnicos ya autorizados. Agrupa en una sola solicitud las operaciones relacionadas cuando se requiera aprobación, indicando alcance, riesgos y alternativas.

Solicita intervención humana solo ante cambios estratégicos, arquitectura significativa, seguridad sensible, escrituras remotas no autorizadas, gastos, despliegues, operaciones destructivas o decisiones expresamente reservadas a dirección. Una autorización se limita al alcance, proyecto y recursos descritos; no presupongas permisos adicionales.

Estas reglas no amplían permisos del entorno ni sustituyen controles de seguridad, restricciones del hito o autorizaciones específicas. Limita a tres las iteraciones de corrección por unidad de trabajo; si no converge o cruza un límite, documenta el bloqueo y solicita intervención. No afirmes que una prueba pasó si no la ejecutaste.

## Documentación

Consulta `README.md` para orientación y `docs/direccion/` para la visión, el alcance y las decisiones vigentes. Distingue las decisiones aprobadas de las propuestas pendientes y actualiza el documento dueño del tema cuando cambie.
