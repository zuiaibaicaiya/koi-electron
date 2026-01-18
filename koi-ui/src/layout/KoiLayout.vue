<script lang="ts" setup>
import { type CSSProperties, nextTick, reactive, ref, shallowRef, useTemplateRef, watchPostEffect } from 'vue';
import type { DropdownInstance, TabsPaneContext } from 'element-plus';
import { useTabView } from '@/store/tabView.ts';
import { type RouteLocationNormalized, useRoute, useRouter } from 'vue-router';

const tabView = useTabView();
const router = useRouter();
const route = useRoute();
const activeName = ref('system');
const activeTab = ref('/user');
const dropdownRef = useTemplateRef<DropdownInstance>('dropdown');
const tmpPosition = reactive<CSSProperties>({
  left: '',
  top: '',
  position: 'fixed',
});
const current = shallowRef<RouteLocationNormalized>();
function onRightClick(e: MouseEvent, item: RouteLocationNormalized) {
  const { x, y, height } = (e.currentTarget as HTMLElement).getBoundingClientRect();
  tmpPosition.left = `${x}px`;
  tmpPosition.top = `${y + height}px`;
  nextTick(() => {
    current.value = item;
    dropdownRef.value?.handleOpen();
  });
}
const handleHeaderClick = (tab: TabsPaneContext) => {
  activeName.value = tab.props.name as string;
};
watchPostEffect(() => {
  activeTab.value = route.path;
});
function changeTab(_route: RouteLocationNormalized) {
  router.push({
    path: _route.path,
    query: _route.query,
  });
}
function closeTab(_route: RouteLocationNormalized) {
  tabView.remove(_route);
  router.replace('/home');
}
function selectDropItem(command: string | number | object) {
  const query = {
    __time: new Date().getTime(),
  };
  Object.assign(query, current.value?.query);
  switch (command) {
    case 'refresh':
      router.replace({ path: current.value?.path, query });
      break;
    case 'left':
      break;
    case 'right':
      break;
    case 'all':
      tabView.tabViewList = [];
      nextTick(() => {
        router.replace('/home');
      });
      break;
  }
}
</script>

<template>
  <div class="koi-layout">
    <el-container>
      <el-header class="title-bar">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleHeaderClick">
          <el-tab-pane label="仪表盘" name="dashboard">仪表盘</el-tab-pane>
          <el-tab-pane label="客户管理" name="customer">客户管理</el-tab-pane>
          <el-tab-pane label="系统设置" name="system">
            <el-space>
              <router-link to="/user">
                <el-button :type="$route.path === '/user' ? 'primary' : 'default'" link> 用户管理 </el-button>
              </router-link>
              <router-link to="/role">
                <el-button :type="$route.path === '/role' ? 'primary' : 'default'" link> 角色管理 </el-button>
              </router-link>
              <router-link to="/department">
                <el-button :type="$route.path === '/department' ? 'primary' : 'default'" link> 部门管理 </el-button>
              </router-link>
              <router-link to="/permission">
                <el-button :type="$route.path === '/permission' ? 'primary' : 'default'" link> 权限管理 </el-button>
              </router-link>
              <router-link to="/record">
                <el-button :type="$route.path === '/record' ? 'primary' : 'default'" link> 录音机 </el-button>
              </router-link>
            </el-space>
          </el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main style="margin-top: 100px; width: 100vw">
        <div style="width: 100%; position: fixed">
          <el-scrollbar>
            <div class="scrollbar-flex-content">
              <el-tag
                name="fade-transform"
                mode="out-in"
                class="scrollbar-item"
                :closable="item.path !== '/home'"
                v-for="item in tabView.tabViewList"
                @contextmenu.capture="(e) => onRightClick(e, item)"
                :key="item.path"
                @click="changeTab(item)"
                @close="closeTab(item)"
                size="large"
                :type="$route.path === item.path ? 'primary' : 'info'"
              >
                {{ item?.meta?.title }}
              </el-tag>
              <el-dropdown :popper-style="tmpPosition" ref="dropdown" trigger="contextmenu" @command="selectDropItem">
                <div></div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item command="refresh">刷新当前</el-dropdown-item>
                    <el-dropdown-item command="left">关闭左侧</el-dropdown-item>
                    <el-dropdown-item command="right">关闭右侧</el-dropdown-item>
                    <el-dropdown-item command="all">关闭全部</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
          </el-scrollbar>
        </div>
        <el-card style="margin-top: 45px">
          <el-scrollbar max-height="calc(100vh - 150px)">
            <router-view v-slot="{ Component, route }">
              <transition name="fade-transform" mode="out-in">
                <keep-alive>
                  <component :is="Component" :key="route.fullPath" />
                </keep-alive>
              </transition>
            </router-view>
          </el-scrollbar>
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
  .scrollbar-flex-content {
    display: flex;
    width: fit-content;
    top: 100px;
    z-index: 9999;
    height: 45px;
  }
  .scrollbar-item {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100px;
    margin-right: 10px;
    text-align: center;
  }
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
  :deep(.el-tag) {
    user-select: none;
    cursor: pointer;
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
