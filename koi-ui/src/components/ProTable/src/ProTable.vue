<script setup lang="ts">
import { type MaybeRef, ref, unref } from 'vue';
import type { TableProps } from 'antdv-next';
import type { TableAction } from '@/components/ProTable/src/types/tableAction.ts';
const emits = defineEmits(['register']);
const tableColumns = ref<TableProps['columns']>([]);
const tableDataSource = ref([]);
const loadingRef = ref(false);
function setColumns(columns: MaybeRef<TableProps['columns']>) {
  tableColumns.value = unref(columns);
}
function setDataSource(dataSource: any) {
  tableDataSource.value = unref(dataSource);
}
function setLoading(loading: MaybeRef<boolean>) {
  loadingRef.value = unref(loading);
}
const tableAction: TableAction = {
  setColumns,
  setDataSource,
  setLoading,
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
    :loading="loadingRef"
    v-bind="$attrs"
  >
    <template #bodyCell="{ column, record, index, text }">
      <slot :name="column.dataIndex" v-bind="{ column, record, index, text }" />
    </template>
  </a-table>
</template>

<style scoped></style>
