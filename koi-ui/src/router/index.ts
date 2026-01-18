import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router';
import { useConfigStore } from '@/store/config.ts';
import { useTabView } from '@/store/tabView.ts';
import { useUserStore } from '@/store/user.ts';
import { ElMessage } from 'element-plus';

const KoiLayout = () => import('@/layout/KoiLayout.vue');
const Home = () => import('@/pages/home/index.vue');
const User = () => import('@/pages/user/index.vue');
const UserDetail = () => import('@/pages/user/detail.vue');
const Role = () => import('@/pages/role/index.vue');
const Department = () => import('@/pages/department/index.vue');
const Permission = () => import('@/pages/permission/index.vue');
const Setting = () => import('@/pages/setting/index.vue');
const Login = () => import('@/pages/login/index.vue');
const Record = () => import('@/pages/record/index.vue');
const Splash = () => import('@/pages/splash/index.vue');

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: KoiLayout,
    redirect: '/splash',
    meta: {
      title: '跳转页',
    },
    children: [
      {
        path: '/home',
        component: Home,
        meta: {
          title: '首页',
        },
      },
      {
        path: '/user',
        component: User,
        meta: {
          title: '用户管理',
        },
      },
      {
        path: '/user/:id',
        component: UserDetail,
        meta: {
          title: '用户详情',
        },
      },
      {
        path: '/role',
        component: Role,
        meta: {
          title: '角色管理',
        },
      },
      {
        path: '/department',
        component: Department,
        meta: {
          title: '部门管理',
        },
      },
      {
        path: '/permission',
        component: Permission,
        meta: {
          title: '权限管理',
        },
      },
      {
        path: '/record',
        component: Record,
        meta: {
          title: '录音机',
        },
      },
    ],
  },
  {
    path: '/setting',
    component: Setting,
  },
  {
    path: '/splash',
    component: Splash,
    meta: {
      title: '启动页',
    },
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录页',
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
          try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            const { status, message } = await userStore.getCurrentUser();
            if (status && status !== 200) {
              ElMessage.error(message);
              localStorage.clear();
              return next({ path: '/login', replace: true });
            }
          } catch (e) {
            console.log(e);
          }
        }
        tabView.addTag(to);
        next();
      }
    }
  }
});
export default router;
