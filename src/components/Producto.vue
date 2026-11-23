<script setup>
import { ref } from 'vue'
import { IonItemSliding, IonItem, IonCheckbox, IonItemOptions, IonItemOption,
  IonButtons, IonButton, IonIcon } from '@ionic/vue'
import { ellipsisVertical, createOutline, trashOutline } from 'ionicons/icons'

const props = defineProps({ producto: { type: Object, required: true }, ocupado: Boolean })
const emit = defineEmits(['toggle_prod', 'editar_prod', 'borrar_prod', 'acciones_prod', 'borrar_gesto'])

function cambiarComprado(event) {
  event.target.checked = props.producto.comprado
  emit('toggle_prod', props.producto.id)
}

const deslizable = ref(null)

async function accion(evento) {
  await deslizable.value?.$el.close()
  emit(evento, props.producto)
}
</script>

<template>
  <IonItemSliding ref="deslizable" :disabled="ocupado">
    <IonItem>
    <IonCheckbox :checked="producto.comprado" :disabled="ocupado"
      justify="start" label-placement="end" @ionChange="cambiarComprado">
      <span :class="{ comprado: producto.comprado }">{{ producto.nombre }}</span>
    </IonCheckbox>
      <!-- Acceso visible alternativo al gesto, también utilizable con teclado. -->
      <IonButtons slot="end">
        <IonButton :aria-label="'Acciones de ' + producto.nombre" :disabled="ocupado"
          @click.stop="accion('acciones_prod')">
          <IonIcon slot="icon-only" :icon="ellipsisVertical" />
        </IonButton>
      </IonButtons>
    </IonItem>
    <IonItemOptions side="end" @ionSwipe="accion('borrar_gesto')">
      <IonItemOption :disabled="ocupado" @click="accion('editar_prod')">
        <IonIcon slot="start" :icon="createOutline" />Editar
      </IonItemOption>
      <IonItemOption color="danger" expandable :disabled="ocupado" @click="accion('borrar_prod')">
        <IonIcon slot="start" :icon="trashOutline" />Eliminar
      </IonItemOption>
    </IonItemOptions>
  </IonItemSliding>
</template>

<style scoped>
ion-checkbox { flex: 1; min-width: 0; min-height: 52px; --size: 24px; }
ion-checkbox::part(label) { white-space: normal; overflow-wrap: anywhere; }
ion-buttons { margin-inline-start: 8px; }
ion-button { min-width: 44px; min-height: 44px; }
.comprado { color: var(--ion-color-medium); text-decoration: line-through; }
</style>
