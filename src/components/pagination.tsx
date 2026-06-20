import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams: Record<string, string | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  searchParams,
}: PaginationProps) {
  // Clean out undefined values so they don't appear in the URL
  const cleanParams = Object.fromEntries(
    Object.entries(searchParams).filter(([, v]) => v !== undefined && v !== ""),
  );

  const buildHref = (page: number) => {
    const params = new URLSearchParams(cleanParams);
    if (page > 1) params.set("page", String(page));
    else params.delete("page"); // no page=1 in URL for cleaner canonical
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  };

  if (totalPages <= 1) return null;

  // Generate page numbers with ellipsis logic (simplified: show all)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex justify-center mt-8 gap-2">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-3 py-1 border rounded"
        >
          Previous
        </Link>
      )}
      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`px-3 py-1 border rounded ${
            page === currentPage ? "bg-blue-600 text-white border-blue-600" : ""
          }`}
        >
          {page}
        </Link>
      ))}
      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-3 py-1 border rounded"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
