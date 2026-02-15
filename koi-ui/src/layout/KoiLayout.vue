<script setup lang="ts">
import type { TabsProps } from 'antdv-next';
import { useRouter } from 'vue-router';
import { computed, h } from 'vue';
import { useTabView } from '@/store/tabView.ts';
import HomeTab from '@/layout/HomeTab.vue';
import UserTab from '@/layout/UserTab.vue';

const tabView = useTabView();

const router = useRouter();

const items: TabsProps['items'] = [
  {
    key: '/home',
    label: '首页',
    content: h(HomeTab),
  },
  {
    key: '/user',
    label: '用户管理',
    content: h(UserTab),
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
    <a-layout-content style="width: 100vw; height: calc(100vh - 72px)">
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
  width: 100vw;
  color: #fff;
  background-color: black;
  height: 72px;
  margin: 0 auto;
  padding: 0;
  //padding-left: env(titlebar-area-x, 0);
  :deep(.ant-tabs-nav) {
    &::before {
      display: none;
    }
    height: env(titlebar-area-height, var(--fallback-title-bar-height));
    user-select: none;
    app-region: drag;
    margin: 0;
    padding: 0;
    .ant-tabs-nav-list {
      height: 100%;
      app-region: no-drag;
    }
  }
}
</style>
