import { createApp } from 'vue';
import App from './App.vue';
import './index.css';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import router from '@/router';
import { createPinia } from 'pinia';
const pinia = createPinia();
createApp(App).use(router).use(pinia).mount('#root');
