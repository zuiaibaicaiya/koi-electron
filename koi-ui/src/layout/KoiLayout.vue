<script lang="ts" setup>
import { nextTick, reactive, ref, useTemplateRef, watchPostEffect } from 'vue';
import type { DropdownInstance, TabsPaneContext } from 'element-plus';
import { useTabView } from '@/store/tabView.ts';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const activeName = ref('system');
const activeTab = ref('/user');
const dropdownRef = useTemplateRef<DropdownInstance>('dropdown');
function showClick() {
  if (!dropdownRef.value) return;
  dropdownRef.value.handleOpen();
}
const tmpPosition = reactive({
  left: '',
  top: '',
});
const handleClick = (tab: TabsPaneContext) => {
  activeTab.value = tab.props.name as string;
  router.replace({ path: activeTab.value });
};
function onRightClick(e: MouseEvent) {
  const { x, y, width, height } = (
    e.target as HTMLElement
  ).getBoundingClientRect();
  tmpPosition.left = `${x + width / 2}px`;
  tmpPosition.top = `${y + height}px`;
  nextTick(() => {
    showClick();
  });
}
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
      <el-header class="title-bar">
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
      <el-main style="margin-top: 100px">
        <el-tabs
          v-model="activeTab"
          @tab-click="handleClick"
          @contextmenu.prevent="onRightClick"
        >
          <el-tab-pane
            v-for="item in tabView.tabViewList"
            :name="item.fullPath"
            :key="item.fullPath"
            lazy
            :label="item!.meta!.title as unknown as string"
          >
          </el-tab-pane>
        </el-tabs>
        <el-dropdown
          ref="dropdown"
          trigger="contextmenu"
          :style="tmpPosition"
          style="position: absolute"
        >
          <span></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>关闭当前</el-dropdown-item>
              <el-dropdown-item>关闭左侧</el-dropdown-item>
              <el-dropdown-item>关闭右侧</el-dropdown-item>
              <el-dropdown-item>关闭全部</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
:root {
  --fallback-title-bar-height: 40px;
}
.koi-layout {
  .title-bar {
    position: fixed;
    z-index: 99999999999;
    width: 100vw;
    height: 100px;
    :deep(.el-tabs__nav-wrap) {
      user-select: none;
      app-region: drag;
      height: env(titlebar-area-height, var(--fallback-title-bar-height));
      width: env(titlebar-area-width, 100%);
      padding-left: env(titlebar-area-x, 0);
    }
    :deep(.el-tabs__nav) {
      app-region: no-drag;
    }
  }

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
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.2s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
