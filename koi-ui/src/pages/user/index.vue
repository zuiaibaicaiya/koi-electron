<script setup lang="ts">
import { ref } from 'vue';

const val = ref('');
</script>

<template>
  <div>
    <h1>user</h1>
    <el-input v-model="val" />
  </div>
</template>

<style scoped></style>
