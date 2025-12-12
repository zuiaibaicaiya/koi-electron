declare global {
  namespace API {
    interface Response<T> {
      status: number;
      message: string;
      data: T;
    }
    interface User {
      username: string;
      id: number;
    }
  }
}
export {};
