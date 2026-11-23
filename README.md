# Taller ADI · Lista de la compra con Ionic Vue

Migración gradual del frontend original de Vue + Supabase. JavaScript y Composition API, sin Capacitor: todas las variantes se ejecutan en el navegador.

## Puesta en marcha

Usa Node.js 22.12 o posterior (se recomienda una versión LTS compatible con Vite).

```bash
npm ci
npm run dev -- --host 0.0.0.0
```

Abre la dirección que indica Vite. Desde un móvil de la misma red, usa la IP del ordenador y el puerto indicado. Para compilar: `npm run build`.

Se conserva el proyecto Supabase y su clave pública del ejemplo original. Entra con uno de los usuarios ya dados de alta. Para otro proyecto, copia `.env.example` a `.env.local` y cambia sus dos variables. Reinicia Vite después de cambiar el entorno. La tabla sigue siendo `lista`, con `id`, `nombre`, `comprado` y `usuario`. La RLS del servidor debe limitar cada usuario a sus filas; el guard del router solo controla la navegación.

## Recorrido del repositorio

| Referencia | Objetivo |
| --- | --- |
| Tag `00-desktop` | Código original del ZIP, sin modificar. |
| Tag `01-ionic-shell` | IonicVue, CSS de Ionic, router y dos páginas con IonPage. Los componentes de escritorio siguen dentro. |
| Tag `02-ionic-base` / rama `main` | Login, alta, listado y comprado/pendiente con componentes Ionic. Editar y borrar quedan como ejercicio. |
| Rama `variante/botones` | Editar y eliminar visibles en cada fila; editor en modal. |
| Rama `variante/action-sheet` | Tres puntos y panel de acciones; mismo editor en modal. |
| Rama `variante/swipe` | Deslizar revela las acciones; mismo editor en modal. |
| Rama `variante/pantalla-edicion` | Mismos botones que la primera variante; edición en otra ruta y observación del ciclo de vida. |

Las cuatro ramas parten del tag `02-ionic-base`. No son pasos acumulativos entre sí.

```bash
# Ver el historial y sus bifurcaciones
git log --all --graph --decorate --oneline

# Visitar un paso sin modificarlo
git switch --detach 01-ionic-shell

# Volver al punto de partida del ejercicio
git switch main

# Probar una solución
git switch variante/botones
npm ci
npm run dev
```

Detén Vite antes de cambiar de referencia y vuelve a arrancarlo después. `npm ci` garantiza las dependencias de la referencia elegida. Para trabajar a partir de un tag: `git switch -c mi-solucion 02-ionic-base`.

## Cómo comparar los cambios

```bash
git diff 00-desktop 01-ionic-shell -- src package.json
git diff 01-ionic-shell 02-ionic-base -- src
git diff 02-ionic-base variante/botones -- src
git diff variante/botones variante/action-sheet -- src
git diff variante/botones variante/pantalla-edicion -- src
```

Cada referencia incluye `docs/ETAPA.md` con lo que ya funciona y qué observar. La rama de pantalla de edición añade un guion específico del ciclo de vida.

## Decisiones comunes

- Checkbox visible para comprado/pendiente. Las acciones secundarias no cambian su estado por propagación de un clic.
- El servicio `src/servicios/api.js` conserva las operaciones de Supabase del original.
- Login y logout navegan como raíz y reemplazan la entrada actual. La lista y el editor sí forman una pila.
- Las páginas enrutadas tienen IonPage y se muestran mediante IonRouterOutlet.
- Los formularios conservan el texto si falla el servidor; los botones se bloquean durante las operaciones.
- Las tres variantes con modal comparten su diseño de editor. La cuarta permite comparar la navegación con el mismo acceso mediante botones.

## Referencias

- [Ionic Vue: añadir a una app existente](https://ionicframework.com/docs/vue/adding-ionic-vue-to-an-existing-vue-project)
- [Navegación](https://ionicframework.com/docs/vue/navigation)
- [Ciclo de vida](https://ionicframework.com/docs/vue/lifecycle)
- [Filas deslizantes](https://ionicframework.com/docs/api/item-sliding)
- [Action sheet](https://ionicframework.com/docs/api/action-sheet)
- [Modal](https://ionicframework.com/docs/api/modal)
