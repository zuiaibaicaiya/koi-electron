import { defineStore } from 'pinia';
import Store from 'electron-store';
import { useDark, useToggle } from '@vueuse/core';

interface State {
  storage?: string;
  backup?: string;
  isDark: boolean;
}
const store = new Store<State>({
  name: 'koi-electron',
});
// store.openInEditor();
export const useConfigStore = defineStore('config', {
  state: (): State => {
    const isDark = useDark();
    if (store.get('isDark')) {
      if (!isDark.value) {
        const toggleDark = useToggle(isDark);
        toggleDark();
      }
    }
    return {
      isDark: isDark.value,
      storage: store.get('storage') as string,
      backup: store.get('backup') as string,
    };
  },
  actions: {},
});
