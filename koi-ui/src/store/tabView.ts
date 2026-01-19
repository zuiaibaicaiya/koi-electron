import { defineStore } from 'pinia';
import type { RouteLocationNormalized, Router, RouteRecordNormalized } from 'vue-router';
import { useRouter } from 'vue-router';

interface State {
  tabViewList: RouteLocationNormalized[];
}

export const useTabView = defineStore('tabView', {
  state: (): State => {
    const router = useRouter();
    // 获取所有路由
    const allRoutes: RouteRecordNormalized[] = router.getRoutes();
    const home = allRoutes.find((r) => r.path === '/home');
    return {
      tabViewList: [home as unknown as RouteLocationNormalized],
    };
  },
  actions: {
    addTag(route: RouteLocationNormalized) {
      if (!this.tabViewList.some((v) => v.path === route.path)) {
        this.tabViewList.push(route);
      }
    },
    remove(route: RouteLocationNormalized) {
      this.tabViewList = this.tabViewList.filter((v) => v.fullPath !== route.fullPath);
    },
    closeLeft(route: RouteLocationNormalized) {
      const tmp: RouteLocationNormalized[] = [];
      let flag = false;
      for (const _route of this.tabViewList) {
        if (_route.path === route.path) {
          flag = true;
        }
        if (flag) {
          tmp.push(_route);
        } else {
          if (_route.path === '/home') {
            tmp.push(_route);
          }
        }
      }
      this.tabViewList = tmp;
    },
    closeRight(route: RouteLocationNormalized) {
      const tmp: RouteLocationNormalized[] = [];
      for (const _route of this.tabViewList) {
        tmp.push(_route);
        if (_route.path === route.path) {
          break;
        }
      }
      this.tabViewList = tmp;
    },
    closeAll(router: Router) {
      const allRoutes: RouteRecordNormalized[] = router.getRoutes();
      const home = allRoutes.find((r) => r.path === '/home');
      this.tabViewList = [home as unknown as RouteLocationNormalized];
    },
  },
  persist: true,
});
