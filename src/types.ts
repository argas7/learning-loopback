import {PermissionKeys} from './strategies/authorization-keys';

export interface RequiredPermissions {
  required: PermissionKeys[];
}

export interface MyUserProfile {
  id: string;
  email?: string;
  name: string;
  permissions: PermissionKeys[];
}
