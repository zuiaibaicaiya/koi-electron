<script setup lang="ts">
import { ProTable } from '@/components/ProTable/src';
import useTable from '@/components/ProTable/hooks/useTable.ts';
import { ref } from 'vue';
import { getUserList } from '@/api/user.ts';
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
</script>

<template>
  <pro-table @register="register" rowKey="id">
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
</template>

<style scoped></style>
