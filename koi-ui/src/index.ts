import { createApp, markRaw } from 'vue';
import App from './App.vue';
import './index.css';
import router from '@/router';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createPinia } from 'pinia';
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
pinia.use(({ store }) => {
  store.$router = markRaw(router);
});

createApp(App).use(router).use(pinia).mount('#root');
