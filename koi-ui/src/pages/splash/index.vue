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
  <div class="loading" v-loading="true" element-loading-text="努力加载中..."></div>
</template>

<style scoped>
.loading {
  position: absolute;
  width: 100vw;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
