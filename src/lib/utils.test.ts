import { isValidUrl } from './utils';

describe('isValidUrl', () => {
   it('should return true for valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('http://example.com/path')).toBe(true);
      expect(isValidUrl('http://example.com:8080')).toBe(true);
   });

   it('should return true for valid HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com')).toBe(true);
      expect(isValidUrl('https://example.com/path/to/resource')).toBe(true);
   });

   it('should return true for URLs with query parameters', () => {
      expect(isValidUrl('https://example.com?param=value')).toBe(true);
      expect(isValidUrl('https://example.com/path?a=1&b=2')).toBe(true);
   });

   it('should return true for URLs with fragments', () => {
      expect(isValidUrl('https://example.com#section')).toBe(true);
      expect(isValidUrl('https://example.com/path#anchor')).toBe(true);
   });

   it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('just-text')).toBe(false);
   });

   it('should return false for null/undefined values', () => {
      // @ts-expect-error - Testing invalid input types
      expect(isValidUrl(null)).toBe(false);
      // @ts-expect-error - Testing invalid input types
      expect(isValidUrl(undefined)).toBe(false);
   });

   it('should return true for other protocols', () => {
      expect(isValidUrl('ftp://example.com')).toBe(true);
      expect(isValidUrl('file:///path/to/file')).toBe(true);
      expect(isValidUrl('mailto:test@example.com')).toBe(true);
   });
});
