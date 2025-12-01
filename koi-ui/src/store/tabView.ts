import { defineStore } from 'pinia';

export const useTabView = defineStore('tabView', {
  state: () => {
    return {
      tabViewList: [],
    };
  },
  actions: {
    addTag(route) {
      if (!this.tabViewList.some((v) => v.fullPath === route.fullPath)) {
        this.tabViewList.push(route);
      }
    },
  },
  persist: true,
});
