<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { addUser, updateUser } from '@/api/user.ts';
const props = defineProps<{ user: API.User }>();

const ruleFormRef = ref<FormInstance>();
const ruleForm = ref({
  id: '',
  username: '',
  password: '',
});

const rules = reactive<FormRules<typeof ruleForm>>({
  username: [{ required: true, message: '用户名不可以为空', trigger: 'change' }],
  password: [{ required: true, message: '密码不可以为空', trigger: 'change' }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      console.log(ruleForm);
      if (ruleForm.value.id !== '') {
        updateUser(ruleForm.value.id, ruleForm.value);
      } else {
        addUser(ruleForm.value);
      }
      console.log('submit!');
    } else {
      console.log('error submit!');
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
const visible = defineModel('visible', { default: false });
watch(
  () => visible.value,
  (val) => {
    if (val) {
      nextTick(() => {
        Object.assign(ruleForm.value, props.user);
      });
    }
  },
);
function resetFields() {
  ruleFormRef.value?.clearValidate();
  ruleFormRef.value?.resetFields();
}
</script>

<template>
  <el-dialog title="用户管理" width="500px" v-model="visible" destroy-on-close @closed="resetFields">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
      </el-form-item>

      <el-form-item label="用户id" prop="id" v-show="false">
        <el-input v-model="ruleForm.id" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)"> 提交 </el-button>
    </template>
  </el-dialog>
</template>

<style scoped></style>
