declare global {
  namespace API {
    interface Response<T> {
      status: number;
      message: string;
      data: T;
    }
  }
}
export {};
