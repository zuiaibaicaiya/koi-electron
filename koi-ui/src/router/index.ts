import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { useConfigStore } from '@/store/config.ts';
import { useTabView } from '@/store/tabView.ts';
import { useUserStore } from '@/store/user.ts';
import { message } from 'antdv-next';

const KoiLayout = () => import('@/layout/KoiLayout.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: KoiLayout,
    redirect: '/splash',
    meta: {
      title: '跳转页',
    },
    children: [],
  },
  {
    path: '/splash',
    component: ()=>import('@/pages/splash/SplashPage.vue'),
    meta: {
      title: '启动页',
    },
  },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
const whiteList = ['/setting', '/login', '/splash', '/'];
router.beforeEach(async (to, _from, next) => {
  const configStore = useConfigStore();
  const tabView = useTabView();
  const userStore = useUserStore();
  if (whiteList.includes(to.path)) {
    next();
  } else {
    if (!configStore.storage) {
      next('/setting');
    } else {
      const token = localStorage.getItem('token');
      if (!token) {
        tabView.$reset();
        next({ path: '/login', replace: true });
      } else {
        if (!userStore.user) {
          const { status, message:msg } = await userStore.getCurrentUser();
          if (status && status !== 200) {
            message.error(msg);
            localStorage.clear();
            return next({ path: '/login', replace: true });
          }
        }
        next();
      }
    }
  }
});
router.afterEach((to) => {
  if (!whiteList.includes(to.path)) {
    const tabView = useTabView();
    tabView.addTag(to);
  }
});
export default router;
