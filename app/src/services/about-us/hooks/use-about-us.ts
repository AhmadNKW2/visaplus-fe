/**
 * React Query hooks for About Us
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { aboutUsService } from "../api/about-us.service";
import { queryKeys } from "../../../lib/query-keys";
import { AboutUs } from "../types/about-us.types";

/**
 * Get About Us data
 */
export const useAboutUs = () => {
  return useQuery({
    queryKey: queryKeys.aboutUs.all,
    queryFn: () => aboutUsService.getAboutUs(),
    select: (response: any): AboutUs | null => {
      const data = response?.data;
      if (!data) return null;
      // Handle nested data.data structure
      if (typeof data === "object" && "data" in data) return data.data as AboutUs;
      return data as AboutUs;
    },
  });
};

/**
 * Update About Us mutation
 */
export const useUpdateAboutUs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { contentEn?: string; contentAr?: string; image?: File }) =>
      aboutUsService.updateAboutUs(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.aboutUs.all });
    },
  });
};
