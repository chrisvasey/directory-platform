export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  created_at: string;
  listing_count?: number;
};

export type Listing = {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  location: string | null;
  description: string | null;
  tags: string; // JSON string array
  phone: string | null;
  email: string | null;
  website: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_slug?: string;
  category_icon?: string;
};

export type ListingsResponse = {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};
