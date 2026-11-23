<script setup>
import { ref } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonActionSheet,
  IonList, IonSpinner, IonText, IonNote, onIonViewWillEnter, useIonRouter, alertController
} from '@ionic/vue'
import {
  getUsuario, logout, obtenerProductos, crearProducto, setComprado, setNombre, borrarProducto
} from '../servicios/api'
import EditorProducto from '../components/EditorProducto.vue'
import Producto from '../components/Producto.vue'
import NuevoProducto from '../components/NuevoProducto.vue'

const ionRouter = useIonRouter()
const usuario = ref(null)
const productos = ref([])
const cargando = ref(true)
const ocupado = ref(false)
const error = ref('')
const nuevoNombre = ref('')

async function cargarProductos() {
  cargando.value = true
  error.value = ''
  try {
    productos.value = await obtenerProductos()
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

async function doNuevo(nombre) {
  const limpio = nombre.trim()
  if (!limpio || ocupado.value || cargando.value) return
  ocupado.value = true
  error.value = ''
  try {
    const nuevo = await crearProducto(limpio)
    if (!nuevo) throw new Error('La sesión ha terminado. Vuelve a iniciar sesión.')
    productos.value.push(nuevo)
    nuevoNombre.value = ''
  } catch (e) {
    error.value = e.message
  } finally {
    ocupado.value = false
  }
}

async function doToggle(id) {
  const producto = productos.value.find((p) => p.id === id)
  if (!producto || ocupado.value || cargando.value) return
  ocupado.value = true
  error.value = ''
  const anterior = producto.comprado
  try {
    await setComprado(id, !anterior)
    producto.comprado = !anterior
  } catch (e) {
    error.value = e.message
  } finally {
    ocupado.value = false
  }
}


async function doEditar(id, nombre) {
  const limpio = nombre.trim()
  if (!limpio || ocupado.value || cargando.value) return false
  ocupado.value = true
  error.value = ''
  try {
    await setNombre(id, limpio)
    const producto = productos.value.find((p) => p.id === id)
    if (producto) producto.nombre = limpio
    return true
  } catch (e) {
    error.value = e.message
    return false
  } finally {
    ocupado.value = false
  }
}

async function doBorrar(id) {
  if (ocupado.value || cargando.value) return false
  ocupado.value = true
  error.value = ''
  try {
    await borrarProducto(id)
    productos.value = productos.value.filter((p) => p.id !== id)
    return true
  } catch (e) {
    error.value = e.message
    return false
  } finally {
    ocupado.value = false
  }
}


const productoEditado = ref(null)

function abrirEdicion(producto) {
  error.value = ''
  productoEditado.value = producto
}

async function guardarEdicion(id, nombre) {
  if (await doEditar(id, nombre)) productoEditado.value = null
}

async function confirmarBorrado(producto) {
  const aviso = await alertController.create({
    header: 'Eliminar producto',
    subHeader: producto.nombre,
    message: '¿Quieres eliminar este producto de la lista?',
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      { text: 'Eliminar', role: 'destructive' },
    ],
  })
  await aviso.present()
  const { role } = await aviso.onDidDismiss()
  return role === 'destructive'
}

async function pedirBorrado(producto) {
  if (await confirmarBorrado(producto)) await doBorrar(producto.id)
}

const productoAcciones = ref(null)
const botonesAcciones = [
  { text: 'Editar', data: { accion: 'editar' } },
  { text: 'Eliminar', role: 'destructive', data: { accion: 'eliminar' } },
  { text: 'Cancelar', role: 'cancel' },
]

function abrirAcciones(producto) {
  productoAcciones.value = producto
}

// Elegimos después de que el panel se cierre, para no superponer overlays.
function resolverAccion(event) {
  const producto = productoAcciones.value
  productoAcciones.value = null
  if (!producto) return
  const accion = event.detail.data?.accion
  if (accion === 'editar') abrirEdicion(producto)
  if (accion === 'eliminar') pedirBorrado(producto)
}

onIonViewWillEnter(async () => {
  usuario.value = await getUsuario()
  if (usuario.value) await cargarProductos()
  else productos.value = []
})

async function doLogout() {
  if (ocupado.value) return
  ocupado.value = true
  error.value = ''
  try {
    await logout()
    productos.value = []
    nuevoNombre.value = ''
    ionRouter.navigate('/login', 'root', 'replace')
  } catch (e) {
    error.value = e.message
  } finally {
    ocupado.value = false
  }
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Lista de la compra</IonTitle>
        <IonButtons slot="end">
          <IonButton :disabled="ocupado || cargando" @click="doLogout">Salir</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="contenido">
        <p><IonNote>{{ usuario?.email }}</IonNote></p>
        <NuevoProducto v-model="nuevoNombre" :ocupado="ocupado || cargando" @nuevo_prod="doNuevo" />
        <IonText v-if="error" color="danger">
          <p role="alert">{{ error }}</p>
          <IonButton fill="outline" :disabled="ocupado || cargando" @click="cargarProductos">Recargar lista</IonButton>
        </IonText>
        <p v-if="cargando" role="status"><IonSpinner name="crescent" /> Cargando productos…</p>
        <p><IonNote>Desliza un producto hacia la izquierda para ver sus acciones.</IonNote></p>
        <IonList v-if="productos.length" inset aria-label="Productos de la compra">
          <Producto v-for="producto in productos" :key="producto.id" :producto="producto"
            :ocupado="ocupado || cargando" @toggle_prod="doToggle" @acciones_prod="abrirAcciones"
            @editar_prod="abrirEdicion" @borrar_prod="pedirBorrado" />
        </IonList>
        <p v-else-if="!cargando && !error">La lista está vacía. Añade tu primer producto.</p>
      </div>
    </IonContent>
    <IonActionSheet :is-open="productoAcciones !== null" :header="productoAcciones?.nombre"
      :buttons="botonesAcciones" @didDismiss="resolverAccion" />
    <EditorProducto :producto="productoEditado" :ocupado="ocupado" :error="error"
      @guardar="guardarEdicion" @cerrar="productoEditado = null" />
  </IonPage>
</template>
