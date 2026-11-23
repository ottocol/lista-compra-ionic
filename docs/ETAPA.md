# Variante · Panel de acciones

Rama: `variante/action-sheet`. Parte de `02-ionic-base`.

Cada fila reserva un único botón de tres puntos para las acciones secundarias. El checkbox sigue visible.

1. El botón abre IonActionSheet con el nombre del producto como cabecera.
2. El panel ofrece Editar, Eliminar y Cancelar.
3. Al cerrarse el panel, su evento didDismiss comunica la acción mediante data.
4. Editar abre el mismo modal que en la variante de botones.
5. Eliminar abre la misma confirmación.

Se espera a didDismiss para abrir el siguiente overlay. Tanto el panel como el modal sincronizan el cierre con el estado del padre: isOpen no se pone a false automáticamente.

Prueba: tocar fuera del panel, cancelar, editar y borrar. Compara la presentación en iOS y Material Design y el número de toques con los botones visibles.

Comparación: `git diff variante/botones variante/action-sheet -- src`.
