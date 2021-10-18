import {HttpErrors} from '@loopback/rest';
import validator from 'validator';
import {Credentials} from '../repositories/user.repository';

export function validateCredentials(credentials: Credentials) {
  if (validator.isEmail(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('Invalid email!');
  }

  return true;
}
