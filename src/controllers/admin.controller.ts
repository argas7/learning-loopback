// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getJsonSchemaRef, post, requestBody} from '@loopback/rest';
import {TokenServiceBidings} from '../keys';
import {User} from '../models';
import {UserRepository} from '../repositories';
import {BcryptHasher} from '../services/hash.password.bcrypt';
import {JWTService} from '../services/jws-service';
import {validateCredentials} from '../services/user-credentials.validator';
import {MyUserService} from '../services/user.service';
import {PermissionKeys} from '../strategies/authorization-keys';

// import {inject} from '@loopback/core';


export class AdminController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBidings.TOKEN_HASHER_SERVICE)
    public hasher: BcryptHasher,
    @inject(TokenServiceBidings.TOKEN_USER_SERVICE)
    public myUserService: MyUserService,
    @inject(TokenServiceBidings.TOKEN_JWT_SERVICE)
    public jwtService: JWTService,
  ) { }

  @post('users/admin', {
    responses: {
      '200': {
        description: 'Admin',
        content: {
          schema: getJsonSchemaRef(User)
        },
      },
    },
  })
  async create(@requestBody() admin: User) {
    validateCredentials({email: admin.email, password: admin.password});

    admin.permissions = [
      PermissionKeys.CreateJob,
      PermissionKeys.UpdateJob,
      PermissionKeys.DeleteJob,
    ];

    const hashedPassword = await this.hasher.hashPassword(admin.password);

    const savedUser = await this.userRepository.create({
      ...admin,
      password: hashedPassword,
    });

    const returnedUser: User | {password?: string;} = savedUser;
    delete returnedUser.password;

    return returnedUser;
  }

}
