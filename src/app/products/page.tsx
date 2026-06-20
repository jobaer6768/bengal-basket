import { prisma } from "@/lib/prisma";
import { Prisma, ProductType } from "@prisma/client";
import NoResults from "@/components/no-results";
import ProductCard from "@/components/product-card";
import Pagination from "@/components/pagination";
import SearchFilterBar from "@/components/search-filter-bar";

const ITEMS_PER_PAGE = 12;

// This interface helps typing the searchParams in the page props
interface ProductsPageProps {
  searchParams: {
    q?: string;
    type?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const query = searchParams.q || "";
  const typeFilter = searchParams.type as ProductType | undefined;
  const sort = searchParams.sort || "newest";
  const page = parseInt(searchParams.page || "1", 10) || 1;

  let productIds: string[] | undefined;

  if (query) {
    const searchResults = await prisma.$queryRaw<{ id: string }[]>`
        SELECT id
        FROM products 
        WHERE search_vector @@ websearch_to_tsvector('english', ${query})
        ORDER BY ts_rank(search_vector @@ websearch_to_tsvector('english', ${query})) DESC
        LIMIT 100
    `;

    productIds = searchResults.map((r) => r.id);

    // If no matches, show empty list
    if (productIds.length === 0) {
      return <NoResults query={query} />;
    }
  }

  // AS Type will grow as time goes on
  const validProuctTypes = Object.values(ProductType);
  const typeFilterValid =
    typeFilter && validProuctTypes.includes(typeFilter as ProductType)
      ? typeFilter
      : undefined;

  const where: Prisma.ProductWhereInput = {
    is_active: true,
    ...(productIds ? { id: { in: productIds } } : {}),
    ...(typeFilterValid ? { type: typeFilterValid } : {}),
  };

  let orderBy: Prisma.ProductOrderByWithRelationInput[] = [];
  switch (sort) {
    case "price_asc":
      orderBy = [{ base_price: "asc" }];
      break;
    case "price_desc":
      orderBy = [{ base_price: "desc" }];
      break;
    case "name_asc":
      orderBy = [{ name: "asc" }];
      break;
    case "name_desc":
      orderBy = [{ name: "desc" }];
      break;
    case "newest":
    default:
      orderBy = [{ created_at: "desc" }];
      break;
  }

  const totalProducts = await prisma.product.count({ where });
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  const products = await prisma.product.findMany({
    where,
    orderBy,
    skip: (page - 1) * ITEMS_PER_PAGE,
    take: ITEMS_PER_PAGE,
    include: {
      images: { orderBy: { sort_order: "desc" }, take: 1 },
      inventory: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Our Products</h1>
      {/* Search & Filter Bar – you'll build this as a client component later for interactivity */}
      <SearchFilterBar
        currentQuery={query}
        currentType={typeFilter}
        currentSort={sort}
      />
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            searchParams={searchParams}
            currentPage={page}
            totalPages={totalPages}
          />
        </>
      )}
    </div>
  );
}
