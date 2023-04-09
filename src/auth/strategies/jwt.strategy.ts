import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { Users } from '../../users/entities/users.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        //it is possible to use a query parameter to pass the token
        ExtractJwt.fromUrlQueryParameter('access-token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: any): Promise<Users> {
    let accessToken =
      request.headers.authorization ?? request.query['access-token'];
    accessToken = accessToken?.replace('Bearer ', '');

    const user = await this.authService.validateAccessToken(accessToken);
    return user;
  }
}
