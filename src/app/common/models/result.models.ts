export class Result {
  public readonly isSuccess: boolean;
  public readonly message?: string;

  private constructor(isSuccess: boolean, message?: string) {
    this.isSuccess = isSuccess;
    this.message = message;
  }

  public static success(): Result {
    return new Result(true);
  }

  public static fail(message: string): Result {
    return new Result(false, message);
  }
}

export class DataResult<T> {
  public readonly isSuccess: boolean;
  public readonly message?: string;
  public readonly data?: T;

  private constructor(isSuccess: boolean, message?: string, data?: T) {
    this.isSuccess = isSuccess;
    this.message = message;
    this.data = data;
  }

  public static success<T>(data: T): DataResult<T> {
    return new DataResult<T>(true, undefined, data);
  }

  public static fail<T>(message: string): DataResult<T> {
    return new DataResult<T>(false, message);
  }
}
