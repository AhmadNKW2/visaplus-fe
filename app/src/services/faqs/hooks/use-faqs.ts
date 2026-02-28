/**
 * React Query hooks for FAQs
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { faqsService } from "../api/faq.service";
import { queryKeys } from "../../../lib/query-keys";
import { Faqs, FaqItem } from "../types/faq.types";

/**
 * Get FAQs
 */
export const useFaqs = () => {
  return useQuery({
    queryKey: queryKeys.faqs.all,
    queryFn: () => faqsService.getFaqs(),
    select: (response: any): Faqs | null => {
      const data = response?.data;
      if (!data) return null;
      // Handle nested data.data structure
      if (typeof data === "object" && "data" in data) return data.data as Faqs;
      return data as Faqs;
    },
  });
};

/**
 * Update FAQs mutation
 */
export const useUpdateFaqs = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: FaqItem[]) => faqsService.updateFaqs(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
    },
  });
};
