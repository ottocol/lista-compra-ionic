# Variante · Pantalla de edición independiente

Rama: `variante/pantalla-edicion`. Parte de `02-ionic-base`.

Se muestran los mismos botones que en variante/botones. El lápiz hace push a `/lista/:id/editar`; el editor es una página con IonPage. Guardar espera a Supabase y vuelve atrás, sin hacer push a una nueva lista. Cancelar y Atrás descartan el borrador.

El editor obtiene el producto por su id del servidor: no depende de que antes se haya abierto la lista. Un acceso directo tiene retorno a /lista mediante replace si no hay pantalla anterior.

El borrado mantiene la confirmación. No se incluye el modal.

Guion: [CICLO-DE-VIDA.md](CICLO-DE-VIDA.md).
