# Plan propuesto: PoC Auth + Data API + RLS

**Estado vigente, 2026-10-17:** la matriz esencial Auth/JWT/Data API/RLS A/B fue ejecutada y aprobada; resultados en [README](README.md). Este plan conserva el diseño y los límites de la ejecución original. Las instrucciones operativas que mencionan un ejecutor con `service_role` están obsoletas y no deben ejecutarse. No repetir la matriz esencial ni usar los harnesses temporales. Los casos extendidos, restore integral y decisión de arquitectura siguen pendientes; confirmación y recuperación por correo quedaron diferidas fuera de F01-H00.

## 1. Diseñar y aprobar

Dirección decidió dejar fuera de F01-H00 los mensajes reales de confirmación y recuperación. No solicitar destinatarios ni preparar membresías para correo. Mantener como puertas de esta PoC los casos restantes que requieran datos/identidades reales, autorización de escrituras, tratamiento de UUID, ubicación pública, administrador, límites, conservación y objetivos de recuperación.

## 2. Preflight de cuenta y proyecto

Desde una terminal/sesión autorizada: comprobar ref `ivzjijagahkczdghoqkz`, nombre, plan Free, sin billing/método de pago/cargos; revisar cuotas disponibles, URL/Auth provider, confirmación de correo, rate limits y Redirect URLs; confirmar esquemas Data API expuestos. `private` no debe estar expuesto. Inspeccionar los grants/column privileges de las seis tablas, RLS, policies y helper. Detenerse ante divergencia del candidato, proyecto incorrecto, petición de upgrade o condición comercial no comprobada.

## 3. Backup y baseline

Generar exportación nueva con TLS verificado y conservarla cifrada fuera de Git; comprobar formato/checksum/listado, inventario e integridad. Diferenciar listar un archivo de restaurarlo. Antes de Auth writes, fijar el baseline de las seis tablas: IDs, relación entre ellas, títulos, sectores, precios, estados y conteos 2/3/3/4/3/4. Si la copia está dañada o no legible, detenerse.

## 4. Identidades de prueba

El correo de confirmación y recuperación queda excluido de F01-H00. No crear cuentas ni solicitar buzones como parte de esta fase. Cualquier prueba futura de sesión/JWT requerirá identidades de prueba, autorización externa y un método que no implique activar correo o cambiar ajustes sin aprobación. Crear admin de prueba solo mediante procedimiento de confianza aprobado, asignando `app_metadata.ubicate_role=admin` en entorno seguro; nunca con `user_metadata` ni desde una petición cliente. El endpoint Admin y su secret se mantienen fuera del cliente, argumentos persistidos, logs y repo.

Los UUID ficticios actuales de anunciantes no se pueden convertir sin modificar la evidencia original. Opción propuesta: mantener los seis fixtures base inalterados y añadir filas de prueba temporales donde `ubicate_poc_advertisers.id` y `ubicate_poc_properties.owner_id` coincidan con los UUID Auth reales; asignar IDs nuevos a inmuebles/unidades/espacios/disponibilidades. Esa escritura y su posterior borrado requieren autorización explícita. Si la policy/grants no permiten crear los fixtures mediante Data API, no abrir SQL remoto para “reparar” la prueba; detenerse y someter SQL adicional a revisión.

## 5. Auth y Data API

Consumir `/rest/v1` con clave publicable y, cuando exista autorización e identidad de prueba, token del usuario en `Authorization: Bearer`. No usar clave secret/service_role para solicitudes que miden RLS. No registrar encabezados completos. Ejecutar los casos vigentes de la [matriz](matriz-pruebas.md) secuencialmente, capturando status, SQLSTATE/cuerpo saneado, IDs sintéticos y lecturas de verificación. No enviar correos durante F01-H00. Los límites y la naturaleza best-effort del SMTP predeterminado quedan como evidencia documental, no como una prueba de entrega.

La suite previa no tiene una función RPC geoespacial HTTP. Mantener T22 bloqueado hasta que una propuesta separada de SQL/contrato RPC reciba revisión y autorización. La prueba HTTP no puede inventar RPC ni cambiar permisos durante ejecución.

## 6. Cierre de sesión e integridad

Leer de nuevo los datos base y comparar con el baseline; verificar helper, RLS, grants y policies siguen inalterados. Las filas Auth-temporales y usuarios solo se eliminan si la autorización de ejecución incluye expresamente la limpieza destructiva y el orden (availability → spaces/units/status → properties → advertisers → Auth users) se verificó. Eliminar usuario Auth no revoca instantáneamente access JWT existente; mantener tokens aislados y esperar vencimiento o comprobar revocación según política aprobada. Si limpieza no está autorizada, conservar estado y pedir decisión, no borrar automáticamente.

## 7. Evidencia, análisis y decisión

Guardar fuera de Git respuestas saneadas, log con hash y cuadro de pruebas. Documentar fallos, limitaciones, costos observados, condiciones de cuenta verificadas, restore no realizado/realizado y riesgos residuales. Analizar frente a criterios de F01-H00, recomendar sin seleccionar y esperar aprobación humana.

## Límites operativos vigentes

1. La autorización del 2026-10-16 habilita solo identidades A/B sintéticas y filas paralelas en el proyecto aislado, sujetas al preflight y reversión.
2. `supabase_ubicate` permanece en solo lectura. Las operaciones HTTP autorizadas las ejecuta el script local con el `service_role` en memoria.
3. No se registra la clave `service_role` en repositorio, logs, argumentos o chat. La entrada se solicita oculta mediante `Read-Host -AsSecureString`.
4. El Dashboard muestra diez usuarios Auth estimados. El ejecutor toma el inventario real por API y compara sus IDs en memoria antes/después; no modifica usuarios preexistentes ni registra PII.
5. No hay autorización para crear un usuario administrador de prueba. La prueba de spoof usa solo `user_metadata` y debe probar que no otorga rol.
6. La geobúsqueda HTTP permanece bloqueada hasta que exista una RPC aprobada; no se añadirá en esta PoC.
7. Confirmación y recuperación por correo permanecen diferidas y no se enviarán mensajes.

La aprobación de esta documentación no satisface ninguna de estas puertas.
