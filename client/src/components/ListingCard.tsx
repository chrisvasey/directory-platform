import { Link } from "react-router-dom";
import type { Listing } from "../lib/types";

type Props = { listing: Listing };

export default function ListingCard({ listing }: Props) {
  const tags: string[] = JSON.parse(listing.tags || "[]");

  return (
    <Link to={`/listing/${listing.slug}`} className="card block p-5 group">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-base leading-snug">
            {listing.name}
          </h3>
          {listing.category_name && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <span>{listing.category_icon}</span>
              {listing.category_name}
            </span>
          )}
        </div>
        <svg className="w-5 h-5 text-gray-300 group-hover:text-blue-400 transition-colors flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      {listing.location && (
        <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-2">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {listing.location}
        </p>
      )}

      {listing.description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{listing.description}</p>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {tags.length > 4 && (
            <span className="tag bg-gray-100 text-gray-500">+{tags.length - 4}</span>
          )}
        </div>
      )}
    </Link>
  );
}
