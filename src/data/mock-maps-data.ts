import { BusinessLead } from '../types';

export interface SampleNichePreset {
  id: string;
  label: string;
  query: string;
  location: string;
  leads: BusinessLead[];
}

export const SAMPLE_NICHES: SampleNichePreset[] = [
  {
    id: 'plumbers-austin',
    label: 'Plumbers in Austin, TX',
    query: 'plumbers in Austin TX',
    location: 'Austin, TX',
    leads: [
      {
        id: 'austin-plumb-1',
        name: "Travis County Emergency Plumbing",
        category: "Plumber",
        hasWebsite: false,
        phone: "(512) 555-0142",
        rating: 4.8,
        reviewsCount: 39,
        address: "Austin, TX 78704",
        mapsUrl: "https://www.google.com/maps/place/Travis+County+Emergency+Plumbing",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'austin-plumb-2',
        name: "Rios & Sons Master Pipe Works",
        category: "Plumbing Service",
        hasWebsite: false,
        phone: "(512) 555-0198",
        rating: 4.9,
        reviewsCount: 74,
        address: "2410 E 7th St, Austin, TX",
        mapsUrl: "https://www.google.com/maps/place/Rios+and+Sons+Master+Pipe+Works",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'austin-plumb-3',
        name: "Apex Flow Plumbing Pros",
        category: "Plumber",
        hasWebsite: true,
        websiteUrl: "https://apexflowplumbing.com",
        phone: "(512) 555-9800",
        rating: 4.6,
        reviewsCount: 210,
        address: "Austin, TX 78745",
        mapsUrl: "https://www.google.com/maps/place/Apex+Flow+Plumbing+Pros",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'austin-plumb-4',
        name: "South Congress Drain & Sewer Co.",
        category: "Drainage Service",
        hasWebsite: false,
        phone: "(512) 555-0284",
        rating: 4.7,
        reviewsCount: 28,
        address: "Austin, TX 78701",
        mapsUrl: "https://www.google.com/maps/place/South+Congress+Drain+and+Sewer",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'austin-plumb-5',
        name: "Precision Backflow Testing Austin",
        category: "Plumbing Inspection",
        hasWebsite: false,
        phone: "(512) 555-7311",
        rating: 5.0,
        reviewsCount: 16,
        address: "North Austin, TX",
        mapsUrl: "https://www.google.com/maps/place/Precision+Backflow+Testing+Austin",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'austin-plumb-6',
        name: "Bluebonnet Rooter & Plumbing",
        category: "Plumber",
        hasWebsite: false,
        phone: "(512) 555-6490",
        rating: 4.5,
        reviewsCount: 52,
        address: "1104 S Lamar Blvd, Austin, TX",
        mapsUrl: "https://www.google.com/maps/place/Bluebonnet+Rooter+and+Plumbing",
        scrapedAt: "2026-09-19"
      }
    ]
  },
  {
    id: 'roofers-miami',
    label: 'Roofers in Miami, FL',
    query: 'roofing contractors in Miami FL',
    location: 'Miami, FL',
    leads: [
      {
        id: 'miami-roof-1',
        name: "Calle Ocho Shingle & Tile Repair",
        category: "Roofing Contractor",
        hasWebsite: false,
        phone: "(305) 555-0391",
        rating: 4.8,
        reviewsCount: 44,
        address: "Little Havana, Miami, FL",
        mapsUrl: "https://www.google.com/maps/place/Calle+Ocho+Shingle+Repair",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'miami-roof-2',
        name: "Sunshine State Flat Roof Specialist",
        category: "Commercial Roofing",
        hasWebsite: false,
        phone: "(305) 555-8821",
        rating: 4.6,
        reviewsCount: 63,
        address: "Coral Gables, FL 33134",
        mapsUrl: "https://www.google.com/maps/place/Sunshine+State+Flat+Roof",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'miami-roof-3',
        name: "Biscayne Bay Elite Roofing LLC",
        category: "Roofing Contractor",
        hasWebsite: true,
        websiteUrl: "https://biscayneroofingpro.com",
        phone: "(305) 555-4000",
        rating: 4.7,
        reviewsCount: 312,
        address: "Miami, FL 33137",
        mapsUrl: "https://www.google.com/maps/place/Biscayne+Bay+Elite+Roofing",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'miami-roof-4',
        name: "Hialeah Storm Damage Restoration",
        category: "General Contractor",
        hasWebsite: false,
        phone: "(786) 555-2910",
        rating: 4.9,
        reviewsCount: 88,
        address: "Hialeah, FL 33012",
        mapsUrl: "https://www.google.com/maps/place/Hialeah+Storm+Damage+Restoration",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'miami-roof-5',
        name: "Kendall Aluminum Gutters & Roof Clean",
        category: "Gutter Cleaning Service",
        hasWebsite: false,
        phone: "(305) 555-7193",
        rating: 4.4,
        reviewsCount: 19,
        address: "Kendall, FL 33176",
        mapsUrl: "https://www.google.com/maps/place/Kendall+Gutters+Roof+Clean",
        scrapedAt: "2026-09-19"
      }
    ]
  },
  {
    id: 'auto-repair-denver',
    label: 'Auto Repair in Denver, CO',
    query: 'independent auto mechanics in Denver CO',
    location: 'Denver, CO',
    leads: [
      {
        id: 'denver-auto-1',
        name: "Mile High Transmission & Clutch",
        category: "Transmission Shop",
        hasWebsite: false,
        phone: "(303) 555-0182",
        rating: 4.9,
        reviewsCount: 112,
        address: "4820 Broadway, Denver, CO",
        mapsUrl: "https://www.google.com/maps/place/Mile+High+Transmission+Clutch",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'denver-auto-2',
        name: "Cap Hill Foreign Car Tuning",
        category: "Auto Repair Shop",
        hasWebsite: false,
        phone: "(303) 555-9382",
        rating: 4.7,
        reviewsCount: 58,
        address: "Capitol Hill, Denver, CO",
        mapsUrl: "https://www.google.com/maps/place/Cap+Hill+Foreign+Car+Tuning",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'denver-auto-3',
        name: "Rocky Mountain Mobile Brakes",
        category: "Brake Shop",
        hasWebsite: false,
        phone: "(720) 555-4419",
        rating: 5.0,
        reviewsCount: 37,
        address: "Denver Metro Area, CO",
        mapsUrl: "https://www.google.com/maps/place/Rocky+Mountain+Mobile+Brakes",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'denver-auto-4',
        name: "Denver National Auto Center",
        category: "Auto Repair Shop",
        hasWebsite: true,
        websiteUrl: "https://denvernationalautocenter.com",
        phone: "(303) 555-1200",
        rating: 4.3,
        reviewsCount: 440,
        address: "Denver, CO 80216",
        mapsUrl: "https://www.google.com/maps/place/Denver+National+Auto+Center",
        scrapedAt: "2026-09-19"
      },
      {
        id: 'denver-auto-5',
        name: "Colfax Muffler & Catalytic Pro",
        category: "Muffler Shop",
        hasWebsite: false,
        phone: "(303) 555-6604",
        rating: 4.6,
        reviewsCount: 81,
        address: "E Colfax Ave, Denver, CO",
        mapsUrl: "https://www.google.com/maps/place/Colfax+Muffler+Pro",
        scrapedAt: "2026-09-19"
      }
    ]
  }
];

