<script lang="ts" setup>
import { ref, watchPostEffect } from 'vue';
import type { TabsPaneContext } from 'element-plus';
import { useTabView } from '@/store/tabView.ts';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const activeName = ref('system');
const activeTab = ref('/user');
const handleClick = (tab: TabsPaneContext) => {
  console.log(tab.props.name);
  activeTab.value = tab.props.name as string;
  router.replace({ path: activeTab.value });
};
const handleHeaderClick = (tab: TabsPaneContext) => {
  activeName.value = tab.props.name as string;
};
watchPostEffect(() => {
  activeTab.value = route.fullPath;
});

const tabView = useTabView();
</script>

<template>
  <div class="koi-layout">
    <el-container>
      <el-header style="height: 100px; margin-top: 1px">
        <el-tabs
          v-model="activeName"
          type="border-card"
          @tab-click="handleHeaderClick"
        >
          <el-tab-pane label="仪表盘" name="dashboard">仪表盘</el-tab-pane>
          <el-tab-pane label="客户管理" name="customer">客户管理</el-tab-pane>
          <el-tab-pane label="系统设置" name="system">
            <el-space>
              <router-link to="/user">
                <el-button
                  :type="$route.fullPath === '/user' ? 'primary' : 'default'"
                  link
                >
                  用户管理
                </el-button>
              </router-link>
              <router-link to="/role">
                <el-button
                  :type="$route.fullPath === '/role' ? 'primary' : 'default'"
                  link
                >
                  角色管理
                </el-button>
              </router-link>
              <router-link to="/department">
                <el-button
                  :type="
                    $route.fullPath === '/department' ? 'primary' : 'default'
                  "
                  link
                >
                  部门管理
                </el-button>
              </router-link>
              <router-link to="/permission">
                <el-button
                  :type="
                    $route.fullPath === '/permission' ? 'primary' : 'default'
                  "
                  link
                >
                  权限管理
                </el-button>
              </router-link>
              <router-link to="/record">
                <el-button
                  :type="$route.fullPath === '/record' ? 'primary' : 'default'"
                  link
                >
                  录音机
                </el-button>
              </router-link>
            </el-space>
          </el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main>
        <el-tabs v-model="activeTab" @tab-click="handleClick">
          <el-tab-pane
            v-for="item in tabView.tabViewList"
            :name="item.fullPath"
            :key="item.fullPath"
            lazy
            :label="item!.meta!.title as unknown as string"
          >
          </el-tab-pane>
        </el-tabs>
        <el-card style="min-height: calc(100vh - 160px)">
          <router-view v-slot="{ Component, route }">
            <transition name="fade-transform" mode="out-in">
              <keep-alive>
                <component :is="Component" :key="route.fullPath" />
              </keep-alive>
            </transition>
          </router-view>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>

<style lang="scss" scoped>
.koi-layout {
  :deep(.el-card) {
    --el-card-padding: 0;
  }
  & .side {
    height: 100vh;
    margin: 6px 6px 0 0;
    overflow-y: hidden;
    &.open {
      --el-aside-width: 300px;
    }
    &.closed {
      --el-aside-width: 40px;
    }
  }

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
