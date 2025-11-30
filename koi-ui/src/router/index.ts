import { createRouter, createWebHashHistory } from 'vue-router';
import { useConfigStore } from '@/store/config.ts';
const KoiLayout = () => import('@/layout/KoiLayout.vue');
const Home = () => import('@/pages/home/index.vue');
const User = () => import('@/pages/user/index.vue');
const Setting = () => import('@/pages/setting/index.vue');
const routes = [
  {
    path: '/',
    component: KoiLayout,
    children: [
      {
        path: '',
        component: Home,
      },
      {
        path: '/user',
        component: User,
      },
    ],
  },
  {
    path: '/setting',
    component: Setting,
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
const whiteList = ['/setting'];
router.beforeEach((to, _from, next) => {
  const configStore = useConfigStore();
  if (whiteList.includes(to.path)) {
    next();
  } else {
    if (!configStore.storage) {
      next('/setting');
    } else {
      next();
    }
  }
});
export default router;
