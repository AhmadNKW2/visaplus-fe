/**
 * Country Service - API calls for countries
 */

import { BaseService } from "../../../lib/api/base.service";
import { httpClient } from "../../../lib/api/http-client";
import { ApiResponse } from "../../../types/common.types";
import {
  Country,
  CountryWorld,
  CreateCountryDto,
  UpdateCountryDto,
  ReorderCountryDto,
} from "../types/country.types";

class CountryService extends BaseService<Country> {
  protected endpoint = "/countries";

  /**
   * Get all countries
   */
  async getCountries(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
  }): Promise<ApiResponse<Country[]>> {
    // Convert params to query string format expected by backend
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.search) queryParams.search = params.search;

    const response = await this.getAll(queryParams);
    return response as unknown as ApiResponse<Country[]>;
  }

  /**
   * Get country by ID
   */
  async getCountryById(id: number): Promise<ApiResponse<Country>> {
    return this.getById(id);
  }

  /**
   * Create a new country
   */
  async createCountry(data: CreateCountryDto): Promise<ApiResponse<Country>> {
    return this.create(data);
  }

  /**
   * Update an existing country (partial update)
   */
  async updateCountry(
    id: number,
    data: UpdateCountryDto
  ): Promise<ApiResponse<Country>> {
    return this.patch(id, data);
  }

  /**
   * Delete a country
   */
  async deleteCountry(id: number): Promise<ApiResponse<void>> {
    return this.delete(id);
  }

  /**
   * Reorder countries
   */
  async reorderCountries(
    data: ReorderCountryDto
  ): Promise<ApiResponse<void>> {
    return httpClient.post<ApiResponse<void>>(
      `${this.endpoint}/reorder`,
      data
    );
  }

  /**
   * Get all countries from world database
   */
  async getCountriesWorld(): Promise<ApiResponse<CountryWorld[]>> {
    return httpClient.get<ApiResponse<CountryWorld[]>>("/countries-world");
  }
}

export const countryService = new CountryService();
