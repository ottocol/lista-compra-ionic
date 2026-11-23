import { createApp } from 'vue'
import { IonicVue } from '@ionic/vue'
import App from './App.vue'
import router from './router'

// El CSS estructural es necesario: Ionic no consiste solo en sus componentes.
import '@ionic/vue/css/core.css'
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'
import '@ionic/vue/css/padding.css'
import '@ionic/vue/css/text-alignment.css'
import './style.css'

const app = createApp(App).use(IonicVue).use(router)
router.isReady().then(() => app.mount('#app'))
