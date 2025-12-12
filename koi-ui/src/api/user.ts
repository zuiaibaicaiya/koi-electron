import request from '@/request';

export function login(data: Record<string, string>) {
  return request<never, API.Response<{ token: string }>>({
    url: '/user/signIn',
    method: 'post',
    data,
  });
}
