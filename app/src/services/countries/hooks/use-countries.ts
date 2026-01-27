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

const selectCountriesData = (response: any) => {
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
      // If data is the array, meta is on the parent response object
      if (response.meta) {
        meta = response.meta;
      }
    }
  }
  
  return {
    items,
    meta,
  };
};

/**
 * Get all countries
 */
export const useCountries = (
  params?: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
  },
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: queryKeys.countries.list(params),
    queryFn: () => countryService.getCountries(params),
    placeholderData: (previousData) => previousData, // Keep previous data while loading
    select: selectCountriesData,
    enabled: options?.enabled,
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
    staleTime: 0, // Always fetch fresh data when mounting
  });
};

/**
 * Get all countries world
 */
export const useCountriesWorld = (params?: { search?: string }) => {
  return useQuery({
    queryKey: [queryKeys.countries.world, params],
    queryFn: () => countryService.getCountriesWorld(params),
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
      queryClient.invalidateQueries({ queryKey: queryKeys.countries.lists() });
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.countries.lists() });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.countries.lists() });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.countries.lists() });
    },
  });
};
