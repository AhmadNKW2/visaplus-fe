/**
 * FAQs Service - API calls for FAQs
 */

import { httpClient } from "../../../lib/api/http-client";
import { ApiResponse } from "../../../types/common.types";
import { Faqs, FaqItem } from "../types/faq.types";

class FaqsService {
  private endpoint = "/faqs";

  /**
   * Get all FAQs
   */
  async getFaqs(): Promise<ApiResponse<Faqs>> {
    return httpClient.get<ApiResponse<Faqs>>(this.endpoint);
  }

  /**
   * Update FAQs (replaces entire items array)
   */
  async updateFaqs(items: FaqItem[]): Promise<ApiResponse<Faqs>> {
    return httpClient.put<ApiResponse<Faqs>>(this.endpoint, { items });
  }
}

export const faqsService = new FaqsService();
