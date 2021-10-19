import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';


dotenv.config();

export class JWTService {

  async genereteToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) throw new HttpErrors.Unauthorized('Error: userProfile is null!')

    const token = jwt.sign(userProfile, process.env.JWT_SECRET as string, {
      expiresIn: '7h'
    });

    return token;
  }

};
