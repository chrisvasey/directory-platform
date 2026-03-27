import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import type { Category } from "../../lib/types";

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    api.getCategories().then(setCategories).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete category "${name}"? All listings in this category will also be deleted.`)) return;
    setDeleting(id);
    await api.deleteCategory(id).catch(() => alert("Failed to delete category."));
    setDeleting(null);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} total</p>
        </div>
        <Link to="/admin/categories/new" className="btn-primary text-sm">+ Add Category</Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-14 card animate-pulse" />)}
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Slug</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Listings</th>
                <th className="px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 font-medium text-gray-900">
                      <span className="text-xl">{cat.icon}</span>
                      {cat.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-gray-700">{cat.listing_count ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/categories/${cat.id}/edit`} className="text-xs btn-secondary py-1 px-2.5">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(cat.id, cat.name)}
                        disabled={deleting === cat.id}
                        className="text-xs btn-danger py-1 px-2.5"
                      >
                        {deleting === cat.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="text-center py-10 text-gray-500 text-sm">No categories yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
