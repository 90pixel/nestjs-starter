export class LoginResponseDto {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  expiresRefreshAt: Date;
}
