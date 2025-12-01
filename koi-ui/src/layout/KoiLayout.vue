<script lang="ts" setup>
import { ref, watchPostEffect } from 'vue';

import type { TabsPaneContext } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { useTabView } from '@/store/tabView.ts';
const tabView = useTabView();
const route = useRoute();
const router = useRouter();
const activeName = ref(route.fullPath);
const activeIndex = ref(route.fullPath);
watchPostEffect(() => {
  activeIndex.value = route.fullPath;
  activeName.value = route.fullPath;
});
const handleClick = (tab: TabsPaneContext, event: Event) => {
  router.push(tab.props!.name);
};

const handleSelect = (key: string, keyPath: string[], item) => {
  // tabView.addTag(key);
};
</script>

<template>
  <div class="koi-layout">
    <el-container>
      <el-header>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
        >
          <el-menu-item index="/">
            <template #title>
              <router-link to="/"> home </router-link>
            </template>
          </el-menu-item>
          <el-menu-item index="/user">
            <template #title>
              <router-link to="/user"> user </router-link>
            </template>
          </el-menu-item>
          <el-sub-menu index="2">
            <template #title>Workspace</template>
            <el-menu-item index="2-1">item one</el-menu-item>
            <el-menu-item index="2-2">item two</el-menu-item>
            <el-menu-item index="2-3">item three</el-menu-item>
            <el-sub-menu index="2-4">
              <template #title>item four</template>
              <el-menu-item index="2-4-1">item one</el-menu-item>
              <el-menu-item index="2-4-2">item two</el-menu-item>
              <el-menu-item index="2-4-3">item three</el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
          <el-menu-item index="3" disabled>Info</el-menu-item>
          <el-menu-item index="4">Orders</el-menu-item>
        </el-menu>
      </el-header>
      <el-tabs v-model="activeName" editable @tab-click="handleClick">
        <el-tab-pane
          v-for="item in tabView.tabViewList"
          :name="item.fullPath"
          :key="item.fullPath"
          :label="item.meta.title"
        />
      </el-tabs>

      <el-container>
        <el-main>
          <router-view v-slot="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.koi-layout {
  :deep(.el-header) {
    --el-header-padding: 0 auto;
    --el-header-height: 40px;
  }
  :deep(.el-main) {
    --el-main-padding: 0;
  }
  :deep(.el-menu--horizontal) {
    --el-menu-horizontal-height: 40px;
  }
}
</style>
