declare global {
  namespace API {
    interface Response<T> {
      status: number;
      message: string;
      data: T;
    }
    interface Pagination<T> {
      status: number;
      message: string;
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
