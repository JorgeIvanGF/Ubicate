# Spec: PoC Auth + Data API + RLS

**Estado vigente, 2026-10-17:** la validación esencial especificada aquí fue ejecutada y pasó; evidencia y límites en [README](README.md). Esta autorización histórica no habilita nuevas escrituras ni otras operaciones. Se conservan abajo los requisitos que guiaron la PoC; no repetir los escenarios esenciales ya aprobados.

## Objetivo

Comprobar si la PoC PostgreSQL/PostGIS/RLS previamente validada se comporta de forma equivalente cuando identidades auténticas emitidas por Supabase Auth acceden por HTTP a la Data API, con grants y RLS reales, manteniendo USD 0 y protegiendo los fixtures base.

## Requisitos

1. Usar únicamente `ubicate-f01h00-pruebas`, ref `ivzjijagahkczdghoqkz`; validar identidad y plan en el preflight.
2. No repetir migración. No modificar ni borrar los seis fixtures base para enlazarlos con Auth.
3. Las solicitudes REST usan clave publicable y, en casos autenticados, un access token real. Nunca usar secret/service_role para probar políticas RLS ni en navegador.
4. Evaluar sesión, expiración, renovación, autorización y errores de token. Por decisión de dirección del 2026-10-16, no enviar correos reales ni probar confirmación/recuperación por email durante F01-H00; documentar esas capacidades como no verificadas y trasladarlas a una puerta previa a usuarios reales.
5. Probar respuestas y efectos: grants, RLS, columnas, publicación, lectura/escritura, acceso cruzado y no enumeración.
6. Identificar la fuente de rol administrador. No confiar en `user_metadata` ni en claims inventados por cliente.
7. Preservar los fixtures existentes con filas adicionales distinguibles y una reversión previamente aprobada, o detenerse si no puede garantizarse la integridad.
8. No exponer secretos, emails, contraseñas, JWT ni enlaces completos de confirmación/reset en repositorio o logs.
9. Mantener ubicaciones estrictamente sintéticas. Exponer el campo `public_location` en la prueba solo para documentar el comportamiento actual, sin interpretarlo como aceptación de coordenadas exactas en producción.
10. No realizar prueba HTTP geoespacial hasta que se apruebe una función RPC de búsqueda segura y su contrato. La suite SQL previa no prueba esa ruta HTTP.

## Criterios de aceptación propuestos

- **A-HTTP-01:** una petición sin bearer usa rol `anon` y solo obtiene registros publicados y campos concedidos.
- **A-HTTP-02:** acceso a borradores, perfiles de otros anunciantes y `owner_id` se deniega o no devuelve filas/columnas; el resultado se diferencia entre ausencia de GRANT (`42501`) y filtrado RLS.
- **A-HTTP-03:** JWT válido de A/B ve sus registros; ninguna operación permite leer o alterar recursos ajenos, incluso con UUID conocido.
- **A-HTTP-04:** `user_metadata.ubicate_role=admin` autodeclarado no habilita acciones administrativas.
- **A-HTTP-05:** solo una identidad con rol administrativo proveniente de una fuente de confianza puede revisar/moderar; no se cambia el mecanismo vigente durante la PoC.
- **A-HTTP-06:** token malformado, inválido o naturalmente expirado no obtiene derechos de usuario; no se permite fallback a datos autenticados.
- **A-AUTH-02:** login, logout, refresh y expiración coinciden con la respuesta observada; no se asume que logout invalida inmediatamente un JWT ya emitido.
- **A-AUTH-EMAIL-DEFERRED:** envío, confirmación y recuperación por correo no forman parte de la aceptación de esta PoC en F01-H00. Se registran como no probados y deben validarse antes de operar con usuarios reales.
- **A-DATA-01:** grants y policies del proyecto real se inventarían antes del HTTP. Un fallo por privilegio SQL se identifica como tal, no se atribuye a RLS.
- **A-DATA-02:** respuestas JSON, conteos, campos, filas afectadas y relectura posterior no muestran datos privados ni cambios ajenos.
- **A-RESTORE-01:** baseline posterior coincide en recuentos, títulos, precios, estados e IDs; filas transitorias se eliminan solo con autorización de limpieza y evidencia posterior.
- **A-GEO-01:** queda pendiente hasta aprobar e implementar una RPC geográfica específica. Para pasar necesitará pruebas HTTP con centros sintéticos, radios de 250 m/1 km, paginación, duplicados y restricciones de publicación/precisión.
- **A-SEC-01:** no se registra clave secreta, service_role, password, token, recovery link o credencial en cliente o evidencia.

Los códigos HTTP exactos pueden variar por capa; la aprobación exige revisar encabezados, SQLSTATE/cuerpo, filas visibles y efecto, no basarse solo en un `200`.

## Supuestos que deben validarse

- El proyecto continúa Free, sin billing, método de pago, cambio automático de plan u otra cuota activada.
- La configuración hosted y Redirect URLs se inspeccionan solo como información; no se alteran para esta PoC.
- La Data API expone los esquemas y objetos esperados y `private` permanece sin exponer.
- Los grants actuales coinciden con el candidato versionado; si hay diferencia, detener y no reparar dentro de esta prueba.

## Fuera de alcance

Implementación de aplicación, cambio de arquitectura, instalación de Supabase CLI/SDK, despliegue, SMTP externo, uso de datos personales/reales, configuración de Auth, migración, cambios de RLS/GRANT, nuevas funciones RPC, selección de proveedor y cierre del hito.
