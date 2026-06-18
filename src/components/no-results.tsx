import Link from "next/link";

export default function NoResults({ query }: { query: string }) {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-semibold mb-2">No products found</h2>
      <p className="text-gray-600 mb-4">
        We couldn’t find anything for “{query}”. Try a different search term or
        browse categories.
      </p>
      <Link href="/products" className="text-blue-600 underline">
        View all products
      </Link>
    </div>
  );
}
