import { Link, useSearchParams } from "react-router-dom";
import type { Category } from "../lib/types";

type Props = {
  categories: Category[];
  loading?: boolean;
};

export default function CategorySidebar({ categories, loading }: Props) {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category");

  return (
    <aside className="w-64 flex-shrink-0">
      <div className="card p-4">
        <h2 className="font-semibold text-gray-700 text-sm uppercase tracking-wider mb-3 px-1">
          Categories
        </h2>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <nav className="space-y-0.5">
            <Link
              to="/"
              className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                !activeCategory
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🏠</span>
                All Listings
              </span>
              <span className={`text-xs font-medium ${!activeCategory ? "text-blue-500" : "text-gray-400"}`}>
                {categories.reduce((sum, c) => sum + (c.listing_count ?? 0), 0)}
              </span>
            </Link>

            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/?category=${cat.slug}`}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === cat.slug
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{cat.icon}</span>
                  {cat.name}
                </span>
                <span className={`text-xs font-medium ${activeCategory === cat.slug ? "text-blue-500" : "text-gray-400"}`}>
                  {cat.listing_count ?? 0}
                </span>
              </Link>
            ))}
          </nav>
        )}
      </div>
    </aside>
  );
}
