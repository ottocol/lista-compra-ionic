# Demostración · Montaje y visibilidad

1. Abre la consola del navegador, inicia sesión y crea varios productos.
2. Desplázate en la lista hasta un producto y pulsa su lápiz.
3. Edita el nombre y guarda.
4. Observa que recuperas la misma lista y posición de scroll.
5. Repite la edición y vuelve con Atrás o Cancelar.

Las dos páginas registran sus hooks de forma explícita y muestran en consola su nombre y los eventos de Vue y de Ionic.

| Momento | Qué observar |
| --- | --- |
| Primera entrada en la lista | onMounted y eventos de entrada. |
| Push del editor | La lista recibe eventos de salida, pero no onUnmounted. El editor se monta. |
| Regreso a la lista | La lista recibe eventos de entrada sin volver a montarse; no se repite onMounted. |
| Editor desapilado | Recibe eventos de salida y onUnmounted al retirarse. |
| Nueva apertura del editor | Se crea una nueva instancia del editor. |

No deduzcas un orden total entre todos los hooks de las dos páginas a partir de esta tabla: distingue el montaje, el inicio y fin de las transiciones y el desmontaje final.

## Por qué se actualiza el nombre

Cada pantalla conserva su copia de los datos. La lista carga de nuevo en onIonViewWillEnter después de guardar el editor. No se usa un store compartido para ocultar este efecto.

Ejercicio: mueve temporalmente la carga desde onIonViewWillEnter a onMounted. Guarda un cambio desde el editor y regresa: la lista conserva la copia anterior porque no vuelve a montarse. Restaurar onIonViewWillEnter resuelve esa situación.

Otro ejercicio: cambia volver() por push('/lista') y observa cómo cambia el historial y por qué ya no equivale a desapilar. Deshaz ese cambio después de la prueba.

Los hooks Ionic pertenecen a las páginas directamente enrutadas y envueltas en IonPage. Un componente Producto no recibe esos hooks por estar dentro de la lista.

## Enlace directo y errores

Prueba recargar /lista/ID/editar con una sesión activa. La pantalla obtiene sus propios datos y permite volver aunque la lista aún no exista en la pila. Sin sesión, el guard redirige al login. Un id inexistente o un error de servidor muestra el error y permite reintentar.

Documentación: https://ionicframework.com/docs/vue/lifecycle y https://ionicframework.com/docs/vue/navigation.
