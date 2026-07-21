import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/styles.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initializeApplicationData } from './services/storageService'

await initializeApplicationData()

createApp(App).use(router).mount('#app')
