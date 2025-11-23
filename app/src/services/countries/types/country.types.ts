/**
 * Country Types
 */

export interface CountryWorld {
  id: number;
  name_en: string;
  name_ar: string;
  image_url: string;
}

export interface CountryAttribute {
  attributeId: number;
  value_en: string;
  value_ar: string;
  isActive: boolean;
}

export interface Country {
  id: number;
  countryWorldId: number;
  countryWorld?: CountryWorld;
  attributes: CountryAttribute[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCountryDto {
  countryWorldId: number;
  attributes: CountryAttribute[];
}

export interface UpdateCountryDto {
  countryWorldId?: number;
  attributes?: CountryAttribute[];
}

export interface ReorderCountryDto {
  countries: { id: number; order: number }[];
}
