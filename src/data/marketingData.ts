// Marketing categories configuration
export const MARKETING_CATEGORIES = {
  ProductPhotos: {
    title: 'Product Photos and Presentations',
    breadcrumb: 'Product Photos and Presentations',
    availableTypes: ['PHOTO', 'PRESENTATION'],
    availableTags: ['lassa', 'multiways', 'driveways', 'product'],
    materials: [
      {
        id: 'PH001',
        name: 'Multiways Angled',
        image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        date: 'Jul 05, 2018',
        description: 'Multiways tyre product photo - angled view',
        tags: ['lassa', 'multiways'],
        type: 'PHOTO',
        category: 'ProductPhotos'
      },
      {
        id: 'PR001',
        name: 'Driveways - Product Presentation',
        image: 'https://mediasvcxkc89k4bkkj8j.blob.core.windows.net/sys-master-hybris-image-prod/Dosyalar%2Fmedialibrary%2FDriveways%20-%20Product%20Presentation.pdf',
        date: 'Nov 2016',
        description: 'Driveways product presentation with technical features',
        downloadUrl: 'https://mediasvcxkc89k4bkkj8j.blob.core.windows.net/sys-master-hybris-image-prod/Dosyalar%2Fmedialibrary%2FDriveways%20-%20Product%20Presentation.pdf',
        tags: ['lassa', 'driveways'],
        type: 'PRESENTATION',
        category: 'ProductPhotos'
      }
    ]
  },
  CampaignMaterials: {
    title: 'Campaign Materials',
    breadcrumb: 'Campaign Materials',
    availableTypes: ['IMAGE', 'VIDEO', 'DOCUMENT'],
    availableTags: ['lassa', 'barcaonlassa', 'flyer'],
    materials: [
      {
        id: 'CM001',
        name: 'Summer B2C Discount',
        image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        date: 'Apr 14, 2017',
        size: '5 MB',
        downloadUrl: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        description: 'Campaign proposals are exemplary.',
        tags: ['lassa', 'barcaonlassa', 'flyer'],
        type: 'DOCUMENT',
        category: 'CampaignMaterials'
      }
    ]
  },
  POSMaterials: {
    title: 'POS Materials',
    breadcrumb: 'POS Materials',
    availableTypes: ['IMAGE', 'VIDEO', 'DOCUMENT'],
    availableTags: ['lassa', 'pos', 'display'],
    materials: [
      {
        id: 'POS001',
        name: 'POS Display Banner',
        image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        date: 'Mar 15, 2020',
        size: '3 MB',
        downloadUrl: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        tags: ['lassa', 'pos', 'display'],
        type: 'IMAGE',
        category: 'POSMaterials'
      }
    ]
  },
  ShopBranding: {
    title: 'Shop Branding',
    breadcrumb: 'Shop Branding',
    availableTypes: ['IMAGE', 'VIDEO', 'DOCUMENT'],
    availableTags: ['lassa', 'branding', 'shop'],
    materials: [
      {
        id: 'SB001',
        name: 'Shop Exterior Design',
        image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        date: 'Feb 10, 2021',
        size: '8 MB',
        downloadUrl: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        tags: ['lassa', 'branding', 'shop'],
        type: 'IMAGE',
        category: 'ShopBranding'
      }
    ]
  },
  LogoGuide: {
    title: 'Logo Guide',
    breadcrumb: 'Logo Guide',
    availableTypes: ['IMAGE', 'DOCUMENT'],
    availableTags: ['lassa', 'logo', 'branding'],
    materials: [
      {
        id: 'LG001',
        name: 'LASSA Logo Guidelines',
        image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        date: 'Jan 05, 2022',
        size: '12 MB',
        downloadUrl: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        tags: ['lassa', 'logo', 'branding'],
        type: 'DOCUMENT',
        category: 'LogoGuide'
      }
    ]
  },
  Catalogues: {
    title: 'Catalogues, Leaflets, Posters',
    breadcrumb: 'Catalogues, Leaflets, Posters',
    availableTypes: ['DOCUMENT', 'IMAGE'],
    availableTags: ['lassa', 'catalogue', 'leaflet'],
    materials: [
      {
        id: 'CAT001',
        name: 'LASSA Product Catalogue 2024',
        image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        date: 'Dec 01, 2023',
        size: '25 MB',
        downloadUrl: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        tags: ['lassa', 'catalogue'],
        type: 'DOCUMENT',
        category: 'Catalogues'
      }
    ]
  },
  CarBranding: {
    title: 'Car Branding',
    breadcrumb: 'Car Branding',
    availableTypes: ['IMAGE', 'VIDEO'],
    availableTags: ['lassa', 'car', 'branding'],
    materials: [
      {
        id: 'CB001',
        name: 'Car Wrap Design',
        image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        date: 'Nov 20, 2023',
        size: '6 MB',
        downloadUrl: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        tags: ['lassa', 'car', 'branding'],
        type: 'IMAGE',
        category: 'CarBranding'
      }
    ]
  },
  SocialMediaDatabase: {
    title: 'Social Media Database',
    breadcrumb: 'Social Media Database',
    availableTypes: ['IMAGE', 'VIDEO', 'DOCUMENT'],
    availableTags: ['summer', 'passengercar', 'DrivewaysSport', 'comfort', 'lightcommercial', 'allseason', 'MultiwaysC', 'night', 'day', 'Equinox'],
    materials: [
      {
        id: 'SOC001',
        name: 'Driveways Sport Everyone\'s Choice!',
        image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        date: 'Oct 18, 2023',
        size: '11 MB',
        downloadUrl: '/b2b/medias/5-eylul.psd?context=bWFzdGVyfGRvY3VtZW50c3wxMTg3MDk0OHxpbWFnZS92bmQuYWRvYmUucGhvdG9zaG9wfGFEWXpMMmhrT0M4NU16RTRNalE0TmpFeE9EY3dMelZmWlhsc2RXd3VjSE5rfGI4YTcxYjg3YTFjZGM0ZGZlZjEwYWJkOTM1YzUzY2VlY2E5MjI2MWE3OGRiNzBiMDJlMmY4MjFiNWI5ZjJhNDU&attachment=true',
        description: 'Driveways Sport Everyone\'s Choice! - Social media post design',
        tags: ['summer', 'passengercar', 'DrivewaysSport'],
        type: 'DOCUMENT',
        category: 'SocialMediaDatabase'
      },
      {
        id: 'SOC002',
        name: 'Multiways-C | Your Business Partner For All Seasons',
        image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        date: 'Oct 19, 2023',
        size: '285 MB',
        downloadUrl: '/b2b/medias/7-eylul.psd?context=bWFzdGVyfGRvY3VtZW50c3wyOTg5OTMxMzN8aW1hZ2Uvdm5kLmFkb2JlLnBob3Rvc2hvcHxhRFEzTDJnek5TODVNekl3TURNek1UZzVPVEU0THpkZlpYbHNkV3d1Y0hOa3xjNWJiNmI2NzdmN2JhMDI0OWZmZDExMTA1YTNjZTJhNDAwNjE4NTc2NWY5Y2RlNTE5YTI2YzQxMTJkNzQ5MWJl&attachment=true',
        description: 'Multiways-C | Your Business Partner For All Seasons - Social media post design',
        tags: ['comfort', 'lightcommercial', 'allseason', 'MultiwaysC'],
        type: 'DOCUMENT',
        category: 'SocialMediaDatabase'
      },
      {
        id: 'SOC003',
        name: 'Equinox | Night / Day',
        image: 'https://medias89k-ete3a4c6hxdufvhh.a03.azurefd.net/sys-master-hybris-image-prod/hc5/hfe/8797086384158',
        date: 'Oct 20, 2023',
        size: '8 MB',
        downloadUrl: '/b2b/medias/8-eylul.psd?context=bWFzdGVyfGRvY3VtZW50c3w4Mzk4MDMyfGltYWdlL3ZuZC5hZG9iZS5waG90b3Nob3B8YURRM0wyZ3pOUzg1TXpJd01ETXpNVGc1T1RFNEx6ZGZaWGxzZFd3dWNITmt8YzViYjZiNjc3ZjdiYTAyNDlmZmQxMTEwNWEzY2UyYTQwMDYxODU3NjVmOWNkZTUxOWEyNmM0MTEyZDc0OTFiZQ&attachment=true',
        description: 'Equinox | Night / Day - Social media post design',
        tags: ['night', 'day', 'Equinox'],
        type: 'DOCUMENT',
        category: 'SocialMediaDatabase'
      }
    ]
  }
};

// Type definitions
export interface MarketingMaterial {
  id: string;
  name: string;
  image: string;
  date: string;
  description?: string;
  downloadUrl?: string;
  size?: string;
  tags: string[];
  type: string;
  category: string;
}

export interface MarketingCategory {
  title: string;
  breadcrumb: string;
  availableTypes: string[];
  availableTags: string[];
  materials: MarketingMaterial[];
}

export interface Filter {
  type: string[];
  tags: string[];
}

// Helper functions
export const getMarketingCategory = (categoryName: string): MarketingCategory | undefined => {
  return MARKETING_CATEGORIES[categoryName as keyof typeof MARKETING_CATEGORIES];
};

export const getAllMarketingCategories = (): typeof MARKETING_CATEGORIES => {
  return MARKETING_CATEGORIES;
};

export const getMaterialsByCategory = (categoryName: string): MarketingMaterial[] => {
  const category = getMarketingCategory(categoryName);
  return category ? category.materials : [];
};
