"use client";

import Navbar from "../components/common/navbar/Navbar";
import PromoCard from "../components/Landingpage/PromoCard";
import ProductShowcase from "../components/Landingpage/ProductShowcase";
import ShopByAnime from "../components/Landingpage/ShopByAnime";
import CommunityReviews from "../components/Landingpage/CommunityReviews";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050505] scroll-smooth">

      {/* HERO */}
      <section
        id="home"
        className="relative w-full transition-all duration-300"
      >
        <Navbar />
        <PromoCard />
      </section>

      {/* PREMIUM COLLECTION */}
      <section
        id="products"
        className="relative -mt-[2px]"
      >
        <ProductShowcase />
      </section>

      {/* SHOP BY ANIME */}
      <section
        id="shop-by-anime"
        className="relative"
      >
        <ShopByAnime />
      </section>

      {/* COMMUNITY REVIEWS */}
      <section
        id="community"
        className="relative"
      >
        <CommunityReviews />
      </section>
    </main>
  );
}