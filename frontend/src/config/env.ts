// Environment configuration for SkyLens
// This file centralizes all environment variables and provides fallbacks

// Get API URL from environment or use fallback
export const API_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== 'undefined' && (window as any).__ENV__?.NEXT_PUBLIC_API_URL) ||
  'http://localhost:4001';

// Get Cloudinary base URL from environment or use fallback
export const IMAGE_BASE_URL = 
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 
  (typeof window !== 'undefined' && (window as any).__ENV__?.NEXT_PUBLIC_IMAGE_BASE_URL) ||
  'https://res.cloudinary.com/dm2sd9t1n/image/upload';

// Debug logging (only in browser)
if (typeof window !== 'undefined') {
  console.log('🔧 Environment Configuration:');
  console.log('   API_URL:', API_URL);
  console.log('   IMAGE_BASE_URL:', IMAGE_BASE_URL);
  console.log('   process.env.NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
  console.log('   process.env.NEXT_PUBLIC_IMAGE_BASE_URL:', process.env.NEXT_PUBLIC_IMAGE_BASE_URL);
}

export const config = {
  apiUrl: API_URL,
  imageBaseUrl: IMAGE_BASE_URL,
} as const;

