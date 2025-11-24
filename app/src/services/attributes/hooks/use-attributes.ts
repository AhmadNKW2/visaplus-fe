/**
 * React Query hooks for attributes
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { attributeService } from "../api/attribute.service";
import { queryKeys } from "../../../lib/query-keys";
import {
  CreateAttributeDto,
  UpdateAttributeDto,
  ReorderAttributeDto,
} from "../types/attribute.types";

/**
 * Get all attributes
 */
export const useAttributes = (params?: {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.attributes.all, params],
    queryFn: () => attributeService.getAttributes(params),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
    select: (response) => {
      console.log('Attributes API Response:', response); // Debug log
      
      // API returns nested data structure: data.data
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
      
      console.log('Extracted attributes:', items); // Debug log
      console.log('Extracted meta:', meta); // Debug log
      
      return {
        items,
        meta,
      };
    },
  });
};

/**
 * Get attribute by ID
 */
export const useAttribute = (id: number) => {
  return useQuery({
    queryKey: queryKeys.attributes.detail(id),
    queryFn: () => attributeService.getAttributeById(id),
    select: (response) => response.data,
    enabled: !!id,
  });
};

/**
 * Create attribute mutation
 */
export const useCreateAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttributeDto) =>
      attributeService.createAttribute(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attributes.all });
    },
  });
};

/**
 * Update attribute mutation
 */
export const useUpdateAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAttributeDto }) =>
      attributeService.updateAttribute(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attributes.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.attributes.detail(variables.id),
      });
    },
  });
};

/**
 * Delete attribute mutation
 */
export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => attributeService.deleteAttribute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attributes.all });
    },
  });
};

/**
 * Reorder attributes mutation
 */
export const useReorderAttributes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderAttributeDto) =>
      attributeService.reorderAttributes(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.attributes.all });
    },
  });
};
