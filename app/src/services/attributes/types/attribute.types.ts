/**
 * Attribute Types
 */

export interface Attribute {
  id: number;
  name_en: string;
  name_ar: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAttributeDto {
  name_en: string;
  name_ar: string;
}

export interface UpdateAttributeDto {
  name_en?: string;
  name_ar?: string;
}

export interface ReorderAttributeDto {
  attributes: { id: number; order: number }[];
}
