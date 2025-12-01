import { createRouter, createWebHashHistory } from 'vue-router';
import { useConfigStore } from '@/store/config.ts';
import { useTabView } from '@/store/tabView.ts';
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
        meta: {
          title: 'home',
        },
      },
      {
        path: '/user',
        component: User,
        meta: {
          title: 'user',
        },
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
  const tabView = useTabView();
  if (whiteList.includes(to.path)) {
    next();
  } else {
    if (!configStore.storage) {
      next('/setting');
    } else {
      tabView.addTag(to);
      next();
    }
  }
});
export default router;
