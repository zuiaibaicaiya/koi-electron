import request from '@/request';

export function getDepartmentList() {
  return request<
    never,
    API.Response<Array<API.Department & { children: Array<API.Department> }>>
  >({
    url: '/department',
  });
}
