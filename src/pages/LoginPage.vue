<script setup>
import { reactive, ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonInput, IonButton, IonSpinner, IonText, useIonRouter } from '@ionic/vue'
import { login } from '../servicios/api'

const ionRouter = useIonRouter()
const usuario = reactive({ email: '', password: '' })
const ocupado = ref(false)
const error = ref('')

async function doLogin() {
  if (ocupado.value || !usuario.email.trim() || usuario.password.length < 8) return
  ocupado.value = true
  error.value = ''
  try {
    await login(usuario.email.trim(), usuario.password)
    usuario.password = ''
    ionRouter.navigate('/lista', 'root', 'replace')
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
      <IonToolbar><IonTitle>Lista de la compra</IonTitle></IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <div class="contenido">
        <h1>Iniciar sesión</h1>
        <form @submit.prevent="doLogin">
          <IonList inset>
            <IonItem>
              <IonInput v-model="usuario.email" label="Email" label-placement="stacked"
                type="email" autocomplete="username" inputmode="email"
                :autocapitalize="'off'" :spellcheck="false" required :disabled="ocupado" />
            </IonItem>
            <IonItem>
              <IonInput v-model="usuario.password" label="Contraseña" label-placement="stacked"
                type="password" autocomplete="current-password" :minlength="8"
                required :disabled="ocupado" />
            </IonItem>
          </IonList>
          <IonText v-if="error" color="danger"><p role="alert">{{ error }}</p></IonText>
          <IonButton expand="block" type="submit" :disabled="ocupado">
            <IonSpinner v-if="ocupado" slot="start" name="crescent" />
            Entrar
          </IonButton>
        </form>
      </div>
    </IonContent>
  </IonPage>
</template>
