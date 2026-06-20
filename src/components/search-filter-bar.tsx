"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ProductType } from "@prisma/client";
import { useCallback } from "react";

interface SearchFilterBarProps {
  currentQuery: string;
  currentType: string | undefined;
  currentSort: string;
}

export default function SearchFilterBar({
  currentQuery,
  currentType,
  currentSort,
}: SearchFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Apply updates
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });
      // Reset page to 1 on any filter change
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <form
      className="flex flex-col sm:flex-row gap-4 mb-6"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateParams({
          q: formData.get("q") as string,
          type: formData.get("type") as string,
          sort: formData.get("sort") as string,
        });
      }}
    >
      <input
        type="text"
        name="q"
        defaultValue={currentQuery}
        placeholder="Search products..."
        className="border p-2 rounded flex-grow"
      />
      <select
        name="type"
        defaultValue={currentType || ""}
        className="border p-2 rounded"
      >
        <option value="">All Types</option>
        {Object.values(ProductType).map((type) => (
          <option key={type} value={type}>
            {type.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <select
        name="sort"
        defaultValue={currentSort}
        className="border p-2 rounded"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
        <option value="name_asc">Name: A-Z</option>
        <option value="name_desc">Name: Z-A</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Apply
      </button>
    </form>
  );
}
