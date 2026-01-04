<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getUserList } from '@/api/user.ts';

const userList = ref<Array<API.User>>([]);
onMounted(() => {
  getUserList().then(({ data }) => {
    userList.value = data.items;
  });
});
</script>

<template>
  <div>
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="id" label="id" width="180" />
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column label="角色" width="180">
        <template #default="{ row }">
          {{ row?.role.name }}
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建日期" />
    </el-table>
  </div>
</template>

<style scoped></style>
