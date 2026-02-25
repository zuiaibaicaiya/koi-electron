<script setup lang="ts">
import { ProTable } from '@/components/ProTable/src';
import useTable from '@/components/ProTable/src/hooks/useTable.ts';
import { computed, ref } from 'vue';
import { getUserList } from '@/api/user.ts';
import type { TableProps } from 'antdv-next';
const columns = ref([
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'username',
    dataIndex: 'username',
    key: 'username',
  },
  {
    title: 'action',
    dataIndex: 'action',
    key: 'action',
  },
]);
const [register, { reload }] = useTable({
  columns,
  api: getUserList,
});
const checkStrictly = ref(false);

const rowSelection = computed<TableProps['rowSelection']>(() => ({
  checkStrictly: checkStrictly.value,
  onChange: (selectedRowKeys, selectedRows, info) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      'selectedRows: ',
      selectedRows,
      'info',
      info,
    );
  },
  onSelect: (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  },
}));
</script>

<template>
  <div>
    <pro-table @register="register" rowKey="id" :row-selection="rowSelection">
      <template #title>
        <a-button type="primary" @click="reload">reload</a-button>
      </template>
      <template #action-bar>
        <a-button type="primary" @click="reload">reload</a-button>
      </template>
      <template #action>
        <a-button type="primary">btn </a-button>
      </template>
    </pro-table>
  </div>
</template>

<style scoped></style>
