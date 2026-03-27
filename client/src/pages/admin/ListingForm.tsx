import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import type { Category, Listing } from "../../lib/types";

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ListingForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    category_id: "",
    name: "",
    slug: "",
    location: "",
    description: "",
    tags: "",
    phone: "",
    email: "",
    website: "",
    image_url: "",
  });

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    if (!isEdit || !id) return;
    setLoading(true);
    // Load listing by id — fetch all and find
    api.getListings({ limit: 200 }).then((res) => {
      const listing = res.listings.find((l: Listing) => l.id === parseInt(id));
      if (listing) {
        const tags: string[] = JSON.parse(listing.tags || "[]");
        setForm({
          category_id: String(listing.category_id),
          name: listing.name,
          slug: listing.slug,
          location: listing.location ?? "",
          description: listing.description ?? "",
          tags: tags.join(", "),
          phone: listing.phone ?? "",
          email: listing.email ?? "",
          website: listing.website ?? "",
          image_url: listing.image_url ?? "",
        });
      }
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

    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      category_id: parseInt(form.category_id),
      name: form.name,
      slug: form.slug,
      location: form.location || undefined,
      description: form.description || undefined,
      tags,
      phone: form.phone || undefined,
      email: form.email || undefined,
      website: form.website || undefined,
      image_url: form.image_url || undefined,
    };

    try {
      if (isEdit && id) {
        await api.updateListing(parseInt(id), payload as any);
      } else {
        await api.createListing(payload as any);
      }
      navigate("/admin/listings");
    } catch (err: any) {
      setError(err.message ?? "Failed to save listing.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="card p-6 animate-pulse h-64" />;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{isEdit ? "Edit Listing" : "Add Listing"}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{isEdit ? "Update the listing details." : "Create a new directory listing."}</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Category *</label>
            <select
              required
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}
              className="input"
            >
              <option value="">Select a category…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Name *</label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="input"
              placeholder="Business name"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Slug *</label>
            <input
              required
              type="text"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="input"
              placeholder="url-friendly-name"
            />
            <p className="text-xs text-gray-400 mt-1">Used in the URL: /listing/{form.slug || "…"}</p>
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              className="input"
              placeholder="123 Main St, City"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              className="input resize-none"
              placeholder="A brief description of this business…"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => set("tags", e.target.value)}
              className="input"
              placeholder="Italian, Pizza, Casual (comma-separated)"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className="input"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className="input"
              placeholder="contact@business.com"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-700 mb-1">Website</label>
            <input
              type="url"
              value={form.website}
              onChange={(e) => set("website", e.target.value)}
              className="input"
              placeholder="https://www.example.com"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Listing"}
          </button>
          <button type="button" onClick={() => navigate("/admin/listings")} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
