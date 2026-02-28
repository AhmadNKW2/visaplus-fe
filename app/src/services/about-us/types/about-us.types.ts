/**
 * About Us Types
 */

export interface AboutUs {
  id: number;
  image: string;
  contentEn: string;
  contentAr: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateAboutUsDto {
  image?: File;
  contentEn?: string;
  contentAr?: string;
}
