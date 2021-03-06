import {AuthenticationComponent, registerAuthenticationStrategy} from '@loopback/authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {TokenServiceBidings, TokenServiceConstants} from './keys';
import {MySequence} from './sequence';
import {BcryptHasher} from './services/hash.password.bcrypt';
import {JWTService} from './services/jws-service';
import {MyUserService} from './services/user.service';
import {JWTStrategy} from './strategies/jwt-strategy';

export {ApplicationConfig};

export class LearningLoopbackApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // set up bidings
    this.setupBidings()

    registerAuthenticationStrategy(this, JWTStrategy);
    this.component(AuthenticationComponent);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  setupBidings(): void {
    this.bind(TokenServiceBidings.TOKEN_HASHER_SERVICE).toClass(BcryptHasher);
    this.bind(TokenServiceBidings.TOKEN_USER_SERVICE).toClass(MyUserService);
    this.bind(TokenServiceBidings.TOKEN_JWT_SERVICE).toClass(JWTService);
    this.bind(TokenServiceBidings.TOKEN_ROUNDS).to(TokenServiceConstants.TOKEN_ROUNDS);
  }
}
