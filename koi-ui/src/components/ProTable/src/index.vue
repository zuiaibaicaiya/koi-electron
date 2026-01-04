<script setup lang="ts">
interface Column {
  prop: string;
  label: string;
  slot?: string | undefined;
  [key: string]: any;
}
interface Props {
  dataSource: Array<any>;
  columns: Column[];
}
defineProps<Props>();
</script>

<template>
  <el-table :data="dataSource">
    <el-table-column
      v-for="column in columns"
      :key="column.prop"
      v-bind="column"
    >
      <template v-if="column?.slot" #default="scope">
        <slot :name="column.slot" v-bind="{ ...scope }" />
      </template>
    </el-table-column>
  </el-table>
</template>

<style scoped></style>
