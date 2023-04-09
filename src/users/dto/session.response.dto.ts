import { Expose } from 'class-transformer';

export class SessionResponseDto {
  @Expose()
  accessToken: string;

  @Expose()
  expiresAt: Date;
}
