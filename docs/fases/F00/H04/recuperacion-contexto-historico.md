# Recuperación de contexto histórico F00-H00 a H02

**Fecha de revisión:** 2026-10-16
**Estado:** registro de procedencia histórica más ratificación actual del 2026-10-16. Esta ratificación no equivale a recuperar originales ni a declarar cierres históricos H00-H02.

## Fuentes revisadas

1. Archivos y documentación existentes en el checkout, en especial `README.md`, `docs/direccion/vision-y-alcance.md`, `docs/direccion/decisiones.md`, `docs/fases/F00/H03/` y los artefactos H04 existentes.
2. Historial local Git, ramas, tags y referencias remotas visibles.
3. La síntesis contextual anterior, entregada como fuente secundaria, y la instrucción de dirección del 2026-10-16 que ratifica decisiones vigentes.

## Resultado de la búsqueda de originales

- El historial local visible contiene `3e8584e` (commit raíz de preparación/H03) y `b8a123a` (cierre H03 e inicio H04). No hay commits adicionales en el historial visible que recuperen H00-H02.
- La única rama local es `main`. `git ls-remote --heads origin` y `git ls-remote --tags origin` no devolvieron referencias en esta consulta. No se hizo fetch ni se cambió ninguna referencia.
- El árbol versionado disponible no contiene directorios o entregables de H00, H01 o H02. No se encontraron actas, aprobaciones, especificaciones de dichos hitos, encuestas, entrevistas ni análisis de mercado.

**Conclusión de evidencia:** no se recuperó ningún artefacto original H00-H02. La ausencia en los refs y el checkout consultados no prueba que esos hitos nunca se hayan realizado o documentado en otra ubicación.

## Síntesis por hito y procedencia

| Hito | Contexto recibido | Coincidencia documental | Nivel de certeza y estado |
| --- | --- | --- | --- |
| F00-H00, visión | Visión y mercado piloto descritos en la ratificación humana del 2026-10-16 | README y `vision-y-alcance.md` describían algunos elementos antes de la ratificación; ahora la ratificación actual se registra en `decisiones.md` | Ratificada actualmente. Original y cierre histórico no recuperados ni declarados |
| F00-H01, mercado | Tunja y estudiantes universitarios ratificados como contexto vigente el 2026-10-16 | Documentación del proyecto ya describía Tunja y mapa; no hay evidencia primaria de entrevistas, encuestas, estadísticas ni análisis competitivo | Ratificado actualmente como orientación de mercado, no como validación estadística. Original y cierre histórico no recuperados |
| F00-H02, negocio | Orientación provisional ratificada el 2026-10-16: búsqueda gratuita, monetización futura a anunciantes, sin planes/precios/proveedor de pago; pagos fuera del MVP | Documentos previos registraban monetización prevista, con términos comerciales pendientes | Orientación vigente provisional. No se declara H02 históricamente cerrado |

## Estados que deben conservarse distintos

- **Evidencia original recuperada:** ninguna para H00, H01 o H02.
- **Contexto histórico aportado:** los puntos de la tabla anterior, suministrados por dirección como fuente secundaria para esta consolidación.
- **Coincidencias en documentación actual:** visión inicial en Tunja, mapa, uso móvil/escritorio, expansión posible y monetización orientada a anunciantes como intención.
- **Aprobaciones humanas confirmadas:** logo, paleta, dirección D-UX-004 y recorrido público del prototipo, registradas como decisiones de H03. No convierten automáticamente el mercado, el modelo comercial ni el alcance de MVP en aprobaciones.
- **Pendiente:** evidencia de aprobación/cierre histórico H00-H02, si existiera fuera del checkout. Los criterios funcionales A/B/C ya están ratificados actualmente; el modelo H02 sigue provisional.
- **Medio visual H03:** dirección aprobó el recurso preferido para el prototipo local, pero sus derechos siguen sin verificar. La foto Pexels usada como fallback en checkout limpio permite abrir el prototipo, pero no es visualmente idéntica a la aprobada; antes de publicar se debe obtener un recurso con derechos claros que conserve esa dirección visual.

## Ratificación actual recibida el 2026-10-16

Dirección ratificó la visión de producto asociada a H00, el contexto de mercado asociado a H01 y el alcance MVP A/B/C. Esta decisión permite registrar su vigencia actual, con la fuente del mandato en el adjunto recibido para F00-H04. No se recibió evidencia primaria adicional ni se afirmó que los hitos se hubieran cerrado históricamente en esta fecha.

- **H00:** visión de plataforma digital de descubrimiento de alojamientos, estudiantes universitarios como público inicial, Tunja como piloto, experiencia responsive, búsqueda geográfica central y exploración pública sin registro obligatorio; expansión futura y presentación de inmuebles/unidades/espacios compartidos.
- **H01:** Tunja como mercado piloto y estudiantes universitarios como público prioritario; búsqueda visual, rápida y apoyada en mapas; importancia de mostrar habitaciones y espacios comunes. Observaciones previas siguen siendo contexto, no estadística. No se requieren encuestas para esta ratificación.
- **H02:** orientación provisional ratificada. Búsqueda gratuita para quien busca; monetización futura orientada a anunciantes; sin planes, precios, periodicidad o proveedor de pagos aprobados. Pagos entre arrendatario y propietario y cobros de Ubícate a anunciantes quedan fuera del MVP actual. No se declara H02 históricamente cerrado.
- **MVP:** categoría A aprobada, B aprobada como opcional/condicionada y C excluida. La matriz completa es [propuesta-alcance-mvp.md](propuesta-alcance-mvp.md), cuyo título conserva la ruta histórica pero su estado actual es ratificado.

La [investigación arquitectónica comparativa](investigacion-arquitectonica-comparativa.md) utiliza estas decisiones vigentes y mantiene sus recomendaciones técnicas como propuestas.

## Acción documental pendiente

Conservar este registro como fuente de procedencia. Dirección puede aportar originales externos más adelante, pero su ausencia no bloquea la comparación autorizada. No fabricar archivos H00-H02 que aparenten ser contemporáneos ni completar firmas, fechas, métodos de investigación o aprobaciones históricas ausentes.
