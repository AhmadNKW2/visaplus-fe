/**
 * Query Keys Factory - Centralized query key management
 * Following the Factory pattern
 */

export const queryKeys = {
  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (params?: Record<string, any>) =>
      [...queryKeys.products.lists(), params] as const,
    details: () => [...queryKeys.products.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.products.details(), id] as const,
  },

  // Users
  users: {
    all: ["users"] as const,
    lists: () => [...queryKeys.users.all, "list"] as const,
    list: (params?: Record<string, any>) =>
      [...queryKeys.users.lists(), params] as const,
    details: () => [...queryKeys.users.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.users.details(), id] as const,
  },

  // Orders
  orders: {
    all: ["orders"] as const,
    lists: () => [...queryKeys.orders.all, "list"] as const,
    list: (params?: Record<string, any>) =>
      [...queryKeys.orders.lists(), params] as const,
    details: () => [...queryKeys.orders.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.orders.details(), id] as const,
  },

  // Categories
  categories: {
    all: ["categories"] as const,
    tree: ["categories", "tree"] as const,
    main: ["categories", "main"] as const,
    lists: () => [...queryKeys.categories.all, "list"] as const,
    list: (params?: Record<string, any>) =>
      [...queryKeys.categories.lists(), params] as const,
    details: () => [...queryKeys.categories.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.categories.details(), id] as const,
  },

  // Vendors
  vendors: {
    all: ["vendors"] as const,
    lists: () => [...queryKeys.vendors.all, "list"] as const,
    list: (params?: Record<string, any>) =>
      [...queryKeys.vendors.lists(), params] as const,
    details: () => [...queryKeys.vendors.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.vendors.details(), id] as const,
  },

  // Attributes
  attributes: {
    all: ["attributes"] as const,
    lists: () => [...queryKeys.attributes.all, "list"] as const,
    list: (params?: Record<string, any>) =>
      [...queryKeys.attributes.lists(), params] as const,
    details: () => [...queryKeys.attributes.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.attributes.details(), id] as const,
  },

  // Countries
  countries: {
    all: ["countries"] as const,
    lists: () => [...queryKeys.countries.all, "list"] as const,
    list: (params?: Record<string, any>) =>
      [...queryKeys.countries.lists(), params] as const,
    details: () => [...queryKeys.countries.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.countries.details(), id] as const,
    world: ["countries-world"] as const,
  },

  // Contact Requests
  contactRequests: {
    all: ["contact-requests"] as const,
    lists: () => [...queryKeys.contactRequests.all, "list"] as const,
    list: (params?: Record<string, any>) =>
      [...queryKeys.contactRequests.lists(), params] as const,
    details: () => [...queryKeys.contactRequests.all, "detail"] as const,
    detail: (id: string | number) =>
      [...queryKeys.contactRequests.details(), id] as const,
  },

  // About Us
  aboutUs: {
    all: ["about-us"] as const,
  },

  // FAQs
  faqs: {
    all: ["faqs"] as const,
  },
} as const;
