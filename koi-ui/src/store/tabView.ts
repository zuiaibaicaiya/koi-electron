import { defineStore } from 'pinia';
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
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
  },
  persist: true,
});
