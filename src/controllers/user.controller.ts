// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getJsonSchemaRef, post, requestBody} from '@loopback/rest';
import {User} from '../models/user.model';
import {Credentials, UserRepository} from '../repositories/user.repository';
import {BcryptHasher} from '../services/hash.password.bcrypt';
import {JWTService} from '../services/jws-service';
import {validateCredentials} from '../services/user-credentials.validator';
import {MyUserService} from '../services/user.service';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcryptHasher,
    @inject('service.user.service')
    public myUserService: MyUserService,
    @inject('service.jwt.service')
    public jwtService: JWTService,
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

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(@requestBody(
    {
      description: 'The input of login function',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                format: 'email',
              },
              password: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  ) credentials: Credentials): Promise<{token: string}> {
    const user = await this.myUserService.verifyCredentials(credentials);

    const userProfile = this.myUserService.convertToUserProfile(user);

    const token = await this.jwtService.genereteToken(userProfile);

    return Promise.resolve({token});
  }
}
