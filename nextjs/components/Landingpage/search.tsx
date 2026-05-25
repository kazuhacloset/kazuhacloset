"use client";

import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

import Image from "next/image";

import { useRouter } from "next/navigation";

import { Search } from "lucide-react";

import { products } from "../product/All_product";

import { wallpapers as rawWallpapers } from "../product/Wallpaper_details";

interface SearchItem {
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string;

  itemType:
    | "product"
    | "wallpaper"
    | "product_category";

  originalProductId?: string;
}

const transformData = (): SearchItem[] => {
  const transformedItems: SearchItem[] = [];

  transformedItems.push({
    id: "product-all-generic",

    name: "All T-shirts",

    description:
      "Browse the complete anime streetwear collection.",

    category: "All",

    imageUrl:
      "https://placehold.co/60x60/111111/FFFFFF?text=ALL",

    itemType: "product_category",
  });

  const productCategories = new Set<string>();

  products.forEach((product) => {
    transformedItems.push({
      id: product.id,

      name: product.name,

      description: product.description,

      category: product.category,

      imageUrl:
        product.thumbnail ||
        "https://placehold.co/60x60/111111/FFFFFF",

      itemType: "product",

      originalProductId: product.id,
    });

    productCategories.add(product.category);
  });

  productCategories.forEach((category) => {
    if (category !== "All") {
      transformedItems.push({
        id: `category-${category}`,

        name: `${category} T-shirts`,

        description: `Explore ${category} anime apparel.`,

        category,

        imageUrl:
          "https://placehold.co/60x60/111111/FFFFFF",

        itemType: "product_category",
      });
    }
  });

  transformedItems.push({
    id: "wallpaper-all",

    name: "All Wallpapers",

    description:
      "Browse cinematic anime wallpapers.",

    category: "all",

    imageUrl:
      "https://placehold.co/60x60/111111/FFFFFF",

    itemType: "wallpaper",
  });

  Object.entries(rawWallpapers).forEach(
    ([categoryKey, urls]) => {
      const formattedCategory =
        categoryKey
          .replace(/([a-z])([A-Z])/g, "$1 $2")
          .replace(/^\w/, (c) => c.toUpperCase());

      if (urls.length > 0) {
        transformedItems.push({
          id: `wallpaper-${categoryKey}`,

          name: `${formattedCategory} Wallpapers`,

          description: `Explore ${formattedCategory} wallpapers.`,

          category: categoryKey,

          imageUrl: urls[0],

          itemType: "wallpaper",
        });
      }

      urls.forEach((url: string, index: number) => {
        transformedItems.push({
          id: `wallpaper-${categoryKey}-${index}`,

          name: `${formattedCategory} Wallpaper ${
            index + 1
          }`,

          description:
            "High quality anime wallpaper.",

          category: categoryKey,

          imageUrl: url,

          itemType: "wallpaper",
        });
      });
    }
  );

  return transformedItems;
};

interface SearchBarProps {
  isMobile?: boolean;

  onClose?: () => void;
}

export default function SearchBar({
  isMobile = false,
  onClose,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const router = useRouter();

  const searchBarRef = useRef<HTMLDivElement>(null);

  const allSearchableItems = useMemo(
    () => transformData(),
    []
  );

  const filteredItems = useMemo(() => {
    if (!query.trim()) return [];

    return allSearchableItems
      .filter((item) => {
        const search = query.toLowerCase();

        return (
          item.name.toLowerCase().includes(search) ||
          item.description
            .toLowerCase()
            .includes(search) ||
          item.category.toLowerCase().includes(search)
        );
      })
      .slice(0, 8);
  }, [query, allSearchableItems]);

  useEffect(() => {
    if (isMobile && searchBarRef.current) {
      const input =
        searchBarRef.current.querySelector("input");

      input?.focus();
    }
  }, [isMobile]);

  const closeSearch = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleItemClick = useCallback(
    (item: SearchItem) => {
      if (
        item.itemType === "product" &&
        item.originalProductId
      ) {
        localStorage.setItem(
          "productid",
          item.originalProductId
        );

        router.push("/product_page/");
      } else if (
        item.itemType === "product_category"
      ) {
        router.push(
          `/allproducts?category=${encodeURIComponent(
            item.category
          )}`
        );
      } else if (item.itemType === "wallpaper") {
        router.push(
          `/wallpapers?category=${encodeURIComponent(
            item.category
          )}`
        );
      }

      closeSearch();
    },
    [router, closeSearch]
  );

  const handleSearchSubmit = useCallback(() => {
    if (!query.trim()) return;

    const search = query.toLowerCase();

    const matchedCategory = filteredItems.find(
      (item) =>
        item.itemType === "product_category" &&
        item.name.toLowerCase() === search
    );

    if (matchedCategory) {
      router.push(
        `/allproducts?category=${encodeURIComponent(
          matchedCategory.category
        )}`
      );
    } else if (search.includes("wallpaper")) {
      router.push(
        `/wallpapers?search=${encodeURIComponent(
          query.trim()
        )}`
      );
    } else {
      router.push(
        `/allproducts?search=${encodeURIComponent(
          query.trim()
        )}`
      );
    }

    closeSearch();
  }, [query, filteredItems, router, closeSearch]);

  return (
    <div
      ref={searchBarRef}
      className={`relative ${
        isMobile ? "w-full" : "w-full"
      }`}
    >
      {/* SEARCH CONTAINER */}
      <div className="group relative flex items-center h-[48px] rounded-full overflow-hidden">
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0e] via-[#141414] to-[#0d0d0e]" />

        {/* GLOW */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b00]/10 via-transparent to-[#E11D48]/10 blur-xl opacity-70 group-hover:opacity-100 transition-all duration-500" />

        {/* BORDER */}
        <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-[#ff6b00]/30 transition-all duration-500" />

        {/* SEARCH ICON */}
        <div className="relative z-10 pl-4 pr-2">
          <div className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center">
            <Search
              size={17}
              className="text-[#ff6b00]"
            />
          </div>
        </div>

        {/* INPUT */}
        <input
          type="text"
          value={query}
          onChange={(e) =>
            setQuery(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchSubmit();
            }
          }}
          placeholder="Search Anime Drops..."
          className="relative z-10 flex-1 bg-transparent outline-none text-sm text-white placeholder:text-zinc-500 pr-5"
        />
      </div>

      {/* RESULTS */}
      {query && (
        <div className="absolute top-[115%] left-0 right-0 z-[9999]">
          <div className="p-2 rounded-2xl border border-white/10 bg-[#0d0d0e]/95 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.45)] overflow-hidden">
          {filteredItems.length > 0 ? (
            <div className="space-y-2 max-h-[350px] overflow-y-auto">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    handleItemClick(item)
                  }
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300 cursor-pointer border border-transparent hover:border-white/5"
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={52}
                    height={52}
                    className="rounded-lg object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate group-hover:text-[#ff6b00] transition-all duration-300">
                      {item.name}
                    </p>

                    <p className="text-xs text-zinc-400 truncate">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-sm text-zinc-500">
              No results found for &quot;{query}&quot;
            </div>
          )}
          </div>
        </div>
      )}
    </div>
  );
}