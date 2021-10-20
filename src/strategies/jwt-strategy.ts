import {AuthenticationStrategy} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {TokenServiceBidings} from '../keys';
import {JWTService} from '../services/jws-service';

export class JWTStrategy implements AuthenticationStrategy {
  constructor(
    @inject(TokenServiceBidings.TOKEN_JWT_SERVICE)
    public jwtService: JWTService,
  ) { }

  name = 'jwt';


  async authenticate(
    request: Request,
  ): Promise<UserProfile | undefined> {
    const token: string = this.extractCredentials(request);
    const userProfile = await this.jwtService.verifyToken(token);
    return Promise.resolve(userProfile)
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Forbidden('Missing token');
    }

    const authHeaderValue = request.headers.authorization;

    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized('Authorization is not type of Bearer')
    }

    const parts = authHeaderValue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized('Wrong token format')
    }

    const token = parts[1];

    return token;
  }

}
