<template>
  <a-config-provider
    :theme="{
      algorithm: theme.darkAlgorithm,
    }"
  >
  <router-view/>
  </a-config-provider>
</template>

<script setup lang="ts">
import { theme } from 'antdv-next';
</script>
