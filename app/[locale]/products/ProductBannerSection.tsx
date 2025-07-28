"use client";

import React from "react";

export function ProductBannerSection() {
  return (
    <section
      className="relative w-full h-[340px] md:h-[420px] flex items-center justify-center overflow-hidden"
      style={{ minHeight: 260 }}
    >
      {/* Background Image */}
      <img
        src="/images/img-banner-product.png"
        alt="Banner Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        draggable={false}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-10" />
      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4">
        <span className="text-xs md:text-sm text-white/80 tracking-widest mb-2 uppercase">
          HUG FOR UNIVERSAL GOODNESS CREAM
        </span>
        <h2 className="text-2xl md:text-4xl font-en font-light text-white mb-6 max-w-2xl leading-snug">
          Fostering Water Sustainability
          <br className="hidden md:block" />
          While Celebrating Global Beauty.
        </h2>
        <button
          className="bg-white/90 hover:bg-white text-gray-900 font-en px-6 py-2 text-base rounded shadow transition font-medium flex items-center gap-2"
          style={{ minWidth: 120 }}
        >
          View Details
          <span className="ml-1">→</span>
        </button>
      </div>
    </section>
  );
}
