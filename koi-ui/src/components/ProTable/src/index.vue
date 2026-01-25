<script setup lang="ts" generic="T">
import { useSlots, type VNode } from 'vue';

interface Column {
  prop: string;
  label: string;
  slot?: string;
  [key: string]: any;
}

interface Props {
  dataSource: Array<T>;
  columns: Column[];
}

defineProps<Props>();

defineSlots<{
  'toolbar-left': () => VNode[];
  'toolbar-right': () => VNode[];
  [key: string]: (props: { row: T; $index: number; column: Column }) => VNode[];
}>();

// 检查插槽是否存在
const hasSlot = (name: string) => {
  return name in useSlots();
};
</script>

<template>
  <div class="table-container">
    <!-- 工具栏区域 -->
    <div v-if="hasSlot('toolbar-left') || hasSlot('toolbar-right')" class="table-toolbar">
      <div v-if="hasSlot('toolbar-left')" class="toolbar-left">
        <slot name="toolbar-left" />
      </div>
      <div v-if="hasSlot('toolbar-right')" class="toolbar-right">
        <slot name="toolbar-right" />
      </div>
      <div class="clearfix"></div>
    </div>

    <!-- 表格区域 -->
    <el-table :data="dataSource" row-key="id" v-bind="$attrs" class="custom-table">
      <el-table-column v-for="column in columns" :key="column.prop" v-bind="column">
        <!-- 动态slot处理 -->
        <template v-if="column.slot" #default="scope">
          <slot :name="column.slot" v-bind="{ ...scope }" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.table-container {
  margin: 0 6px;
}

.table-toolbar {
  margin-bottom: 16px;
  padding: 12px 0;
}

.toolbar-left {
  float: left;
}

.toolbar-right {
  float: right;
}

.clearfix {
  clear: both;
}

.custom-table {
  width: 100%;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .table-toolbar {
    flex-direction: column;
    gap: 12px;
  }

  .toolbar-left,
  .toolbar-right {
    float: none;
    width: 100%;
  }
}
</style>
