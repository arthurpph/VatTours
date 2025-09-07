export function isValidUrl(str: string): boolean {
   try {
      new URL(str);
      return true;
   } catch {
      return false;
   }
}

export function isValidBase64Image(base64String: string): boolean {
   if (!base64String || base64String.trim() === '') return false;

   try {
      // Check if it's a valid base64 string
      const decoded = atob(base64String);

      // Check for common image file signatures
      const uint8Array = new Uint8Array(decoded.length);
      for (let i = 0; i < decoded.length; i++) {
         uint8Array[i] = decoded.charCodeAt(i);
      }

      // Check for JPEG signature (FF D8 FF)
      if (
         uint8Array[0] === 0xff &&
         uint8Array[1] === 0xd8 &&
         uint8Array[2] === 0xff
      ) {
         return true;
      }

      // Check for PNG signature (89 50 4E 47)
      if (
         uint8Array[0] === 0x89 &&
         uint8Array[1] === 0x50 &&
         uint8Array[2] === 0x4e &&
         uint8Array[3] === 0x47
      ) {
         return true;
      }

      // Check for GIF signature (47 49 46)
      if (
         uint8Array[0] === 0x47 &&
         uint8Array[1] === 0x49 &&
         uint8Array[2] === 0x46
      ) {
         return true;
      }

      // Check for WebP signature
      if (decoded.includes('WEBP')) {
         return true;
      }

      return false;
   } catch (error) {
      return false;
   }
}
