/**
 * React Query hooks for countries
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { countryService } from "../api/country.service";
import { queryKeys } from "../../../lib/query-keys";
import {
  CreateCountryDto,
  UpdateCountryDto,
  ReorderCountryDto,
} from "../types/country.types";

/**
 * Get all countries
 */
export const useCountries = (params?: {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.countries.all, params],
    queryFn: () => countryService.getCountries(params),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
    select: (response) => {
      console.log('Countries API Response:', response); // Debug log
      
      // API returns nested structure: response.data.data
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
      
      console.log('Extracted countries:', items); // Debug log
      console.log('Extracted meta:', meta); // Debug log
      
      return {
        items,
        meta,
      };
    },
  });
};

/**
 * Get country by ID
 */
export const useCountry = (id: number) => {
  return useQuery({
    queryKey: queryKeys.countries.detail(id),
    queryFn: () => countryService.getCountryById(id),
    select: (response) => {
      // API returns nested structure: response.data.data
      const data = response.data as any;
      // Check if data has nested data property (data.data)
      if (data && typeof data === 'object' && 'data' in data) {
        return data.data;
      }
      // Fallback: return data itself
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Get all countries world
 */
export const useCountriesWorld = () => {
  return useQuery({
    queryKey: [...queryKeys.countries.world],
    queryFn: () => countryService.getCountriesWorld(),
    select: (response) => {
      // API returns nested structure: response.data.data
      const data = response.data as any;
      // Check if data has nested data property (data.data)
      if (data && typeof data === 'object' && 'data' in data) {
        return Array.isArray(data.data) ? data.data : [];
      }
      // Fallback: check if data itself is an array
      return Array.isArray(data) ? data : [];
    },
  });
};

/**
 * Create country mutation
 */
export const useCreateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCountryDto) =>
      countryService.createCountry(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.countries.all });
    },
  });
};

/**
 * Update country mutation
 */
export const useUpdateCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCountryDto }) =>
      countryService.updateCountry(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.countries.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.countries.detail(variables.id),
      });
    },
  });
};

/**
 * Delete country mutation
 */
export const useDeleteCountry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => countryService.deleteCountry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.countries.all });
    },
  });
};

/**
 * Reorder countries mutation
 */
export const useReorderCountries = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReorderCountryDto) =>
      countryService.reorderCountries(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.countries.all });
    },
  });
};
