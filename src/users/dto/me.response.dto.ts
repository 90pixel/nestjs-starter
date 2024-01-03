import { Expose, Type } from 'class-transformer';
import { SessionResponseDto } from './session.response.dto';

export class MeResponseDto {
  @Expose()
  id: number;
  @Expose()
  username: string;
  @Expose()
  role: string;
  @Expose()
  test: string;

  @Expose()
  @Type(() => SessionResponseDto)
  session_tokens: SessionResponseDto[];
}
