import dayjs from 'dayjs';

function convertDates(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return dayjs(obj).format('YYYY-MM-DD HH:mm:ss');
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => convertDates(item));
  }

  const result: Record<string, any> = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = convertDates(obj[key]);
    }
  }
  return result;
}

export function success<T>(data: T = {} as T, msg: string = '成功！', status = 200) {
  return {
    status,
    msg,
    data: convertDates(data) as T,
  };
}

export function error(msg: string = '失败！', status = 500) {
  return {
    status,
    msg,
  };
}

export function paginate<T>(items: T[], total = 0, page = 1, pageSize = 15) {
  return {
    status: 200,
    message: '成功！',
    data: {
      total,
      page,
      pageSize,
      items: convertDates(items) as unknown as T[],
    },
  };
}
