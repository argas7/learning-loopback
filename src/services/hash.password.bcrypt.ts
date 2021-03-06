import {inject} from '@loopback/core';
import {compare, genSalt, hash} from 'bcryptjs';
import {TokenServiceBidings} from '../keys';

interface PasswordHasher<T = string> {
  hashPassword(passwrod: T): Promise<T>;
  comparePassword(password: T, storedPassword: T): Promise<boolean>;
}

export class BcryptHasher implements PasswordHasher<string> {
  @inject(TokenServiceBidings.TOKEN_ROUNDS)
  public readonly rounds: number;

  async hashPassword(password: string) {
    const salt = await genSalt(this.rounds);

    return hash(password, salt);
  }

  async comparePassword(password: string, storedPassword: string): Promise<boolean> {
    const isPasswordsMatch = await compare(password, storedPassword);

    return isPasswordsMatch;
  }

}
