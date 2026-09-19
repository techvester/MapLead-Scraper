import { BusinessLead } from '../types';

export function leadsToCsvString(leads: BusinessLead[]): string {
  const headers = [
    'Business Name',
    'Has Website',
    'Website URL',
    'Category',
    'Phone Number',
    'Rating',
    'Reviews Count',
    'Address',
    'Google Maps URL',
    'Scraped Date'
  ];

  const rows = leads.map(l => [
    escapeCsv(l.name),
    l.hasWebsite ? 'Yes' : 'NO (Target Lead)',
    escapeCsv(l.websiteUrl || ''),
    escapeCsv(l.category),
    escapeCsv(l.phone || 'Not listed'),
    l.rating != null ? l.rating.toString() : '',
    l.reviewsCount != null ? l.reviewsCount.toString() : '0',
    escapeCsv(l.address || ''),
    escapeCsv(l.mapsUrl),
    l.scrapedAt
  ]);

  // UTF-8 BOM helps Excel and Google Sheets open foreign characters and formatting properly
  return '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}

export function downloadLeadsCsv(leads: BusinessLead[], filename = 'google_maps_no_website_leads.csv'): void {
  const csvContent = leadsToCsvString(leads);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function copyLeadsToClipboard(leads: BusinessLead[]): Promise<boolean> {
  try {
    const csvContent = leadsToCsvString(leads);
    await navigator.clipboard.writeText(csvContent);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

function escapeCsv(str: string): string {
  if (!str) return '""';
  const clean = String(str).replace(/"/g, '""');
  return `"${clean}"`;
}
