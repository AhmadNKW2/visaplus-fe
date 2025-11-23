/**
 * Contact Request Service - API calls for contact requests
 */

import { BaseService } from "../../../lib/api/base.service";
import { ApiResponse } from "../../../types/common.types";
import { ContactRequest } from "../types/contact-request.types";

class ContactRequestService extends BaseService<ContactRequest> {
  protected endpoint = "/contact-requests";

  /**
   * Get all contact requests
   */
  async getContactRequests(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
    destination_country?: string;
    nationality?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<ContactRequest[]>> {
    // Convert params to query string format expected by backend
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.search) queryParams.search = params.search;
    if (params?.destination_country) queryParams.destination_country = params.destination_country;
    if (params?.nationality) queryParams.nationality = params.nationality;
    if (params?.startDate) queryParams.startDate = params.startDate;
    if (params?.endDate) queryParams.endDate = params.endDate;

    const response = await this.getAll(queryParams);
    return response as unknown as ApiResponse<ContactRequest[]>;
  }

  /**
   * Get contact request by ID
   */
  async getContactRequestById(id: number): Promise<ApiResponse<ContactRequest>> {
    return this.getById(id);
  }
}

export const contactRequestService = new ContactRequestService();
