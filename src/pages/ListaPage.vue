<script setup>
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, onIonViewWillEnter, useIonRouter } from '@ionic/vue'
import ListaCompra from '../components/ListaCompra.vue'
import { getUsuario } from '../servicios/api'

const ionRouter = useIonRouter()
const usuario = ref(null)

onIonViewWillEnter(async () => { usuario.value = await getUsuario() })

function logoutOK() {
  ionRouter.navigate('/login', 'root', 'replace')
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar><IonTitle>Lista de la compra</IonTitle></IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="contenido">
        <!-- Paso 1: se conserva el CRUD de escritorio dentro de IonContent. -->
        <ListaCompra v-if="usuario" :email="usuario.email" @logout_ok="logoutOK" />
      </div>
    </IonContent>
  </IonPage>
</template>
