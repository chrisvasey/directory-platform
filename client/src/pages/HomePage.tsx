import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import type { Category, Listing, ListingsResponse } from "../lib/types";
import ListingCard from "../components/ListingCard";
import CategorySidebar from "../components/CategorySidebar";

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") ?? "";
  const categoryFilter = searchParams.get("category") ?? "";

  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<ListingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [catLoading, setCatLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    api.getCategories().then(setCategories).finally(() => setCatLoading(false));
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .getListings({ search: searchQuery || undefined, category: categoryFilter || undefined, limit: 50 })
      .then(setData)
      .finally(() => setLoading(false));
  }, [searchQuery, categoryFilter]);

  // Sync input with URL param
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const newParams = new URLSearchParams(searchParams);
      if (searchInput.trim()) newParams.set("search", searchInput.trim());
      else newParams.delete("search");
      newParams.delete("page");
      setSearchParams(newParams);
    },
    [searchInput, searchParams, setSearchParams]
  );

  const clearFilters = () => setSearchParams({});

  const hasFilters = searchQuery || categoryFilter;
  const listings: Listing[] = data?.listings ?? [];

  const activeCategory = categories.find((c) => c.slug === categoryFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero / search */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">
          {activeCategory ? (
            <span className="flex items-center gap-2">
              <span>{activeCategory.icon}</span>
              {activeCategory.name}
            </span>
          ) : searchQuery ? (
            `Results for "${searchQuery}"`
          ) : (
            "Discover Local Businesses"
          )}
        </h1>
        <p className="text-gray-500 text-sm">
          {data ? `${data.total} listing${data.total !== 1 ? "s" : ""}` : "Loading..."}
          {activeCategory?.description && ` · ${activeCategory.description}`}
        </p>
      </div>

      <div className="flex gap-8">
        <CategorySidebar categories={categories} loading={catLoading} />

        <main className="flex-1 min-w-0">
          {/* Search bar (mobile / inline) */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6 lg:hidden">
            <input
              type="search"
              placeholder="Search listings..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="input flex-1"
            />
            <button type="submit" className="btn-primary px-5">Search</button>
          </form>

          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                  Search: "{searchQuery}"
                  <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete("search"); setSearchParams(p); }} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              {categoryFilter && activeCategory && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                  {activeCategory.icon} {activeCategory.name}
                  <button onClick={() => { const p = new URLSearchParams(searchParams); p.delete("category"); setSearchParams(p); }} className="ml-1 hover:text-blue-900">×</button>
                </span>
              )}
              <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700 underline">
                Clear all
              </button>
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6" />
                  <div className="flex gap-1.5">
                    <div className="h-5 w-14 bg-gray-100 rounded-full animate-pulse" />
                    <div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No listings found</h3>
              <p className="text-gray-500 text-sm mb-4">Try adjusting your search or category filter.</p>
              <button onClick={clearFilters} className="btn-primary">View all listings</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
