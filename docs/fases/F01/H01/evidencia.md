# Evidencia de aceptación: F01-H01

**Estado:** ejecución de build y pruebas unitarias documentada; verificación interactiva en navegador pendiente. El hito continúa abierto.

## Comandos ejecutados

Desde `apps/exploracion-local`:

Baseline observado: Node.js `v24.18.0`, npm `11.16.0`. Las versiones de dependencias instaladas quedan fijadas por `package-lock.json`.

| Comando | Resultado observado |
| --- | --- |
| `npm.cmd run build` | PASS: TypeScript y Vite completaron. El bundle inicial es 237 kB minificado (74 kB gzip); el módulo MapLibre diferido es 1.079 kB (293 kB gzip), aún por encima del umbral de advertencia de Vite. |
| `npm.cmd test` | PASS: 1 archivo, 3 pruebas. Combinación de zona/precio/características, resultado vacío sin mutar fixtures, y unidades con precio/disponibilidad. |
| `npm.cmd audit --audit-level=moderate` | PASS: 0 vulnerabilidades reportadas por npm para el árbol instalado. |
| `git diff --check` | PASS: sin errores de whitespace; Git mostró únicamente avisos de conversión LF/CRLF en documentos existentes. |

La primera compilación encontró incompatibilidades de importación/tipos de MapLibre y CSS; se corrigieron. La carga diferida de MapLibre redujo el bundle inicial, aunque su módulo separado todavía produce la advertencia de tamaño indicada.

## Matriz AC-FE

| Criterio | Estado | Evidencia / pendiente |
| --- | --- | --- |
| AC-FE-01 Filtros | Parcial | La función de dominio tiene prueba unitaria para combinar zona, máximo de precio y característica. Falta recorrer filtros, limpieza y actualización de lista/marcadores en navegador. |
| AC-FE-02 Mapa/lista y fallback | Pendiente de navegador | El código conecta selección y conserva resultados fuera del adaptador; el control de fallo y reintento están implementados. Falta probar interacción en ambas direcciones y que lista/detalle sigan operables tras el fallo. |
| AC-FE-03 Inmueble/unidades | Parcial | Hay fixtures con propiedades multiunidad y prueba de precios/disponibilidad por unidad. Falta verificar visualmente ficha y separación de características. |
| AC-FE-04 Ubicación aproximada | Parcial | Solo hay puntos sintéticos dentro de Tunja y la interfaz los rotula aproximados. La revisión visual y semántica del mapa queda pendiente. |
| AC-FE-05 Responsive | Pendiente | No se han verificado 320, 390, 768 ni 1440 px en navegador. |
| AC-FE-06 Error de mapa | Pendiente de navegador | El componente implementa estado de error, CTA de lista y reintento; falta ejecutar tanto simulación como fallo real de red. |
| AC-FE-07 Datos/contacto | Parcial | Fixtures y recursos de imagen son ficticios/ilustrativos; no hay enlaces WhatsApp ni visor 360°. Falta recorrer interfaz y confirmar comportamiento. |
| AC-FE-08 Identidad/accesibilidad | Pendiente de navegador | El logo aprobado y colores H03 se reutilizan. Hay labels, botones nativos, foco definido y estado anunciado; falta recorrido por teclado y revisión de contraste/árbol accesible. |
| AC-FE-09 Aislamiento | Parcial | Revisión estática de fuentes y manifiestos no encuentra cliente/URL Supabase ni credenciales. OpenFreeMap es la única dependencia externa de datos runtime prevista. Falta inspeccionar Network en navegador y auditar el paquete staged. |

No se registran AC como aprobados por revisión humana. Build/test no verifican layout, interacciones de MapLibre, consola, atribución renderizada ni accesibilidad completa.

## Seguridad de publicación

El paquete contiene código de cliente sin secretos, fixtures artificiales, lockfile y el logo aprobado. No contiene `.env`, credenciales Supabase, tokens, claves, backups, archivos EFS ni medios de anuncios reales. `node_modules/` y `dist/` están excluidos por `.gitignore`. Los hashes y detalles descriptivos del ensayo AC-04 en los documentos son evidencia histórica, no archivos de respaldo; la exportación cifrada y el manifiesto permanecen fuera del repositorio.

## Pendiente antes de aceptación de Dirección

- Ejecutar recorrido en navegador aislado y registrar solicitudes, consola y atribución.
- Revisar 320 × 844, 390 × 844, 768 × 1024 y 1440 × 1000, sin scroll horizontal no intencional.
- Probar teclado y foco, filtro vacío, sincronización bidireccional, detalle y fallo/reintento de mapa.
- Revisar Lighthouse/axe o evaluación equivalente y resolver defectos dentro del máximo de tres iteraciones.
- Presentar capturas y resultados reales a Dirección. No cerrar automáticamente F01-H01.
