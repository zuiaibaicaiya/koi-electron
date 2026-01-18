<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getUserList } from '@/api/user.ts';
import { ProTable } from '@/components/ProTable/index.ts';
import { Plus, Refresh } from '@element-plus/icons-vue';

const userList = ref<Array<API.User>>([]);
const columns = [
  {
    label: 'ID',
    prop: 'id',
  },
  {
    label: '用户名',
    prop: 'username',
  },
  {
    label: '角色',
    prop: 'role',
    slot: 'role',
  },
  {
    label: '创建日期',
    prop: 'createdAt',
  },
  {
    label: '操作',
    prop: 'action',
    slot: 'action',
  },
];
onMounted(() => {
  getUserList().then(({ data }) => {
    userList.value = data.items;
  });
});
</script>

<template>
  <div>
    <pro-table :data-source="userList" :columns="columns">
      <template #toolbar-left>
        <el-text> 用户列表 </el-text>
      </template>
      <template #toolbar-right>
        <el-space>
          <el-button type="primary" :icon="Plus"> 新增</el-button>
          <el-button type="primary" :icon="Refresh">刷新</el-button>
        </el-space>
      </template>
      <template #role="{ row }">
        {{ row?.role.name }}
      </template>
      <template #action="{ row }">
        <el-space>
          <router-link :to="`/user/${row.id}`">
            <el-button type="primary"> 详情</el-button>
          </router-link>
          <el-button type="primary">编辑</el-button>
          <el-button type="danger">删除</el-button>
        </el-space>
      </template>
    </pro-table>
  </div>
</template>

<style scoped></style>
