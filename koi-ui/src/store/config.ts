import { defineStore } from 'pinia';
import Store from 'electron-store';
import { useDark, usePreferredDark } from '@vueuse/core';
import { watch } from 'vue';

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
    const isDark = useDark({
      selector: 'html',
      attribute: 'class',
      valueDark: 'dark',
      valueLight: 'light',
    });
    const prefersDark = usePreferredDark();
    watch(
      prefersDark,
      (dark) => {
        isDark.value = dark;
      },
      { immediate: true },
    );

    return {
      isDark: isDark.value,
      storage: store.get('storage') as string,
      backup: store.get('backup') as string,
    };
  },
  actions: {},
});
