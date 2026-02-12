<script setup lang="ts">
import { login } from '@/api/user';
import { type FormInstance, message } from 'antdv-next';
import { reactive, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const model = reactive({
  username: 'koi-electron',
  password: '123456',
});
async function handleFinished(values: Record<string, string>) {
  const { status, msg, data } = await login(values);
  if (status === 200) {
    localStorage.setItem('token', data!.token);
    router.replace('/home');
  } else {
    message.error(msg);
  }
}

const formRef = shallowRef<FormInstance>();
</script>

<template>
  <div>
    <div class="title-bar"></div>
    <div class="login-container">
      <a-form
        ref="formRef"
        :model="model"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        style="max-width: 600px"
        auto-complete="off"
        @finish="handleFinished"
      >
        <a-form-item
          name="username"
          label="Username"
          :rules="[{ required: true, message: '请输入用户名' }]"
        >
          <a-input v-model:value="model.username" />
        </a-form-item>
        <a-form-item
          name="password"
          label="Password"
          :rules="[{ required: true, message: '请输入密码' }]"
        >
          <a-input-password v-model:value="model.password" />
        </a-form-item>
        <a-form-item :label="null">
          <a-button type="primary" html-type="submit"> 登录 </a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<style scoped>
.title-bar {
  position: fixed;
  user-select: none;
  app-region: drag;
  height: env(titlebar-area-height, var(--fallback-title-bar-height));
  width: env(titlebar-area-width, 100vw);
  padding-left: env(titlebar-area-x, 0);
}
.login-container {
  position: fixed;
  width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
