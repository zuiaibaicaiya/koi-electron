<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ProTable } from '@/components/ProTable/index.ts';
import { Plus, Refresh } from '@element-plus/icons-vue';
import { getRoleList } from '@/api/role.ts';

const roleList = ref<Array<API.Role>>([]);
const columns = [
  {
    label: 'ID',
    prop: 'id',
  },
  {
    label: '角色名称',
    prop: 'name',
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
  getRoleList().then(({ data }) => {
    roleList.value = data.items;
  });
});
</script>

<template>
  <div>
    <pro-table :data-source="roleList" :columns="columns">
      <template #toolbar-left>
        <el-text> 用户列表 </el-text>
      </template>
      <template #toolbar-right>
        <el-space>
          <el-button type="primary" :icon="Plus"> 新增</el-button>
          <el-button type="primary" :icon="Refresh">刷新</el-button>
        </el-space>
      </template>
      <template #action="{ row }">
        <el-space>
          <el-button type="primary">编辑</el-button>
          <el-button type="danger">删除</el-button>
        </el-space>
      </template>
    </pro-table>
  </div>
</template>

<style scoped></style>
