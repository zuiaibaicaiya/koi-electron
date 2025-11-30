<script lang="ts" setup>
import { ref } from 'vue';

import type { TabsPaneContext } from 'element-plus';

const activeName = ref('home');
const tabList = ref([
  {
    label: 'Home',
  },
]);
const handleClick = (tab: TabsPaneContext, event: Event) => {
  // console.log(tab, event);
  console.log(tab);
};

const activeIndex = ref('1');
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
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
          <el-menu-item index="1">Processing Center</el-menu-item>
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
      <el-tabs
        v-model="activeName"
        class="demo-tabs"
        editable
        @tab-click="handleClick"
      >
        <el-tab-pane name="home">
          <template #label>
            <router-link to="/">home</router-link>
          </template>
        </el-tab-pane>
        <el-tab-pane name="user">
          <template #label>
            <router-link to="/user">user</router-link>
          </template>
        </el-tab-pane>
      </el-tabs>

      <el-container>
        <el-aside width="200px">Aside</el-aside>

        <el-main>
          <router-view></router-view>
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
