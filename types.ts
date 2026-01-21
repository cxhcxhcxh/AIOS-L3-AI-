
export interface UniversityData {
  id: string;
  name: string;
  abbr: string;
  themeColor: string;
  logoLetter: string;
  concept: string; // 50 words max
  extracts: string[]; // Original text extracts
  pros: string[];
  cons: string[];
  summary: string;
  // Asset Data for Deployment
  assets: {
    images: Array<{
      label: string;
      url: string;
    }>;
    pdf?: {
      name: string;
      url?: string;
      size: string;
    };
  };
}

export interface TimelineNode {
  id: string;
  date: string;
  title: string;
  description: string;
  color: string;
}

export enum SectionType {
  OVERVIEW = 'OVERVIEW',
  BACKGROUND = 'BACKGROUND',
  FINANCE = 'FINANCE',
  UNI_CONTENT = 'UNI_CONTENT',
  UNI_RESOURCE = 'UNI_RESOURCE',
  SUMMARY = 'SUMMARY'
}
