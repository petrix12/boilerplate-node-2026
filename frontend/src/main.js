import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// Establish a global property for the application name, allowing it to be accessed throughout the app.
app.config.globalProperties.$appName = import.meta.env.VITE_APP_NAME || 'NodeVue Boilerplate'

app.use(createPinia())
app.use(router)

app.mount('#app')
