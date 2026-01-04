<script lang="ts" setup>
import { ref } from 'vue';
import type { TabsPaneContext } from 'element-plus';
import { useTabView } from '@/store/tabView.ts';

const activeName = ref('system');
const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event);
};
const tabView = useTabView();
</script>

<template>
  <div class="koi-layout">
    <el-container>
      <el-header style="height: 80px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="仪表盘" name="dashboard">仪表盘</el-tab-pane>
          <el-tab-pane label="客户管理" name="customer">客户管理</el-tab-pane>
          <el-tab-pane label="系统设置" name="system">
            <el-space>
              <router-link to="/user">
                <el-button link>用户管理</el-button>
              </router-link>
              <router-link to="/role">
                <el-button link>角色管理</el-button>
              </router-link>
              <router-link to="/department">
                <el-button link>部门管理</el-button>
              </router-link>
              <router-link to="/permission">
                <el-button link>权限管理</el-button>
              </router-link>
            </el-space>
          </el-tab-pane>
        </el-tabs>
      </el-header>
      <el-container>
        <el-main>
          <el-tabs v-model="activeName" editable>
            <el-tab-pane
              v-for="item in tabView.tabViewList"
              :name="item.path"
              :key="item.path"
              :label="item!.meta!.title"
            />
          </el-tabs>
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
