import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {TokenServiceBidings} from '../keys';
import {User} from '../models';
import {Credentials, UserRepository} from '../repositories';
import {BcryptHasher} from './hash.password.bcrypt';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBidings.TOKEN_HASHER_SERVICE)
    public hasher: BcryptHasher,
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: {
          email: credentials.email,
        }
      });

      if (!foundUser) {
        throw new HttpErrors.NotFound(`Error: user with email ${credentials.email} not found`);
      }

      const passwordMatch = await this.hasher.comparePassword(
        credentials.password,
        foundUser.password,
      );

      if (!passwordMatch) {
        throw new HttpErrors.Unauthorized('Wrong password');
      }

      return foundUser;
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error: ${error}`);
    }
  }
  convertToUserProfile(user: User): UserProfile {
    return {email: user.email, name: user.name, [securityId]: `${user.id}`};
  }

}
