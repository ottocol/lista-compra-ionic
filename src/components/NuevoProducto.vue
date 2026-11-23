<script setup>
import { IonItem, IonInput, IonButton } from '@ionic/vue'

defineProps({ ocupado: Boolean })
const nombre = defineModel({ type: String, default: '' })
const emit = defineEmits(['nuevo_prod'])

function doAnyadir() {
  const limpio = nombre.value.trim()
  if (limpio) emit('nuevo_prod', limpio)
}
</script>

<template>
  <form @submit.prevent="doAnyadir" class="alta-producto">
    <IonItem lines="none">
      <IonInput v-model="nombre" label="Nuevo producto" label-placement="stacked"
        placeholder="Por ejemplo, café" autocomplete="off" enterkeyhint="done"
        required :disabled="ocupado" />
      <IonButton slot="end" type="submit" :disabled="ocupado || !nombre.trim()">Añadir</IonButton>
    </IonItem>
  </form>
</template>

<style scoped>
.alta-producto { margin-block: 1rem; }
</style>
