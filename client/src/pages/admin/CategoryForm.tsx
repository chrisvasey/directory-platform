import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const COMMON_ICONS = ["📁", "🍽️", "🛍️", "🔧", "🎭", "💊", "🏠", "🚗", "💇", "📚", "🎵", "🏋️", "🌿", "💼", "🎓"];

export default function CategoryForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", slug: "", description: "", icon: "📁" });

  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);
    api.getCategory(parseInt(id)).then((cat) => {
      setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "", icon: cat.icon });
    }).finally(() => setLoading(false));
  }, [id, isEdit]);

  const set = (field: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "name" && !isEdit) next.slug = slugify(value);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      if (isEdit && id) {
        await api.updateCategory(parseInt(id), form);
      } else {
        await api.createCategory(form);
      }
      navigate("/admin/categories");
    } catch (err: any) {
      setError(err.message ?? "Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card p-6 animate-pulse h-48" />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Category" : "Add Category"}</h1>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-lg">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Icon</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => set("icon", icon)}
                className={`text-xl p-1.5 rounded-lg border-2 transition-colors ${
                  form.icon === icon ? "border-blue-500 bg-blue-50" : "border-gray-100 hover:border-gray-300"
                }`}
              >
                {icon}
              </button>
            ))}
            <input
              type="text"
              value={form.icon}
              onChange={(e) => set("icon", e.target.value)}
              className="input w-20 text-center text-xl"
              placeholder="🏷️"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            className="input"
            placeholder="Category name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Slug *</label>
          <input
            required
            type="text"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="input"
            placeholder="url-friendly-name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
          <textarea
            rows={2}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            className="input resize-none"
            placeholder="Brief description of this category"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Category"}
          </button>
          <button type="button" onClick={() => navigate("/admin/categories")} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
