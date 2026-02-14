<script setup lang="ts">
import { type MaybeRef, ref, unref } from 'vue';
import type { TableProps } from 'antdv-next';

const emits = defineEmits(['register']);
const tableColumns = ref<TableProps['columns']>([]);
const tableDataSource = ref([]);
function setColumns(columns: MaybeRef<TableProps['columns']>) {
  tableColumns.value = unref(columns);
}
function setDataSource(dataSource: any) {
  tableDataSource.value = unref(dataSource);
}
const tableAction = {
  setColumns,
  setDataSource,
};
emits('register', {
  tableAction,
});
</script>

<template>
  <a-row justify="space-around">
    <a-col :span="12"> <slot name="title" /> </a-col>
    <a-col :span="12"> <slot name="action-bar" /> </a-col>
  </a-row>
  <a-table
    :columns="tableColumns"
    :data-source="tableDataSource"
    v-bind="$attrs"
  >
    <template #bodyCell="{ column, record, index, text }">
      <slot :name="column.dataIndex" v-bind="{ column, record, index, text }" />
    </template>
  </a-table>
</template>

<style scoped></style>
