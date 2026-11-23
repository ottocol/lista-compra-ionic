<script setup>
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, useIonRouter } from '@ionic/vue'
import Login from '../components/Login.vue'

const ionRouter = useIonRouter()

function loginOK() {
  // Login y lista son raíces: no queremos volver al login con Atrás.
  ionRouter.navigate('/lista', 'root', 'replace')
}
</script>

<template>
  <IonPage>
    <IonHeader>
      <IonToolbar><IonTitle>Lista de la compra</IonTitle></IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="contenido">
        <!-- Paso 1: página Ionic que todavía envuelve el formulario de escritorio. -->
        <Login @login_ok="loginOK" />
      </div>
    </IonContent>
  </IonPage>
</template>
