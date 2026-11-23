import { createRouter, createWebHistory } from '@ionic/vue-router'
import { getUsuario } from '../servicios/api'
import LoginPage from '../pages/LoginPage.vue'
import ListaPage from '../pages/ListaPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/lista' },
    { path: '/login', component: LoginPage },
    { path: '/lista', component: ListaPage, meta: { requiereSesion: true } },
    { path: '/:pathMatch(.*)*', redirect: '/lista' },
  ],
})

// La protección real de los datos sigue siendo la RLS de Supabase.
router.beforeEach(async (to) => {
  const usuario = await getUsuario()
  if (to.meta.requiereSesion && !usuario) return '/login'
  if (to.path === '/login' && usuario) return '/lista'
})

export default router
