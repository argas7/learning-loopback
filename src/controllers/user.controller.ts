// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getJsonSchemaRef, post, requestBody} from '@loopback/rest';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import {BcryptHasher} from '../services/hash.password.bcrypt';
import {validateCredentials} from '../services/user-credentials.validator';


export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcryptHasher,
  ) { }

  @post('/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User)
        },
      },
    },
  })
  async signUp(@requestBody() userData: User) {
    validateCredentials({email: userData.email, password: userData.password});

    const hashedPassword = await this.hasher.hashPassword(userData.password);

    const savedUser = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const returnedUser: User | {password?: string;} = savedUser;
    delete returnedUser.password;

    return returnedUser;
  }
}
