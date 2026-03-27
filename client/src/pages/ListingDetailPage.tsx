import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Listing } from "../lib/types";

export default function ListingDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setNotFound(false);
    api
      .getListing(slug)
      .then(setListing)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card p-8 space-y-4 animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-1/3" />
          <div className="h-4 bg-gray-100 rounded w-1/4" />
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
        </div>
      </div>
    );
  }

  if (notFound || !listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Listing not found</h2>
        <p className="text-gray-500 mb-6">This listing may have been removed or the URL is incorrect.</p>
        <Link to="/" className="btn-primary">Back to Directory</Link>
      </div>
    );
  }

  const tags: string[] = JSON.parse(listing.tags || "[]");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors">Directory</Link>
        <span>/</span>
        {listing.category_slug && listing.category_name && (
          <>
            <Link to={`/?category=${listing.category_slug}`} className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <span>{listing.category_icon}</span>
              {listing.category_name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-700 font-medium truncate">{listing.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{listing.name}</h1>
                {listing.category_name && (
                  <Link
                    to={`/?category=${listing.category_slug}`}
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>{listing.category_icon}</span>
                    {listing.category_name}
                  </Link>
                )}
              </div>
              <Link
                to={`/admin/listings/${listing.id}/edit`}
                className="btn-secondary text-xs flex-shrink-0"
              >
                Edit
              </Link>
            </div>

            {listing.description && (
              <p className="text-gray-700 leading-relaxed text-sm">{listing.description}</p>
            )}
          </div>

          {tags.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-gray-700 text-sm mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/?search=${encodeURIComponent(tag)}`}
                    className="tag hover:bg-blue-100 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-gray-700 text-sm mb-4">Contact & Location</h3>
            <ul className="space-y-3">
              {listing.location && (
                <li className="flex items-start gap-2.5 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{listing.location}</span>
                </li>
              )}
              {listing.phone && (
                <li className="flex items-center gap-2.5 text-sm">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${listing.phone}`} className="text-blue-600 hover:underline">{listing.phone}</a>
                </li>
              )}
              {listing.email && (
                <li className="flex items-center gap-2.5 text-sm">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href={`mailto:${listing.email}`} className="text-blue-600 hover:underline truncate">{listing.email}</a>
                </li>
              )}
              {listing.website && (
                <li className="flex items-center gap-2.5 text-sm">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <a href={listing.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                    {listing.website.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div className="text-xs text-gray-400 px-1">
            Listed {new Date(listing.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
      </div>
    </div>
  );
}
