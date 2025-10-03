// Image configuration for Cloudinary or local paths
export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';

export const getImageUrl = (path: string) => {
  if (IMAGE_BASE_URL) {
    return `${IMAGE_BASE_URL}${path}`;
  }
  return path; // Use local path if no CDN is configured
};

// Image paths
export const IMAGES = {
  hero: '/hero-drone.jpg',
  logo: '/skylens-logo.png',
  aerialPhotography: '/aerial-photography.jpg',
  construction: '/construction.jpg',
  edited: '/edited.gif',
  mapping3d: '/3d-mapping.gif',
  videoProduction: '/video-production.jpg',
  realEstate: '/real-estate.jpg',
  eventCoverage: '/event-coverage.jpg',
  customProjects: '/custom-projects.jpg',
  aboutStory: '/about-story.jpg',
};

