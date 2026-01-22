import request from '@/request';

export function login(data: Record<string, string>) {
  return request<never, API.Response<{ token: string }>>({
    url: '/user/signIn',
    method: 'post',
    data,
  });
}
export function getCurrentUserInfo() {
  return request<never, API.Response<API.User>>({
    url: '/user/current/info',
  });
}
export function getUserList(params = {}) {
  return request<never, API.Pagination<API.User>>({
    url: '/user',
    params,
  });
}
export function addUser(data: Record<string, string>) {
  return request<never, API.Response<API.User>>({
    url: '/user',
    method: 'post',
    data,
  });
}

export function updateUser(id: number, data: Record<string, string>) {
  return request<never, API.Response<API.User>>({
    url: '/user/' + id,
    method: 'patch',
    data,
  });
}
