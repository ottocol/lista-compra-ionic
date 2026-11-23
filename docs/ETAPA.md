# Paso 1 · Estructura Ionic

Referencia: `01-ionic-shell`.

Ya funcionan el login y el CRUD de escritorio. La diferencia está en el contenedor:

1. `main.js` instala IonicVue e importa el CSS estructural y las utilidades.
2. `App.vue` contiene IonApp e IonRouterOutlet.
3. El router procede de `@ionic/vue-router`, con rutas `/login` y `/lista`.
4. LoginPage y ListaPage contienen IonPage, IonHeader, IonToolbar e IonContent.
5. Cada página todavía envuelve el componente de escritorio correspondiente.
6. El CSS global deja de dar padding al body: el contenido y el scroll los gestiona IonContent.

Los estilos scoped de los componentes originales permanecen a propósito. La sustitución de sus controles se ve en el siguiente paso.

Prueba: iniciar sesión, añadir, marcar, editar y eliminar un producto; cerrar sesión y comprobar que Atrás no permite acceder a datos sin sesión.

Compara con `git diff 00-desktop 01-ionic-shell -- src`.
