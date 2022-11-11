export class ResponseDto {
  private readonly data: any;
  private readonly message: string;
  private readonly statusCode: number;

  constructor(data: any, message = 'ok', statusCode = 200) {
    this.data = data;
    this.message = message;
    this.statusCode = statusCode;
  }
}
