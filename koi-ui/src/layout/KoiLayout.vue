<script setup lang="ts">
import type { TabsProps } from 'antdv-next';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useTabView } from '@/store/tabView.ts';
const tabView = useTabView();

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
const cacheRoutes = computed(
  () =>
    tabView.tabViewList
      .map((v) => v.name)
      .filter((v) => v) as unknown as Array<string>,
);
</script>

<template>
  <a-layout>
    <a-layout-header class="title-bar">
      <a-tabs centered :items="items" @tab-click="tabClick"> </a-tabs>
    </a-layout-header>
    <a-layout-content style="width: 100vw; height: calc(100vh - 40px)">
      <router-view v-slot="{ Component, route }">
        <transition name="fade-transform" mode="out-in">
          <keep-alive :include="cacheRoutes">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </transition>
      </router-view>
    </a-layout-content>
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
  padding-left: env(titlebar-area-x, 0);

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
