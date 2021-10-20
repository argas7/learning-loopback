import {AuthenticationBindings, AuthenticationMetadata} from '@loopback/authentication';
import {
  Getter,
  globalInterceptor,
  inject,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise
} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {intersection} from 'lodash';
import {MyUserProfile, RequiredPermissions} from '../types';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'authorize'}})
export class AuthorizeInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>,
  ) { }

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    try {
      if (!this.metadata) {
        const result = await next();
        return result;
      }

      const requiredPermissions = this.metadata.options as RequiredPermissions;
      const userPermissions = this.getCurrentUser();

      const results = intersection((await userPermissions).permissions, requiredPermissions.required).length;
      if (results !== requiredPermissions.required.length) {
        throw new HttpErrors.Forbidden('Invalid Access Permissions');
      }

      const result = await next();
      // Add post-invocation logic here
      return result;
    } catch (err) {
      throw new HttpErrors.Unauthorized(err);
    }
  }
}
