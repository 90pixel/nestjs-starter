export class MeResponseDto {
  constructor(payload: any) {
    this.id = payload?.id;
    this.username = payload?.username;
    this.role = payload?.role;
  }

  id: number;
  username: string;
  role: string;
}
