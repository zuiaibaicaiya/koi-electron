import request from '@/request';

export function login(data: Record<string, string>) {
  return request({
    url: '/user/signIn',
    method: 'post',
    data,
  });
}
