declare global {
  namespace API {
    interface Response<T> {
      status: number;
      msg: string;
      data: T;
    }
    interface Pagination<T> {
      status: number;
      msg: string;
      data: {
        items: Array<T>;
        total: number;
        page: number;
        pageSize: number;
      };
    }
    interface User {
      username: string;
      id: number;
      role?: Role;
    }
    interface Role {
      name: string;
      id: number;
    }
    interface Department {
      name: string;
      id: number;
    }
  }
}
export {};
