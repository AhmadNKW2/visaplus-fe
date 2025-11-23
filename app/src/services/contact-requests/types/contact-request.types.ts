/**
 * Contact Request Types
 */

export interface ContactRequest {
  id: number;
  name: string;
  nationality: string;
  phoneNumber: string;
  destinationCountry: string;
  createdAt?: string;
  updatedAt?: string;
}
