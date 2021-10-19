import {BindingKey} from '@loopback/core';
import {BcryptHasher} from './services/hash.password.bcrypt';
import {JWTService} from './services/jws-service';
import {MyUserService} from './services/user.service';

export namespace TokenServiceConstants {
  export const TOKEN_ROUNDS = 10;
}

export namespace TokenServiceBidings {
  export const TOKEN_ROUNDS = BindingKey.create<number>('rounds');
  export const TOKEN_HASHER_SERVICE = BindingKey.create<BcryptHasher>('service.hasher');
  export const TOKEN_USER_SERVICE = BindingKey.create<MyUserService>('service.user.service');
  export const TOKEN_JWT_SERVICE = BindingKey.create<JWTService>('service.jwt.service');
}
