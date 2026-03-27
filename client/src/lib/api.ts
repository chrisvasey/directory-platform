import type { Category, Listing, ListingsResponse } from "./types";

const BASE = "/api";

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...opts?.headers },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? "Request failed");
  }
  return res.json();
}

export const api = {
  // Categories
  getCategories: () => req<Category[]>("/categories"),
  getCategory: (id: number) => req<Category>(`/categories/${id}`),
  createCategory: (data: Omit<Category, "id" | "created_at" | "listing_count">) =>
    req<Category>("/categories", { method: "POST", body: JSON.stringify(data) }),
  updateCategory: (id: number, data: Omit<Category, "id" | "created_at" | "listing_count">) =>
    req<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteCategory: (id: number) => req<{ success: boolean }>(`/categories/${id}`, { method: "DELETE" }),

  // Listings
  getListings: (params?: { search?: string; category?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.category) qs.set("category", params.category);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const query = qs.toString();
    return req<ListingsResponse>(`/listings${query ? `?${query}` : ""}`);
  },
  getListing: (slug: string) => req<Listing>(`/listings/${slug}`),
  createListing: (data: Omit<Listing, "id" | "created_at" | "updated_at" | "category_name" | "category_slug" | "category_icon"> & { tags: string[] }) =>
    req<Listing>("/listings", { method: "POST", body: JSON.stringify(data) }),
  updateListing: (id: number, data: Omit<Listing, "id" | "created_at" | "updated_at" | "category_name" | "category_slug" | "category_icon"> & { tags: string[] }) =>
    req<Listing>(`/listings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteListing: (id: number) => req<{ success: boolean }>(`/listings/${id}`, { method: "DELETE" }),
};
