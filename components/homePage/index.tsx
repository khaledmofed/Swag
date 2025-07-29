"use client";

import { useEffect } from "react";
import Banner from "@/components/homePage/banner";
import { WhatWeOffer } from "@/components/homePage/WhatWeOffer";
import { PromoBanner } from "@/components/homePage/PromoBanner";
import { AttractiveJewellery } from "@/components/homePage/AttractiveJewellery";
import { DiscoverSection } from "@/components/homePage/DiscoverSection";
import { CursorSection } from "@/components/homePage/CursorSection";
import { CollectionUpdateSection } from "@/components/homePage/CollectionUpdateSection";
import LatestBlogs from "@/components/homePage/LatestBlogs";
import MouseHighlighter from "@/components/common/MouseHighlighter";
import { MainLayout } from "../layout/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      {/* Full-screen video banner */}
      <Banner />
      {/* What We Offer Services Section */}
      <WhatWeOffer />

      {/* Promotional Banner with Moving Text */}
      <PromoBanner speed="slow" />

      {/* Attractive Jewellery Collections Section */}
      <AttractiveJewellery />

      {/* Discover the Best Jewelry Section */}
      <DiscoverSection />

      {/* Cursor Section - Full Width Image Slider */}
      <CursorSection />

      {/* Latest Blogs Section - Educational articles with GSAP animations */}
      <LatestBlogs />

      {/* Collection Update Section - Call to Action */}
      <CollectionUpdateSection />

      {/* Mouse Highlighter - Smooth short line effect for the homepage */}
      {/* <MouseHighlighter
        enabled={true}
        color="primary"
        size={40}
        opacity={0.4}
        animationDuration={20}
      /> */}
    </MainLayout>
  );
}
