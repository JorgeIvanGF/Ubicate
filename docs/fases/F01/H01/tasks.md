# Tasks: F01-H01 Exploración funcional local del MVP

**Estado:** apertura autorizada 2026-10-30. Se conserva F01-H00 abierto; AC-04 parcial/bloqueado. Sin conexión Supabase remota ni cambios productivos.

## Spec, plan y preparación

- [x] Revisar AGENTS, decisiones, F00-H03 y propuesta previa.
- [x] Inspeccionar estado Git antes de editar; preservar cambios anteriores.
- [x] Formalizar este hito y conservar la propuesta original como antecedente trazable.
- [x] Verificar documentación oficial OpenFreeMap de términos, privacidad y atribución.
- [x] Registrar baseline técnico y dependencias instaladas en el README de la aplicación y el lockfile.

## Implementación

- [x] Crear aplicación local React + TypeScript.
- [x] Incorporar tokens/logo aprobados sin cambios de identidad.
- [x] Modelar fixtures ficticios de alojamientos, unidades, precios, características y disponibilidad.
- [x] Implementar filtros combinables y estado vacío.
- [x] Implementar lista, detalle y sincronización de selección.
- [x] Crear adaptador cartográfico y mapa MapLibre/OpenFreeMap con marcadores ficticios y atribución activa.
- [x] Implementar error/reintento y fallback de lista conservando filtros y detalle.
- [x] Implementar estructura responsive y navegación por teclado en controles nativos; comprobación manual sigue pendiente.

## Verificación, análisis y entrega

- [x] Verificar funciones de dominio cubiertas por pruebas unitarias y generar build local; evidencia y alcance en `evidencia.md`.
- [x] Ejecutar `npm audit --audit-level=moderate`; cero vulnerabilidades reportadas.
- [x] Ejecutar `git diff --check`; sin errores.
- [ ] Completar verificación interactiva AC-FE-01 a AC-FE-09; estados individualizados en `evidencia.md`.
- [ ] Verificar 320, 390, 768 y 1440 px, desbordamiento y controles esenciales en navegador.
- [ ] Revisar foco, labels, semántica y estados accesibles en navegador.
- [ ] Inspeccionar solicitudes externas en Network: OpenFreeMap necesario; cero requests a Supabase; ningún secreto.
- [ ] Registrar problemas y hasta tres iteraciones de corrección por unidad de trabajo.
- [x] Documentar comandos ejecutados, resultados, limitaciones y pasos para reproducir recorrido.
- [ ] Presentar para aceptación de Dirección. No cerrar automáticamente.

## Límites

- No tocar F00-H03 ni repetir/diagnosticar AC-04.
- No usar Supabase remoto, datos personales, alojamientos ni fotos reales.
- No desplegar, gastar ni activar servicios de pago. La publicación en GitHub se limita a la autorización expresa del 2026-10-31.
- No descargar masivamente ni almacenar tiles offline.
- No eliminar ni cambiar recursos Docker/backups preservados.
