import { API_CONFIG } from "../../lib/constants";

export interface PublicCountry {
  id: number;
  countryWorldId: number;
  order: number;
  countryWorld: {
    id: number;
    name_en: string;
    name_ar: string;
    image_url: string;
    created_at: string;
    updated_at: string;
  };
  attributes: PublicAttribute[];
  createdAt: string;
  updatedAt: string;
}

export interface PublicAttribute {
  id: number;
  countryId: number;
  attributeId: number;
  attribute: {
    id: number;
    name_en: string;
    name_ar: string;
    order: number;
    createdAt: string;
    updatedAt: string;
  };
  value_en: string;
  value_ar: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PublicCountriesResponse {
  success: boolean;
  data: PublicCountry[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  message: string;
  time: string;
}

export interface PublicAboutUs {
  id: number;
  image: string;
  contentEn: string;
  contentAr: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicFaqItem {
  questionEn: string;
  questionAr: string;
  answerEn: string;
  answerAr: string;
}

export interface PublicFaqs {
  id: number;
  items: PublicFaqItem[];
  createdAt: string;
  updatedAt: string;
}

const apiFetch = async <T>(path: string): Promise<T> => {
  const url = `${API_CONFIG.baseUrl}${path}`;
  const response = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error(`Failed to fetch ${path}`);
  return response.json();
};

export const publicService = {
  getCountries: async (search?: string, limit: number = 100): Promise<PublicCountriesResponse> => {
    const queryParams = new URLSearchParams();
    if (search) {
      queryParams.append("search", search);
    }
    queryParams.append("limit", limit.toString());
    
    const queryString = queryParams.toString();
    const url = `${API_CONFIG.baseUrl}/countries${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch countries");
    }

    return response.json();
  },

  getAboutUs: async (): Promise<{ data: PublicAboutUs; message: string }> => {
    return apiFetch("/about-us");
  },

  getFaqs: async (): Promise<{ data: PublicFaqs; message: string }> => {
    return apiFetch("/faqs");
  },
};
