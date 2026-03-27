import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Category } from "../../lib/types";

export default function AdminDashboard() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalListings, setTotalListings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCategories(), api.getListings({ limit: 1 })]).then(([cats, res]) => {
      setCategories(cats);
      setTotalListings(res.total);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage your directory listings and categories.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="card p-5 h-24 animate-pulse bg-gray-50" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="text-sm text-gray-500 mb-1">Total Listings</p>
            <p className="text-3xl font-bold text-gray-900">{totalListings}</p>
            <Link to="/admin/listings" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Manage →</Link>
          </div>
          <div className="card p-5">
            <p className="text-sm text-gray-500 mb-1">Categories</p>
            <p className="text-3xl font-bold text-gray-900">{categories.length}</p>
            <Link to="/admin/categories" className="text-xs text-blue-600 hover:underline mt-1 inline-block">Manage →</Link>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Link to="/admin/listings/new" className="btn-primary text-sm">+ Add Listing</Link>
        <Link to="/admin/categories/new" className="btn-secondary text-sm">+ Add Category</Link>
      </div>

      {!loading && (
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-700 text-sm">Listings by Category</h2>
          </div>
          <ul className="divide-y divide-gray-50">
            {categories.map((cat) => (
              <li key={cat.id} className="flex items-center justify-between px-5 py-3">
                <span className="flex items-center gap-2 text-sm text-gray-700">
                  <span>{cat.icon}</span>
                  {cat.name}
                </span>
                <span className="text-sm font-medium text-gray-900">{cat.listing_count ?? 0}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
