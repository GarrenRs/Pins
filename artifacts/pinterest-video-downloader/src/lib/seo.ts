/**
 * SEO configuration for Pindrop.
 * Update SITE_URL to your production domain before deploying.
 */
export const SITE_URL = 'https://pindrop.app';
export const SITE_NAME = 'Pindrop';

export interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  /** Optional breadcrumb path for inner pages, e.g. [{name:'Home',url:'/'},{name:'About',url:'/about'}] */
  breadcrumbs?: { name: string; url: string }[];
  faqs?: { question: string; answer: string }[];
  noindex?: boolean;
}

/** Full <title> text for document head */
export function buildTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE_NAME}`;
}

/** Absolute canonical URL from a path */
export function canonical(path: string): string {
  return `${SITE_URL}${path}`;
}

/** Pre-defined metadata for every indexable page */
export const PAGE_META = {
  home: {
    title: buildTitle('Pinterest Video Downloader - Download Pinterest Videos Free'),
    description:
      'Download Pinterest videos in MP4 format — no login, no app, no detours. Paste a Pinterest link and save the video directly to your device with Pindrop.',
    canonical: canonical('/'),
  },
  pinterestVideoDownloader: {
    title: buildTitle('Online Pinterest Video Downloader - Save 1080p MP4 Videos'),
    description:
      'Download Pinterest videos online directly in your browser. Extracts original 1080p and 720p MP4 files from public Pins without compression or third-party apps.',
    canonical: canonical('/pinterest-video-downloader'),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Online Pinterest Video Downloader', url: '/pinterest-video-downloader' },
    ],
  },
  howTo: {
    title: buildTitle('How to Download Pinterest Videos - Step-by-Step Guide'),
    description:
      'A simple step-by-step guide on how to download Pinterest videos on iPhone, Android, and PC. Learn how to find the Pin link and save the video file in seconds.',
    canonical: canonical('/how-to-download-pinterest-videos'),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'How to Download Pinterest Videos', url: '/how-to-download-pinterest-videos' },
    ],
  },
  about: {
    title: buildTitle('About Pindrop - Free Pinterest Video Downloader'),
    description:
      'Learn what Pindrop is, how it works, and how your data is handled. Pindrop is a free, private Pinterest video downloader with no account required.',
    canonical: canonical('/about'),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'About', url: '/about' },
    ],
  },
  contact: {
    title: buildTitle('Contact - Pindrop'),
    description:
      'Get in touch with the Pindrop team. Report an issue, ask a question, or send us feedback about the Pinterest video downloader.',
    canonical: canonical('/contact'),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Contact', url: '/contact' },
    ],
  },
  privacy: {
    title: buildTitle('Privacy Policy - Pindrop'),
    description:
      "Pindrop's privacy policy. Learn exactly what information is and isn't collected when you use Pindrop to download Pinterest videos.",
    canonical: canonical('/privacy'),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Privacy Policy', url: '/privacy' },
    ],
  },
  terms: {
    title: buildTitle('Terms of Service - Pindrop'),
    description:
      'Terms of service for Pindrop. Understand the acceptable use rules, your responsibilities, and the limitations of the Pinterest video downloader service.',
    canonical: canonical('/terms'),
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Terms of Service', url: '/terms' },
    ],
  },
} as const;
