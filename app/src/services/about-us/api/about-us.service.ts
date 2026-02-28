/**
 * About Us Service - API calls for About Us
 */

import { httpClient } from "../../../lib/api/http-client";
import { ApiResponse } from "../../../types/common.types";
import { AboutUs } from "../types/about-us.types";

class AboutUsService {
  private endpoint = "/about-us";

  /**
   * Get About Us data
   */
  async getAboutUs(): Promise<ApiResponse<AboutUs>> {
    return httpClient.get<ApiResponse<AboutUs>>(this.endpoint);
  }

  /**
   * Update About Us (multipart/form-data for image upload)
   */
  async updateAboutUs(data: {
    contentEn?: string;
    contentAr?: string;
    image?: File;
  }): Promise<ApiResponse<AboutUs>> {
    const formData = new FormData();
    if (data.contentEn !== undefined) formData.append("contentEn", data.contentEn);
    if (data.contentAr !== undefined) formData.append("contentAr", data.contentAr);
    if (data.image) formData.append("image", data.image);

    return httpClient.putFormData<ApiResponse<AboutUs>>(this.endpoint, formData);
  }
}

export const aboutUsService = new AboutUsService();
