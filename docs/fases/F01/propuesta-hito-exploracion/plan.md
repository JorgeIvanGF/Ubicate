# Propuesta de Plan: primer hito funcional de exploración

**Estado:** antecedente trasladado a [F01-H01 Plan](../H01/plan.md) tras aprobación de apertura de Dirección del 2026-10-30. Se conserva esta copia para trazabilidad; la versión vigente está en H01.

## Secuencia SDD

1. **Spec:** ratificar alcance, criterios AC-FE-01 a AC-FE-09 y las decisiones reservadas a Dirección.
2. **Plan:** confirmar herramienta/framework, fuente y modalidad del mapa, restricciones de red y verificación local.
3. **Tasks:** inventariar el prototipo F00-H03, fixtures existentes, paquetes y estado del repositorio; mapear los patrones visuales aprobados sin reabrir diseño.
4. **Implementación:** construir primero el recorrido con fixtures locales; aislar el adaptador cartográfico para que lista y detalle no dependan de tiles.
5. **Pruebas:** verificar filtros, sincronización, detalle, fallback mapa, teclado y responsive en los tamaños definidos; confirmar que no hay requests al Supabase remoto.
6. **Análisis:** registrar resultados, limitaciones, dependencias, tratamiento de error y diferencias respecto a F00-H03.
7. **Documentación:** actualizar Tasks, evidencia de aceptación, README del prototipo funcional y decisiones técnicas que Dirección apruebe.
8. **Cierre:** presentar evidencia y pendientes para aceptación humana; no cerrar automáticamente.

## Fases de ejecución propuestas

### A. Preparación tras aprobación

- Confirmar la nomenclatura/número del hito y su propietario documental.
- Leer y preservar los patrones del prototipo aceptado; no copiar la foto local con licencia no verificada al nuevo entregable ni cambiar logotipo/paleta.
- Confirmar que los recursos Docker del restore siguen preservados cuando el daemon vuelva a estar disponible, en una revisión aparte de solo lectura. No iniciarlos ni alterarlos como requisito de la primera entrega.
- Determinar si los tiles externos quedan autorizados; si no, usar modo local de demostración y probar fallback sin conexión.

### B. Recorrido funcional

- Definir modelo tipado local de inmueble, unidad, zona aproximada, precio, características y disponibilidad.
- Implementar filtros combinables y estados vacío/error.
- Implementar mapa/lista sincronizados y controles de selección accesibles.
- Implementar ficha de inmueble/unidades y navegación responsive.
- Incorporar estados de fallo y reintento del mapa sin bloquear búsqueda/lista.

### C. Verificación y documentación

- Probar criterios AC-FE-01 a AC-FE-09 únicamente después de autorización de implementación.
- Registrar dispositivos/viewport, navegador, solicitudes de red observadas y pasos de reproducción.
- No afirmar aceptación sin revisión de la evidencia por Dirección cuando corresponda.

## Límites operativos

Trabajo local y fixtures ficticios. Sin Supabase remoto, escrituras externas, cuentas, gastos, despliegue, push ni pruebas de recuperación. Dependencias, framework y tiles quedan sujetos a aprobación previa. Las tres iteraciones máximas de corrección por unidad se mantienen conforme a la política de autonomía supervisada.
