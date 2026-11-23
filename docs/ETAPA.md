# Paso 2 · Interfaz Ionic, acciones pendientes

Referencia: `02-ionic-base`. Rama: `main`.

Funcionan login, logout, listado, alta y comprado/pendiente. No hay controles de editar ni borrar todavía; el servicio de Supabase conserva sus operaciones.

- LoginPage utiliza IonInput, IonList, IonItem, IonButton y IonSpinner.
- ListaPage organiza la pantalla con cabecera, toolbar, contenido y componentes Ionic.
- NuevoProducto conserva el texto hasta que el alta termina correctamente.
- Producto usa un IonCheckbox con su etiqueta para marcar y desmarcar.
- ListaPage contiene directamente el estado y las operaciones, con errores visibles y bloqueo durante las peticiones.
- La carga se ejecuta en onIonViewWillEnter, no en onMounted.
- Desaparecen Login.vue y ListaCompra.vue, ya sustituidos por las páginas.

Ejercicio: desde aquí, implementar editar y borrar con alguno de los patrones móviles. Las cuatro ramas ofrecen soluciones independientes.

Prueba común: entrar, crear un producto con nombre largo, marcarlo, desmarcarlo, recargar el navegador y comprobar su persistencia. En un fallo de red, debe aparecer el error y mantenerse el texto del formulario.
