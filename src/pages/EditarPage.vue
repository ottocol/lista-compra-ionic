<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton,
  IonItem, IonInput, IonText, IonSpinner, onIonViewWillEnter, useIonRouter, onIonViewDidEnter,
  onIonViewWillLeave, onIonViewDidLeave
} from '@ionic/vue'
import { obtenerProducto, setNombre } from '../servicios/api'

const props = defineProps({ id: { type: String, required: true } })
const ionRouter = useIonRouter()
const producto = ref(null)
const nombre = ref('')
const cargando = ref(true)
const guardando = ref(false)
const error = ref('')

// Los hooks se ven aquí, en la propia página.
onMounted(() => console.info('[Editar] onMounted'))
onUnmounted(() => console.info('[Editar] onUnmounted'))
onIonViewDidEnter(() => console.info('[Editar] ionViewDidEnter'))
onIonViewWillLeave(() => console.info('[Editar] ionViewWillLeave'))
onIonViewDidLeave(() => console.info('[Editar] ionViewDidLeave'))
onIonViewWillEnter(() => {
  console.info('[Editar] ionViewWillEnter')
  cargarProducto()
})
// Impide salir durante el guardado, también con Atrás del navegador.
onBeforeRouteLeave(() => !guardando.value)

async function cargarProducto() {
  cargando.value = true
  error.value = ''
  producto.value = null
  try {
    producto.value = await obtenerProducto(props.id)
    nombre.value = producto.value.nombre
  } catch (e) {
    error.value = e.message
  } finally {
    cargando.value = false
  }
}

function volver() {
  // Un enlace directo al editor puede no tener una lista debajo.
  if (ionRouter.canGoBack()) ionRouter.back()
  else ionRouter.navigate('/lista', 'root', 'replace')
}

async function guardar() {
  const limpio = nombre.value.trim()
  if (!limpio || guardando.value || !producto.value) return
  guardando.value = true
  error.value = ''
  try {
    await setNombre(producto.value.id, limpio)
    guardando.value = false
    // Desapilar; hacer push('/lista') crearía otra entrada.
    volver()
  } catch (e) {
    error.value = e.message
  } finally {
    guardando.value = false
  }
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton default-href="/lista" text="Atrás" :disabled="guardando" />
        </IonButtons>
        <IonTitle>Editar producto</IonTitle>
        <IonButtons slot="end">
          <IonButton :disabled="guardando" @click="volver">Cancelar</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="contenido">
        <p v-if="cargando" role="status"><IonSpinner name="crescent" /> Cargando producto…</p>
        <IonText v-if="error" color="danger"><p role="alert">{{ error }}</p></IonText>
        <IonButton v-if="!producto && !cargando" fill="outline" @click="cargarProducto">Reintentar</IonButton>
        <form v-if="producto" @submit.prevent="guardar">
          <IonItem>
            <IonInput v-model="nombre" label="Nombre" label-placement="stacked"
              required autocomplete="off" enterkeyhint="done" :disabled="guardando" />
          </IonItem>
          <IonButton expand="block" type="submit" :disabled="guardando || !nombre.trim()">
            <IonSpinner v-if="guardando" slot="start" name="crescent" />
            Guardar
          </IonButton>
        </form>
      </div>
    </IonContent>
  </IonPage>
</template>
