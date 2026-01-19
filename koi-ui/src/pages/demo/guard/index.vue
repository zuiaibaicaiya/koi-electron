<script setup lang="ts">
import { onBeforeRouteLeave } from 'vue-router';
import { ElMessageBox } from 'element-plus';

onBeforeRouteLeave(async (_to, _ffrom, next) => {
  const result = await ElMessageBox.confirm('确认离开?', '友情提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  });
  if (result === 'confirm') {
    next(true);
  } else {
    next(false);
  }
});
</script>

<template>
  <h1>离开确认示例</h1>
</template>

<style scoped></style>
