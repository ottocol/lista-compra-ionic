<script setup>
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons,
  IonButton, IonList, IonSpinner, IonText, IonNote, onIonViewWillEnter, useIonRouter } from '@ionic/vue'
import { getUsuario, logout, obtenerProductos, crearProducto, setComprado } from '../servicios/api'
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
        <IonList v-if="productos.length" inset aria-label="Productos de la compra">
          <Producto v-for="producto in productos" :key="producto.id" :producto="producto"
            :ocupado="ocupado || cargando" @toggle_prod="doToggle" />
        </IonList>
        <p v-else-if="!cargando && !error">La lista está vacía. Añade tu primer producto.</p>
      </div>
    </IonContent>
  </IonPage>
</template>
