<script setup>
import { IonItem, IonCheckbox, IonButtons, IonButton, IonIcon } from '@ionic/vue'
import { createOutline, trashOutline } from 'ionicons/icons'

const props = defineProps({ producto: { type: Object, required: true }, ocupado: Boolean })
const emit = defineEmits(['toggle_prod', 'editar_prod', 'borrar_prod', 'acciones_prod'])

function cambiarComprado(event) {
  event.target.checked = props.producto.comprado
  emit('toggle_prod', props.producto.id)
}
</script>

<template>
  <IonItem>
    <IonCheckbox :checked="producto.comprado" :disabled="ocupado"
      justify="start" label-placement="end" @ionChange="cambiarComprado">
      <span :class="{ comprado: producto.comprado }">{{ producto.nombre }}</span>
    </IonCheckbox>
    <IonButtons slot="end">
      <IonButton :aria-label="'Editar ' + producto.nombre" :disabled="ocupado"
        @click.stop="emit('editar_prod', producto)">
        <IonIcon slot="icon-only" :icon="createOutline" />
      </IonButton>
      <IonButton color="danger" :aria-label="'Eliminar ' + producto.nombre" :disabled="ocupado"
        @click.stop="emit('borrar_prod', producto)">
        <IonIcon slot="icon-only" :icon="trashOutline" />
      </IonButton>
    </IonButtons>
  </IonItem>
</template>

<style scoped>
ion-checkbox { flex: 1; min-width: 0; min-height: 52px; --size: 24px; }
ion-checkbox::part(label) { white-space: normal; overflow-wrap: anywhere; }
ion-buttons { margin-inline-start: 8px; }
ion-button { min-width: 44px; min-height: 44px; }
.comprado { color: var(--ion-color-medium); text-decoration: line-through; }
</style>
