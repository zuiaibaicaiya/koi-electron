<script setup lang="ts">
import type { TabsProps } from 'antdv-next';
import { useRouter } from 'vue-router';
const router = useRouter();

const items: TabsProps['items'] = [
  {
    key: '/home',
    label: '首页',
  },
  {
    key: '/user',
    label: '用户管理',
  },
];
function tabClick(key: string) {
  router.replace(key);
}
</script>

<template>
  <a-layout>
    <a-layout-header class="title-bar">
      <a-tabs centered :items="items" @tab-click="tabClick"> </a-tabs>
    </a-layout-header>
    <a-layout-content>
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive>
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </a-layout-content>
    <a-layout-footer> Footer </a-layout-footer>
  </a-layout>
</template>

<style scoped lang="scss">
.title-bar {
  color: #fff;
  background-color: black;
  user-select: none;
  app-region: drag;
  height: env(titlebar-area-height, var(--fallback-title-bar-height));
  //width: env(titlebar-area-width, 100%);
  :deep(.ant-tabs-nav-list) {
    app-region: no-drag;
  }
  :deep(.ant-tabs-content-holder) {
    display: none;
  }
  :deep(.ant-tabs-ink-bar) {
    display: none;
  }
  :deep(.ant-tabs-nav::before) {
    border-bottom: none;
  }
}
</style>
