export class HttpException extends Error {
  constructor(
    public status: number,
    public cause: string,
    public message: string
  ) {
    super(message);
  }
}
