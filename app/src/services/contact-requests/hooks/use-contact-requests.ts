/**
 * React Query hooks for contact requests
 */

import { useQuery } from "@tanstack/react-query";
import { contactRequestService } from "../api/contact-request.service";
import { queryKeys } from "../../../lib/query-keys";

/**
 * Convert snake_case to camelCase
 */
function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

/**
 * Transform object keys from snake_case to camelCase recursively
 */
function transformKeys(obj: any): any {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformKeys);
  }

  const transformed: any = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = snakeToCamel(key);
    transformed[camelKey] = transformKeys(value);
  }
  return transformed;
}

/**
 * Get all contact requests
 */
export const useContactRequests = (params?: {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
  destination_country?: string;
  nationality?: string;
  startDate?: string;
  endDate?: string;
}) => {
  return useQuery({
    queryKey: [queryKeys.contactRequests.all, params],
    queryFn: () => contactRequestService.getContactRequests(params),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
    select: (response) => {
      console.log('API Response:', response); // Debug log
      
      // API returns nested structure: response.data.data or response.data
      const data = response.data as any;
      
      // Handle various response structures
      let items: any[] = [];
      let meta: any = {};
      
      if (data && typeof data === 'object') {
        // Check for nested data property (data.data)
        if ('data' in data && Array.isArray(data.data)) {
          items = data.data;
          meta = data.meta || {};
        }
        // Check if data itself is an array
        else if (Array.isArray(data)) {
          items = data;
        }
      }
      
      console.log('Extracted items:', items); // Debug log
      console.log('Extracted meta:', meta); // Debug log
      
      // Transform snake_case keys to camelCase
      return {
        items: items.map(transformKeys),
        meta: transformKeys(meta),
      };
    },
  });
};

/**
 * Get contact request by ID
 */
export const useContactRequest = (id: number) => {
  return useQuery({
    queryKey: queryKeys.contactRequests.detail(id),
    queryFn: () => contactRequestService.getContactRequestById(id),
    select: (response) => {
      // API returns nested structure: response.data.data
      const data = response.data as any;
      // Check if data has nested data property (data.data)
      if (data && typeof data === 'object' && 'data' in data) {
        return transformKeys(data.data);
      }
      // Fallback: return data itself
      return transformKeys(data);
    },
    enabled: !!id,
  });
};
