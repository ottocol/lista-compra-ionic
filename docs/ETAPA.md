# Variante · Deslizar para revelar

Rama: `variante/swipe`. Este primer commit queda marcado con `03-swipe-revelar`.

IonItemSliding envuelve cada IonItem. IonItemOptions, en el lado end, contiene Editar y Eliminar. Deslizar revela los botones; todavía NO ejecuta el borrado.

- Al tocar una opción, la fila se cierra y emite la intención.
- El editor sigue siendo el modal común.
- Eliminar solicita confirmación.
- Se conserva el botón de tres puntos como alternativa visible y accesible al gesto.

Prueba en una pantalla táctil, o con la emulación táctil de las herramientas del navegador. Comprueba que desplazar horizontalmente una fila no marque el checkbox. Compara descubrir la función con conocer ya el gesto.

El siguiente commit de esta misma rama añadirá el desplazamiento completo y Deshacer, sin crear una quinta variante.
