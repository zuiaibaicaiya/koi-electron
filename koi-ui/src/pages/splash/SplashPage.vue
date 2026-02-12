<script setup lang="ts">
import { onMounted } from 'vue';
import request from '@/request';
import { useRouter } from 'vue-router';
const router = useRouter();
onMounted(() => {
  request('/ping').finally(() => {
    router.push({ path: '/home' });
  });
});
</script>

<template>
  <a-spin tip="努力加载中..." class="loading" fullscreen/>
</template>

<style scoped>

</style>
