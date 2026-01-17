import { defineStore } from 'pinia';
import { getCurrentUserInfo } from '@/api/user.ts';

export const useUserStore = defineStore('user', {
  state: (): { user: API.User | undefined } => {
    return {
      user: undefined,
    };
  },
  actions: {
    async getCurrentUser() {
      try {
        const { data: user, status, message } = await getCurrentUserInfo();
        this.user = user;
        return Promise.resolve({
          status,
          message,
        });
      } catch (e) {
        return Promise.reject(e);
      }
    },
  },
});
