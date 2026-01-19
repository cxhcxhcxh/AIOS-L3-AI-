export interface UniversityData {
  id: string;
  name: string;
  themeColor: string;
  logoLetter: string;
  concept: string; // 50 words max
  extracts: string[]; // Original text extracts
  pros: string[];
  cons: string[];
  summary: string;
  // Resource/Upload Screen Data
  uploadConfig: {
    recommendedImages: string[];
    hasDoc: boolean;
  };
}

export enum SectionType {
  OVERVIEW = 'OVERVIEW',
  BACKGROUND = 'BACKGROUND',
  FINANCE = 'FINANCE',
  UNI_CONTENT = 'UNI_CONTENT',
  UNI_RESOURCE = 'UNI_RESOURCE',
  SUMMARY = 'SUMMARY'
}
