// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {getJsonSchemaRef, post, requestBody} from '@loopback/rest';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';

// import {inject} from '@loopback/core';


export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
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
    const savedUser = await this.userRepository.create(userData);

    const returnedUser: User | {password?: string;} = savedUser;
    delete returnedUser.password;

    return returnedUser;
  }
}
