<script setup>
import { IonItem, IonCheckbox } from '@ionic/vue'

const props = defineProps({ producto: { type: Object, required: true }, ocupado: Boolean })
const emit = defineEmits(['toggle_prod'])

function cambiarComprado(event) {
  // La vista refleja el último valor confirmado por el servidor.
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
  </IonItem>
</template>

<style scoped>
ion-checkbox { width: 100%; min-height: 52px; --size: 24px; }
ion-checkbox::part(label) { white-space: normal; overflow-wrap: anywhere; }
.comprado { color: var(--ion-color-medium); text-decoration: line-through; }
</style>
