import axios from 'axios';
import router from '@/router';
const request = axios.create({
  baseURL: 'http://127.0.0.1:5166/api',
});
const pendingRequests = new Map();

request.interceptors.request.use((config) => {
  const controller = new AbortController();
  config.signal = controller.signal;
  if (pendingRequests.has(config.url)) {
    pendingRequests.get(config.url).abort('相同URL的新请求已发送，取消旧请求');
  }
  pendingRequests.set(config.url, controller);
  return config;
});
// 响应拦截器
request.interceptors.response.use(
  (response) => {
    pendingRequests.delete(response.config.url);
    return response.data;
  },
  (error) => {
    pendingRequests.delete(error.config.url);
    return Promise.reject(error);
  },
);
router.beforeEach((_to, _form, next) => {
  pendingRequests.forEach((controller) =>
    controller.abort('路由切换，取消请求'),
  );
  pendingRequests.clear();
  next();
});
export default request;
