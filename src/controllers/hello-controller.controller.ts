// Uncomment these imports to begin using these cool features!

import {get} from '@loopback/rest';

// import {inject} from '@loopback/core';


export class HelloControllerController {
  constructor() { }

  @get('/hello')
  hello(): string {
    return 'Hello from Loopback 4';
  }
}
