export class LoginResponseDto {
  access_token: string;
  refresh_token: string;
  expires_at: Date;
  expires_refresh_at: Date;
}
