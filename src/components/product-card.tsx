import Image from "next/image";
import Link from "next/link";
import type { Product, ProductImage, ProductInventory } from "@prisma/client";

type ProductCardProps = {
  product: Product & {
    images: ProductImage[];
    inventory: ProductInventory | null;
  };
};

export default function ProductCard({ product }: ProductCardProps) {
  const firstImage =
    product.images[0]?.url || "https://placehold.co/400x400?text=No+Image";
  const isInStock =
    product.availability_type === "STOCK"
      ? (product.inventory?.quantity_available ?? 0) > 0
      : true; // PRE_ORDER assumed available until cap reached

  const stockLabel =
    product.availability_type === "PRE_ORDER"
      ? "Pre-order"
      : isInStock
        ? "In Stock"
        : "Out of Stock";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition"
    >
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={firstImage}
          alt={product.images[0]?.alt_text || product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xl font-bold mt-1">
          ৳{product.base_price.toFixed(2)}
        </p>
        <span
          className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
            isInStock
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {stockLabel}
        </span>
      </div>
    </Link>
  );
}
