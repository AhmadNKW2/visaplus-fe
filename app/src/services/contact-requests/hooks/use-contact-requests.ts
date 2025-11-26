import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactRequestService } from "../api/contact-request.service"; // Adjust path as needed based on your folder structure
import { queryKeys } from "../../../lib/query-keys"; // Adjust path as needed
import { toast } from "react-toastify";

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
    queryKey: [...queryKeys.contactRequests.all, params],
    queryFn: () => contactRequestService.getContactRequests(params),
    placeholderData: (previousData) => previousData,
    select: (response: any) => {
      // --- FIX START ---

      let items: any[] = [];
      let meta: any = {};

      // Analyze response structure to find data and meta

      // Case 1: Response is { data: [...], meta: {...} } (Your current structure)
      if (response && 'data' in response && Array.isArray(response.data) && 'meta' in response) {
        items = response.data;
        meta = response.meta;
      }
      // Case 2: Response is { data: { data: [...], meta: {...} } } (Nested axios wrapper)
      else if (response?.data && typeof response.data === 'object' && 'data' in response.data) {
        items = response.data.data;
        meta = response.data.meta || {};
      }
      // Case 3: Response.data is just the array (No meta available or flat structure)
      else if (response?.data && Array.isArray(response.data)) {
        items = response.data;
        // Try to find meta on the parent if possible, otherwise empty
        meta = response.meta || {};
      }
      // Case 4: Response itself is the array
      else if (Array.isArray(response)) {
        items = response;
      }

      // --- FIX END ---

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
      const data = response.data as any;
      if (data && typeof data === 'object' && 'data' in data) {
        return transformKeys(data.data);
      }
      return transformKeys(data);
    },
    enabled: !!id,
  });
};

/**
 * Delete contact request
 */
export const useDeleteContactRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => contactRequestService.deleteContactRequest(id),
    onSuccess: () => {
      toast.success("Contact request deleted successfully");
      queryClient.invalidateQueries({ queryKey: queryKeys.contactRequests.all });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Failed to delete contact request");
    },
  });
};