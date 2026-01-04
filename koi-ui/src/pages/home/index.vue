<script setup lang="ts">
import { UseDark } from '@vueuse/components';
</script>

<template>
  <div>
    <h1>home</h1>
    <UseDark v-slot="{ isDark, toggleDark }">
      <el-button type="primary" @click="toggleDark()">
        Is Dark: {{ isDark }}
      </el-button>
    </UseDark>
  </div>
</template>

<style scoped></style>
