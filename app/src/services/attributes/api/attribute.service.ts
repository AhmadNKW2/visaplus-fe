/**
 * Attribute Service - API calls for attributes
 */

import { BaseService } from "../../../lib/api/base.service";
import { httpClient } from "../../../lib/api/http-client";
import { ApiResponse } from "../../../types/common.types";
import {
  Attribute,
  CreateAttributeDto,
  UpdateAttributeDto,
  ReorderAttributeDto,
} from "../types/attribute.types";

class AttributeService extends BaseService<Attribute> {
  protected endpoint = "/attributes";

  /**
   * Get all attributes
   */
  async getAttributes(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    search?: string;
  }): Promise<ApiResponse<Attribute[]>> {
    // Convert params to query string format expected by backend
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.limit) queryParams.limit = String(params.limit);
    if (params?.sort) queryParams.sort = params.sort;
    if (params?.search) queryParams.search = params.search;

    const response = await this.getAll(queryParams);
    // API returns data directly as array, not paginated
    return response as unknown as ApiResponse<Attribute[]>;
  }

  /**
   * Get attribute by ID
   */
  async getAttributeById(id: number): Promise<ApiResponse<Attribute>> {
    return this.getById(id);
  }

  /**
   * Create a new attribute
   */
  async createAttribute(
    data: CreateAttributeDto
  ): Promise<ApiResponse<Attribute>> {
    return this.create(data);
  }

  /**
   * Update an existing attribute (partial update)
   */
  async updateAttribute(
    id: number,
    data: UpdateAttributeDto
  ): Promise<ApiResponse<Attribute>> {
    return this.patch(id, data);
  }

  /**
   * Delete an attribute
   */
  async deleteAttribute(id: number): Promise<ApiResponse<void>> {
    return this.delete(id);
  }

  /**
   * Reorder attributes
   */
  async reorderAttributes(
    data: ReorderAttributeDto
  ): Promise<ApiResponse<void>> {
    return httpClient.post<ApiResponse<void>>(
      `${this.endpoint}/reorder`,
      data
    );
  }
}

export const attributeService = new AttributeService();
