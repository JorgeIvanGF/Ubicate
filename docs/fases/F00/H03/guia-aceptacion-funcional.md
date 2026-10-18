# Guía de aceptación funcional de F00-H03

## Abrir el prototipo

Con el servidor local activo, abre [http://127.0.0.1:8765/index.html](http://127.0.0.1:8765/index.html). El servidor escucha solo en el equipo local. No requiere instalar nada ni iniciar sesión.

## Recorrido sugerido

1. En “¿Dónde te gustaría vivir?”, escribe `Centro`; fija el presupuesto en `Hasta $700.000` y pulsa **Buscar**. Debe quedar una ficha y un marcador.
2. Busca `sin coincidencias`. Debe aparecer el estado vacío y desaparecer los marcadores. Borra el texto.
3. En “Tipo de espacio”, selecciona **Habitación compartida** y pulsa **Buscar**. Debe aparecer la habitación 1 de La Casa del Arrayán.
4. Selecciona el marcador de precio de esa habitación. La ficha se destaca. Usa el botón circular de ubicación de la ficha para volver a seleccionarla en el mapa. Prueba también el botón con teclado: Tab hasta “Mostrar … en el mapa” y pulsa Enter.
5. En la ficha, pulsa **Ver alojamiento**. Revisa precio mensual, características, disponibilidad, condiciones de demostración, ubicación aproximada y galería.
6. Pulsa **Consultar al anunciante (demo)**. Debe aparecer un mensaje que confirma que el contacto es simulado y que no se envió información.
7. Abre **Ver estado 360°**. Debe decir que no hay un panorama real cargado.
8. En móvil, prueba **Mapa** y **Lista**. Sus títulos quedan visibles bajo la barra de navegación.
9. En **Controles de demostración**, prueba el error y restablece la búsqueda.

## Valoración humana que se necesita

- ¿Se entienden los filtros y se puede llegar pronto al mapa o a la lista en móvil?
- ¿El mapa esquemático y la selección cruzada ayudan a comparar, aun con ubicaciones ficticias?
- ¿La ficha presenta la información suficiente y se entiende qué es simulación?
- ¿El resultado del contacto simulado es claro?
- ¿Hay algún defecto que impida aceptar el recorrido público principal?

La identidad visual y el logotipo ya están aprobados; esta revisión no los vuelve a abrir. No hace falta validar propiedades reales para aceptar la navegación del prototipo. Las fotografías del alojamiento se representan con una ilustración conceptual rotulada.

## Estado de las funciones

**Funciona en el prototipo local:** filtros por texto, presupuesto y tipo; orden; selección relacionada entre mapa y fichas; detalle; favoritos; mensaje visible de contacto simulado; estados vacío, error y restablecimiento; navegación móvil a mapa/lista.

**Es una demostración:** anuncios y precios inventados, disponibilidad y condiciones, ubicación aproximada, mapa esquemático, ilustraciones, contacto sin envío y estado de recurso 360° no disponible. No hay cuenta, persistencia, geolocalización ni proveedor externo.

**Fase posterior:** cargar fotografías aprobadas y desarrollar un visor navegable únicamente para panoramas 360° reales, con manejo accesible y un estado alternativo cuando falte el recurso. Una foto convencional no contará como panorama. También quedan para fases posteriores los servicios reales, autenticación, base de datos, back end, flujos operativos de anunciante/administración, publicación y planes comerciales.

## Evidencia

- [Captura móvil, 390 × 844](prototipo/evidencias/aceptacion-funcional-390x844.jpg)
- [Captura escritorio, 1440 × 1000](prototipo/evidencias/aceptacion-funcional-1440x1000.jpg)
- [Resultados técnicos y límites](prototipo/evidencias/verificacion-ux.md)

**Aceptación recibida:** dirección de producto aceptó el recorrido principal el 2026-10-15. El 2026-10-16 se confirmó el cierre de F00-H03 tras aceptar la dirección visual D-UX-004. Esta guía conserva el recorrido para futuras revisiones del prototipo; el cierre no aprueba arquitectura ni producción.
