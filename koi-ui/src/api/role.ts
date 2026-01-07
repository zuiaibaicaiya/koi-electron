import request from '@/request';

export function getRoleList() {
  return request<never, API.Pagination<API.Role>>({
    url: '/role',
  });
}
