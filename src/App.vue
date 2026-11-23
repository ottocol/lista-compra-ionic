<script setup>
 import ListaCompra from './components/ListaCompra.vue';
 import Login from './components/Login.vue';
 import { getUsuario } from './servicios/api.js';
 import {ref} from 'vue';

 const hay_usuario = ref(undefined)
 let usuario = null

 async function comprobarSesion() {
    usuario = await getUsuario()
    hay_usuario.value = usuario != null
 }

async function loginOK() {
    usuario = await getUsuario() //antes de que el cambio en hay_usuario fuerce el repintado
    hay_usuario.value = true
    
}

function logoutOK() {
   usuario = null
   hay_usuario.value = false
}

 comprobarSesion()
</script>

<template>
  <main>
  <h1>Lista de la compra</h1>
  <p v-if="hay_usuario==undefined">Comprobando sesión...</p>
  <Login @login_ok="loginOK" v-else-if="hay_usuario===false"/>
  <ListaCompra :email="usuario.email"  @logout_ok="logoutOK" v-else/>
  </main>
</template>
