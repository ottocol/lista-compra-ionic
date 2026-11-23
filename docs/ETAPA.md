# Variante · Botones visibles

Rama: `variante/botones`. Parte de `02-ionic-base`.

Cada fila muestra un checkbox, un lápiz y una papelera. Los iconos tienen etiquetas accesibles y superficies de al menos 44 px.

- Editar abre EditorProducto, un IonModal con un formulario de nombre.
- Cancelar descarta el borrador. Guardar espera a Supabase antes de cerrar.
- Si la petición falla, el modal conserva el nombre y muestra el error.
- Eliminar solicita confirmación mediante IonAlert.
- Producto emite la intención; ListaPage coordina los overlays y actualiza sus datos.
- Marcar como comprado sigue siendo una acción independiente.

Prueba: editar un nombre, cancelar otro cambio, borrar cancelando primero y confirmando después. Repetir con un nombre largo. La edición y el borrado no deben marcar el checkbox.

Comparación: `git diff 02-ionic-base variante/botones -- src`.