export const GOOGLE_MAPS_DOM_SELECTORS_EXPLAINED = [
  {
    target: "Results Feed Container",
    selector: "div[role='feed']",
    purpose: "Houses the infinite-scroll list of search results. Scraper programmatically increments feed.scrollTop to trigger lazy-loaded cards."
  },
  {
    target: "Place Result Card",
    selector: "div.Nv2PK, div[role='article']",
    purpose: "Each individual business card in the results list containing headline, star rating, phone snippet, and quick action buttons."
  },
  {
    target: "Business Name",
    selector: ".qBF1Pd, .fontHeadlineSmall, a.hfpxzc[aria-label]",
    purpose: "Extracts official business trading name directly from the heading or accessibility label."
  },
  {
    target: "Website Button (Absence check)",
    selector: "a[data-value='Website'], a[aria-label*='website' i], a[data-tooltip*='website' i]",
    purpose: "CRITICAL: If this anchor tag is absent from the card or details, the business has NO website listed on Google Maps."
  },
  {
    target: "Phone Number Regex",
    selector: ".W4Efsd (Regex: \\+?\\d{1,3}?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4})",
    purpose: "Finds contact phone number from the snippet lines without needing to click or make API calls."
  },
  {
    target: "Category & Rating",
    selector: "span.MW4etd (Rating), span.UY7F9 (Review Count), .W4Efsd (Category)",
    purpose: "Extracts Google Maps stars rating, total review volume, and primary category (e.g. 'Plumber', 'Dentist')."
  }
];
