# Prototipo UX/UI de F00-H03

Prototipo navegable local para explorar alojamientos ficticios en Tunja. Usa HTML, CSS y JavaScript nativos; no tiene framework, backend, almacenamiento remoto ni dependencias nuevas.

## Abrir

Abre `index.html` en un navegador moderno o sirve esta carpeta con un servidor HTTP local. Para la revisión actual está disponible en [http://127.0.0.1:8765/index.html](http://127.0.0.1:8765/index.html) mientras el servidor local esté activo. Búsqueda, orden, favoritos, selección de mapa/lista, detalle, contacto, error y estado 360° funcionan únicamente en memoria dentro de la demostración. Consulta la [guía breve de aceptación](../guia-aceptacion-funcional.md) para el recorrido y las preguntas de revisión.

## Identidad aprobada

La identidad visual y el logotipo recibidos en `assets/identidad/logotipo-ubicate-aprobado.png` fueron aprobados para guiar el prototipo. La interfaz usa ese PNG sin redibujarlo. Tokens y uso cromático están descritos en `design-tokens.json`. F00-H03 fue cerrado tras aceptar la dirección visual y el recorrido público. Esto no aprueba arquitectura ni implementación productiva.

## Experiencia disponible

- Buscar ejemplos por texto, tipo y presupuesto; ordenar resultados y ver estado vacío/error.
- En móvil, saltar desde navegación fija al mapa o la lista. En escritorio, ver mapa esquemático y resultados en paralelo.
- Seleccionar una ficha o marcador para reflejar la selección en ambas vistas, con acción de teclado para llevar el foco al marcador.
- Abrir detalle con precio mensual, características, condiciones pendientes, disponibilidad, ubicación aproximada ficticia, contacto simulado y estado de panorama.
- Representar dos habitaciones del mismo inmueble para explorar la relación inmueble/unidades.
- Revisar un estado 360° no disponible. No hay un panorama real y no se usa una fotografía común para simularlo.
- Ver una fotografía editorial cálida de convivencia en el hero, con crédito breve y aviso de que no representa anuncios, usuarios ni alojamientos de Ubícate.
- En el detalle de La Casa del Arrayán, revisar atributos de habitación y espacios compartidos del inmueble por separado. Los datos solo reorganizan términos que ya estaban en el ejemplo.
- Probar los estados de error y restablecimiento desde “Controles de demostración”.

## Límites de los recursos

Los anuncios y sus datos son inventados. No se proporcionaron fotografías de alojamientos ni panoramas 360°. Las habitaciones se muestran con ilustraciones conceptuales, claramente rotuladas. Esto no impide revisar el recorrido con datos ficticios. El mapa no es cartográfico y no contiene coordenadas ni geolocalización. Contacto, disponibilidad y condiciones no consultan servicios reales. Un visor 360° real pertenece a una fase posterior y solo se habilitará con un recurso panorámico genuino.

La imagen principal preferida del hero es editorial y fue aportada por dirección para esta revisión; no es una fotografía de alojamiento. Su copia local y las capturas que la contienen están excluidas de Git porque la procedencia/licencia no está verificada. En un checkout limpio, el prototipo cambia a la alternativa Pexels local y documentada. El registro de archivos, licencias y restricciones está en [créditos de vida estudiantil](assets/vida-estudiantil/CREDITS.md) y la [dirección visual 03](direccion-03-ubicate.md#narrativa-de-vida-estudiantil-y-medios-d-ux-003). Las ilustraciones editoriales SVG de la iteración previa se retiraron; las ilustraciones conceptuales de las fichas siguen identificadas como tales.

## Referencias anteriores

Las propuestas Patio, Nido y las variantes de logo generadas durante iteraciones anteriores se mantienen como referencias históricas. No se presentan como decisiones de identidad abiertas. La dirección visual actual está en [direccion-03-ubicate.md](direccion-03-ubicate.md); los criterios y estado del hito, en [hito.md](../hito.md).

Las capturas de aceptación funcional están en [móvil 390 × 844](evidencias/aceptacion-funcional-390x844.jpg) y [escritorio 1440 × 1000](evidencias/aceptacion-funcional-1440x1000.jpg). Los resultados de contraste e interacción constan en [verificacion-ux.md](evidencias/verificacion-ux.md).

El refinamiento aprobado usa localmente la imagen del grupo en la cocina, conserva el hero sin tarjetas flotantes y mantiene el buscador integrado. Una nota editorial discreta distingue la escena de los anuncios. Las capturas móviles y de escritorio de esta versión se conservan solo en la copia local, junto con la imagen sin licencia verificada, y están excluidas de Git. F00-H03 está cerrado; H04 registra los pendientes de Fase 0.
