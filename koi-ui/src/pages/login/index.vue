<template>
  <div class="login-container">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="auto"
    >
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="ruleForm.username"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
        >
          登录
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { login } from '@/api/user';
import { useRouter } from 'vue-router';
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  username: 'admin',
  password: '123456',
});

const rules = reactive<FormRules<typeof ruleForm>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (valid) {
      const { status, message, data } = await login(ruleForm);
      if (status === 200) {
        localStorage.setItem('token', data!.token);
        router.replace('/');
      } else {
        ElMessage.error(message);
      }
    } else {
      console.log('error submit!');
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
<style scoped lang="scss">
.login-container {
  position: fixed;
  width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
