import { defineStore } from 'pinia';
import { getCurrentUserInfo } from '@/api/user.ts';

export const useUserStore = defineStore('user', {
  state: (): { user: API.User } => {
    return {
      user: { username: '', id: 0 },
    };
  },
  actions: {
    async getCurrentUser() {
      const { data: user, status, message } = await getCurrentUserInfo();
      this.user = user;
      return Promise.resolve({
        status,
        message,
      });
    },
  },
});
