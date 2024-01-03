import { Expose } from 'class-transformer';

export class SessionResponseDto {
  @Expose()
  access_token: string;

  @Expose()
  expires_at: Date;
}
