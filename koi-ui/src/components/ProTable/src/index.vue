<script setup lang="ts">
interface Column {
  prop: string;
  label: string;
  slot?: string | undefined;
  [key: string]: any;
}
interface Props {
  dataSource: Array<any>;
  columns: Column[];
}
defineProps<Props>();
defineSlots<{
  'toolbar-left': () => any;
  'toolbar-right': () => any;
}>();
</script>

<template>
  <div style="margin: 0 6px">
    <div v-if="$slots['toolbar-left']" style="float: left">
      <slot name="toolbar-left"></slot>
    </div>
    <div v-if="$slots['toolbar-right']" style="float: right">
      <slot name="toolbar-right"></slot>
    </div>
  </div>
  <el-table :data="dataSource">
    <el-table-column
      v-for="column in columns"
      :key="column.prop"
      v-bind="column"
    >
      <template v-if="column?.slot" #default="scope">
        <slot :name="column.slot" v-bind="{ ...scope }" />
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped></style>
