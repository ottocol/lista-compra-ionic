<script setup>
import { ref, watch } from 'vue'
import { IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonItem, IonInput, IonText, IonSpinner } from '@ionic/vue'

const props = defineProps({ producto: { type: Object, default: null }, ocupado: Boolean, error: String })
const emit = defineEmits(['guardar', 'cerrar'])
const nombre = ref('')

watch(() => props.producto, (producto) => { nombre.value = producto?.nombre || '' })

function guardar() {
  if (nombre.value.trim() && !props.ocupado) emit('guardar', props.producto.id, nombre.value.trim())
}
</script>

<template>
  <!-- isOpen es unidireccional: didDismiss avisa al padre para limpiar su estado. -->
  <IonModal :is-open="producto !== null" :can-dismiss="!ocupado" @didDismiss="emit('cerrar')">
    <IonHeader>
      <IonToolbar>
        <IonTitle>Editar producto</IonTitle>
        <IonButtons slot="end">
          <IonButton :disabled="ocupado" @click="emit('cerrar')">Cancelar</IonButton>
        </IonButtons>
      </IonToolbar>
    </IonHeader>
    <IonContent class="ion-padding">
      <form @submit.prevent="guardar" class="contenido">
        <IonItem>
          <IonInput v-model="nombre" label="Nombre" label-placement="stacked" required
            autocomplete="off" enterkeyhint="done" :disabled="ocupado" />
        </IonItem>
        <IonText v-if="error" color="danger"><p role="alert">{{ error }}</p></IonText>
        <IonButton expand="block" type="submit" :disabled="ocupado || !nombre.trim()">
          <IonSpinner v-if="ocupado" slot="start" name="crescent" />
          Guardar
        </IonButton>
      </form>
    </IonContent>
  </IonModal>
</template>
