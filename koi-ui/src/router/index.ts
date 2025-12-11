import { createRouter, createWebHashHistory } from 'vue-router';
import { useConfigStore } from '@/store/config.ts';
import { useTabView } from '@/store/tabView.ts';

const KoiLayout = () => import('@/layout/KoiLayout.vue');
const Home = () => import('@/pages/home/index.vue');
const User = () => import('@/pages/user/index.vue');
const Setting = () => import('@/pages/setting/index.vue');
const Login = () => import('@/pages/login/index.vue');
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
  {
    path: '/login',
    component: Login,
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
const whiteList = ['/setting', '/login'];
router.beforeEach((to, _from, next) => {
  const configStore = useConfigStore();
  const tabView = useTabView();
  if (whiteList.includes(to.path)) {
    next();
  } else {
    if (!configStore.storage) {
      next('/setting');
    } else {
      const token = localStorage.getItem('token');
      if (!token) {
        next({ path: '/login', replace: true });
      } else {
        tabView.addTag(to);
        next();
      }
    }
  }
});
export default router;
