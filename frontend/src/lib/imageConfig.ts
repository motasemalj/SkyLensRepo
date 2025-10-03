// Image configuration for Cloudinary or local paths
import { IMAGE_BASE_URL as ENV_IMAGE_BASE_URL } from '../config/env';

export const IMAGE_BASE_URL = ENV_IMAGE_BASE_URL;

export const getImageUrl = (path: string) => {
  if (IMAGE_BASE_URL) {
    // If path starts with /, remove it for Cloudinary
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${IMAGE_BASE_URL}/${cleanPath}`;
  }
  return path; // Use local path if no CDN is configured
};

// Image paths - all use /skylens/ prefix for Cloudinary
export const IMAGES = {
  // Main images
  hero: '/skylens/hero-drone',
  logo: '/skylens/skylens-logo',
  logoText: '/skylens/skylens-text',
  
  // Services
  aerialPhotography: '/skylens/aerial-photography',
  construction: '/skylens/construction',
  edited: '/skylens/3d-mapping', // Using 3d-mapping instead of edited.gif (too large)
  mapping3d: '/skylens/3d-mapping',
  videoProduction: '/skylens/video-production',
  realEstate: '/skylens/real-estate',
  eventCoverage: '/skylens/event-coverage',
  customProjects: '/skylens/custom-projects',
  
  // Projects
  project1: '/skylens/project1',
  project2: '/skylens/project2',
  project3: '/skylens/project3',
  project4: '/skylens/project4',
  project6: '/skylens/project6',
  
  // Team/About
  aboutStory: '/skylens/about-story',
  team3: '/skylens/team-3',
  abdelhadi: '/skylens/abdelhadi',
  
  // Optimized
  optimizedProject6: '/skylens/optimized/project6',
  optimizedTeam1: '/skylens/optimized/team-1',
  optimizedTeam2: '/skylens/optimized/team-2',
  optimizedTeam3: '/skylens/optimized/team-3',
  
  // About folder
  aboutAerial1: '/skylens/about/aerial1',
  aboutAerial2: '/skylens/about/aerial2',
  aboutTeam1: '/skylens/about/team1',
  
  // Services folder
  servicesEdited: '/skylens/services/edited',
  servicesRaw: '/skylens/services/raw',
};

