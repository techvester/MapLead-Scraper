export interface BusinessLead {
  id: string;
  name: string;
  category: string;
  hasWebsite: boolean;
  websiteUrl?: string;
  phone?: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
  mapsUrl: string;
  isClaimed?: boolean;
  statusText?: string;
  scrapedAt: string;
}

export interface ScraperConfig {
  onlyNoWebsite: boolean;
  autoScroll: boolean;
  scrollDelayMs: number;
  maxLeads: number;
  requirePhone: boolean;
  minRating: number;
}

export interface ScraperStats {
  scannedTotal: number;
  noWebsiteFound: number;
  withWebsiteSkipped: number;
  phoneCaptured: number;
  status: 'idle' | 'scraping' | 'paused' | 'completed';
}

export interface ExtensionFileItem {
  name: string;
  path: string;
  description: string;
  language: string;
  content: string;
}
