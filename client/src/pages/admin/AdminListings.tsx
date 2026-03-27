import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Listing } from "../../lib/types";

export default function AdminListings() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    api.getListings({ limit: 100 }).then((r) => setListings(r.listings)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    await api.deleteListing(id).catch(() => alert("Failed to delete listing."));
    setDeleting(null);
    load();
  };

  const filtered = listings.filter(
    (l) =>
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.category_name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Listings</h1>
          <p className="text-sm text-gray-500 mt-0.5">{listings.length} total</p>
        </div>
        <Link to="/admin/listings/new" className="btn-primary text-sm">+ Add Listing</Link>
      </div>

      <input
        type="search"
        placeholder="Filter by name or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="input max-w-sm"
      />

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 card animate-pulse" />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Location</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/listing/${listing.slug}`} className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                      {listing.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    <span className="flex items-center gap-1">
                      <span>{listing.category_icon}</span>
                      {listing.category_name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 truncate max-w-xs">{listing.location ?? "—"}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/listings/${listing.id}/edit`} className="text-xs btn-secondary py-1 px-2.5">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(listing.id, listing.name)}
                        disabled={deleting === listing.id}
                        className="text-xs btn-danger py-1 px-2.5"
                      >
                        {deleting === listing.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">No listings found.</div>
          )}
        </div>
      )}
    </div>
  );
}
