import { Role } from './role';

describe('Role', () => {
   describe('constructor', () => {
      it('should create role with valid name', () => {
         const userRole = new Role('user');
         const adminRole = new Role('admin');

         expect(userRole.name).toBe('user');
         expect(adminRole.name).toBe('admin');
      });

      it('should throw error for invalid role name', () => {
         // @ts-expect-error - Testing invalid role input
         expect(() => new Role('invalid')).toThrow('Invalid role: invalid');
      });
   });

   describe('level getter', () => {
      it('should return correct level for each role', () => {
         expect(new Role('user').level).toBe(0);
         expect(new Role('moderator').level).toBe(1);
         expect(new Role('admin').level).toBe(2);
         expect(new Role('owner').level).toBe(3);
      });
   });

   describe('isAtLeast', () => {
      it('should return true when role level is greater or equal', () => {
         const admin = new Role('admin');

         expect(admin.isAtLeast('user')).toBe(true);
         expect(admin.isAtLeast('moderator')).toBe(true);
         expect(admin.isAtLeast('admin')).toBe(true);
         expect(admin.isAtLeast(new Role('user'))).toBe(true);
      });

      it('should return false when role level is lower', () => {
         const user = new Role('user');

         expect(user.isAtLeast('moderator')).toBe(false);
         expect(user.isAtLeast('admin')).toBe(false);
         expect(user.isAtLeast('owner')).toBe(false);
      });
   });

   describe('isLessThan', () => {
      it('should return true when role level is lower', () => {
         const user = new Role('user');

         expect(user.isLessThan('moderator')).toBe(true);
         expect(user.isLessThan('admin')).toBe(true);
         expect(user.isLessThan('owner')).toBe(true);
         expect(user.isLessThan(new Role('moderator'))).toBe(true);
      });

      it('should return false when role level is greater or equal', () => {
         const admin = new Role('admin');

         expect(admin.isLessThan('user')).toBe(false);
         expect(admin.isLessThan('moderator')).toBe(false);
         expect(admin.isLessThan('admin')).toBe(false);
      });
   });

   describe('equals', () => {
      it('should return true for same role names', () => {
         const admin1 = new Role('admin');
         const admin2 = new Role('admin');

         expect(admin1.equals(admin2)).toBe(true);
         expect(admin1.equals('admin')).toBe(true);
      });

      it('should return false for different role names', () => {
         const admin = new Role('admin');
         const user = new Role('user');

         expect(admin.equals(user)).toBe(false);
         expect(admin.equals('user')).toBe(false);
      });
   });
});
