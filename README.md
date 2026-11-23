# Lista de la compra (Vue + Supabase)

Versión de escritorio con CRUD completo: listar, añadir, marcar como comprado, editar el nombre y borrar.

```bash
npm install
npm run dev
```

- `src/servicios/api.js`: todas las llamadas a Supabase
- `src/components/ListaCompra.vue`: carga la lista y gestiona los eventos de los hijos
- `src/components/Producto.vue`: un producto (pulsar = comprado/no comprado, ✎ = editar, x = borrar)
- `src/components/NuevoProducto.vue`: formulario para añadir
