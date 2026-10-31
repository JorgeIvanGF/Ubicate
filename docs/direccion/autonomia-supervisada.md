# Política de autonomía supervisada

## Propósito

Codex coordina y ejecuta el trabajo técnico que esté dentro de un objetivo, alcance y límites autorizados. La dirección del producto conserva las decisiones estratégicas y las aprobaciones humanas que se enumeran en esta política. Esta política no modifica controles del entorno ni concede permisos de herramientas.

## Trabajo autónomo dentro del alcance autorizado

La dirección establece máxima autonomía operativa y mínima intervención humana. Dentro de un alcance autorizado, Codex investiga, diseña, implementa, prueba, corrige, analiza y documenta, y continúa con la siguiente tarea autorizada sin esperar instrucciones adicionales. Resuelve decisiones técnicas ordinarias usando los criterios existentes y ejecuta automáticamente las verificaciones locales permitidas. La metodología SDD conserva trazabilidad por fases e hitos, sin convertir cada paso en una aprobación rutinaria.

Se evitan documentos duplicados, aprobaciones innecesarias y la dependencia de ChatGPT como intermediario obligatorio. No se pide confirmación para actividades ya autorizadas. Cuando una aprobación sea necesaria, se agrupan las operaciones relacionadas en una solicitud concreta con alcance, riesgos y alternativas.

Codex puede:

- Investigar y leer documentación y código disponibles.
- Descomponer el objetivo, redactar criterios verificables y planificar tareas.
- Crear y editar archivos del proyecto.
- Preparar prototipos visuales locales con datos ficticios.
- Generar pruebas y ejecutar validaciones locales autorizadas.
- Analizar resultados, corregir fallos dentro del alcance y repetir verificaciones.
- Actualizar documentación y evidencias del hito.
- Coordinar subagentes para trabajo independiente cuando la sesión los permita, con un responsable de integración y límites de archivos claros.
- Realizar commits locales únicamente cuando el trabajo esté expresamente autorizado y supere los controles de calidad definidos para la tarea.
- Crear y actualizar ramas de trabajo, publicar en esas ramas y abrir Pull Requests Draft cuando el objetivo y alcance estén autorizados por Dirección.

La autorización de una tarea cubre sus pasos técnicos ordinarios y reversibles. No extiende el alcance a decisiones o efectos externos enumerados abajo.

Una autorización queda limitada al alcance, proyecto, recursos y operaciones que describe. No se infieren permisos para ampliar esos límites ni se sustituyen los controles del entorno.

## Decisiones o autorización humana necesarias

Se debe detener el trabajo afectado y solicitar intervención humana antes de:

- Cambiar el alcance funcional o las prioridades del producto.
- Aprobar decisiones relevantes de arquitectura.
- Seleccionar servicios, plataformas o dependencias importantes.
- Hacer cambios sustanciales de seguridad, autenticación o permisos.
- Asumir costos o tomar decisiones con consecuencias económicas.
- Acceder, crear o modificar datos reales.
- Publicar contenido externamente fuera de ramas de trabajo autorizadas, integrar cambios a `main` o desplegar.
- Ejecutar operaciones destructivas o irreversibles.
- Autorizar hooks automáticos, cambiar configuración global de Codex o debilitar controles de seguridad.

La intervención humana se solicita únicamente para estos límites, otros expresamente reservados a dirección o cuando exista un bloqueo que no pueda resolverse de forma segura dentro del alcance autorizado.

Las decisiones pendientes se mantienen etiquetadas como propuestas. Una revisión de prototipo no aprueba automáticamente su identidad gráfica ni sus decisiones técnicas.

## Flujo de ramas y Pull Requests

Dirección aprueba el flujo permanente de ramas independientes y Pull Requests para el desarrollo del proyecto:

- Codex puede crear una rama de trabajo desde el commit vigente de `main`, realizar commits y publicar sus cambios en esa rama cuando el alcance de la tarea esté autorizado.
- Codex puede crear el Pull Request como Draft y actualizar esa misma rama y Pull Request tras revisión, sin aprobación rutinaria por cada corrección.
- ChatGPT revisará el código y la documentación mediante GitHub MCP como revisión independiente; Codex atenderá sus observaciones en la misma rama dentro del alcance aprobado.
- Integrar el Pull Request a `main` requiere aceptación expresa de Dirección. Un review, un estado Draft/Ready o checks verdes no sustituyen esa aceptación.
- Nunca hacer force push, desplegar, habilitar gastos ni ejecutar operaciones destructivas sin autorización específica.
- El repositorio es público: excluir secretos, credenciales, tokens, claves privadas, respaldos, exportaciones y datos personales antes de stagear y publicar.

Este flujo autoriza publicación solo en ramas de trabajo dentro del alcance aprobado. No cambia las protecciones del repositorio ni autoriza modificaciones de configuración, permisos o infraestructura.

## Flujo de ejecución

Para cada tarea autorizada:

1. Leer el contexto canónico y revisar qué está aprobado y qué sigue pendiente.
2. Definir tareas pequeñas con criterios y verificaciones observables.
3. Ejecutar el trabajo dentro del alcance sin confirmaciones para cada paso ordinario.
4. Ejecutar las pruebas y evaluaciones aplicables; registrar evidencia real y límites de la verificación.
5. Corregir los fallos dentro del alcance y repetir la evaluación.
6. Limitar cada unidad a tres iteraciones de corrección. Si no converge, describir la causa y el siguiente paso necesario, sin repetir el mismo intento indefinidamente.
7. Actualizar el estado y la documentación del hito. No marcarlo cerrado hasta cumplir sus criterios de aceptación.

## Uso de subagentes y skills

Cuando haya subagentes disponibles y el trabajo se pueda dividir de forma independiente, asignar a cada uno un objetivo acotado, archivos permitidos, restricciones y evidencia esperada. Mantener un único responsable de integrar cambios. Si no hay soporte, trabajar secuencialmente.

Usar skills ECC solo cuando aporten al trabajo y comprobar que sus comandos, hooks y requisitos correspondan al entorno Codex actual. Una skill de Claude Code no autoriza por sí misma a ejecutar un comando o hook en Codex. No iniciar flujos que exijan una aprobación humana para omitirla después.

## Regla de evidencia

Distinguir entre revisión estática, verificación automatizada y revisión humana. Registrar comandos o métodos ejecutados y sus resultados. No declarar responsive, accesible, probado o aprobado algo que no se verificó con evidencia correspondiente.
