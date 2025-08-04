import { RoleName } from './types';

const hierarchy = {
   user: 0,
   moderator: 1,
   admin: 2,
   owner: 3,
} as const;

export class Role {
   name: RoleName;

   constructor(name: RoleName) {
      if (!(name in hierarchy)) throw new Error(`Invalid role: ${name}`);
      this.name = name;
   }

   get level(): number {
      return hierarchy[this.name];
   }

   isAtLeast(other: Role | RoleName): boolean {
      const otherRole = other instanceof Role ? other : new Role(other);
      return this.level >= otherRole.level;
   }

   isLessThan(other: Role | RoleName): boolean {
      const otherRole = other instanceof Role ? other : new Role(other);
      return this.level < otherRole.level;
   }

   equals(other: Role | RoleName): boolean {
      const otherRole = other instanceof Role ? other : new Role(other);
      return this.name === otherRole.name;
   }
}
