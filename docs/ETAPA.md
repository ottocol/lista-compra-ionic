# Variante · Swipe y borrado con Deshacer

Rama: `variante/swipe`.

Esta rama tiene dos commits para comparar:

- Tag `03-swipe-revelar`: deslizar solo revela Editar y Eliminar.
- Punta de la rama: además, un desplazamiento completo elimina visualmente la fila y ofrece Deshacer durante cinco segundos.

La opción roja es expandable. El evento ionSwipe de IonItemOptions inicia la operación completa. Tocar el botón Eliminar continúa usando la confirmación habitual; el gesto completo usa Deshacer.

## Cómo funciona Deshacer

1. Se guarda el producto y su posición y se oculta de la lista.
2. Un IonToast ofrece Deshacer.
3. Deshacer repone la fila sin enviar DELETE.
4. Al desaparecer el aviso sin deshacer, se ejecuta DELETE en Supabase.
5. Si falla, se repone la fila y aparece el error.

El toast no implementa la restauración por sí mismo. Esa lógica está en las funciones de ListaPage. Un nuevo borrado completo finaliza el anterior, y el logout espera al borrado pendiente antes de cerrar la sesión. Durante los cinco segundos puedes seguir usando la lista. Cerrar o recargar el navegador antes de enviar DELETE puede conservar el producto en el servidor: es una consecuencia del borrado diferido que conviene discutir en el taller.

Se mantienen los tres puntos como alternativa visible al gesto.

Prueba: revelar y cancelar; tocar Eliminar y cancelar; completar el gesto y deshacer; completar y esperar; cerrar sesión con un borrado pendiente. Comprueba también el caso de error de red.

`npm test` añade pruebas específicas de Deshacer, confirmación y recuperación ante errores.
