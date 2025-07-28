"use client";

import React from "react";
import { Icon } from "@/components/common/Icon";
const shareOptions = [
  {
    label: "Share on WhatsApp",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path
          d="M16 3C9.373 3 4 8.373 4 15c0 2.65.87 5.1 2.36 7.1L4 29l7.18-2.32A12.93 12.93 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16 3Zm0 22c-1.97 0-3.85-.57-5.44-1.65l-.39-.25-4.13 1.34 1.36-4.01-.25-.4A9.97 9.97 0 1 1 26 15c0 5.52-4.48 10-10 10Zm5.13-7.47c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.56-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.36.99 2.68 1.13 2.87.14.18 1.95 2.98 4.74 4.06.66.23 1.18.37 1.58.47.66.17 1.26.15 1.74.09.53-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.19-.53-.33Z"
          fill="#25D366"
        />
      </svg>
    ),
    url: (shareUrl: string) =>
      `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
  },
  {
    label: "Share on Facebook",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path
          d="M29 16c0-7.18-5.82-13-13-13S3 8.82 3 16c0 6.5 4.84 11.86 11.13 12.82v-9.07h-3.35v-3.75h3.35v-2.86c0-3.3 1.97-5.12 5-5.12 1.45 0 2.97.26 2.97.26v3.27h-1.68c-1.66 0-2.18 1.03-2.18 2.09v2.36h3.71l-.59 3.75h-3.12v9.07C24.16 27.86 29 22.5 29 16Z"
          fill="#1877F3"
        />
      </svg>
    ),
    url: (shareUrl: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
  },
  {
    label: "Share on Instagram",
    icon: (
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="url(#ig-gradient)" />
        <defs>
          <linearGradient
            id="ig-gradient"
            x1="0"
            y1="0"
            x2="32"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#F58529" />
            <stop offset="0.5" stopColor="#DD2A7B" />
            <stop offset="1" stopColor="#515BD4" />
          </linearGradient>
        </defs>
        <circle cx="16" cy="16" r="7" stroke="#fff" strokeWidth="2" />
        <circle cx="24" cy="8" r="1.5" fill="#fff" />
      </svg>
    ),
    url: (shareUrl: string) =>
      `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`,
  },
  {
    label: "Share on Twitter",
    icon: (
      // X (Twitter) official icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <g clipPath="url(#clip0_29390_13604)">
          <path
            d="M14.469 10.1571L23.2069 0H21.1363L13.5491 8.81931L7.4893 0H0.5L9.66366 13.3364L0.5 23.9877H2.57073L10.583 14.6742L16.9826 23.9877H23.9719L14.4684 10.1571H14.469ZM11.6328 13.4538L10.7043 12.1258L3.31684 1.55881H6.49736L12.4592 10.0867L13.3876 11.4147L21.1373 22.4998H17.9567L11.6328 13.4544V13.4538Z"
            fill="black"
          />
        </g>
        <defs>
          <clipPath id="clip0_29390_13604">
            <rect
              width="23.4719"
              height="24"
              fill="white"
              transform="translate(0.5)"
            />
          </clipPath>
        </defs>
      </svg>
    ),
    url: (shareUrl: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
  },
  {
    label: "Share via Gmail",
    icon: (
      // Google G icon
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.52 12.2727C23.52 11.4218 23.4436 10.6036 23.3018 9.81818H12V14.46H18.4582C18.18 15.96 17.3345 17.2309 16.0636 18.0818V21.0927H19.9418C22.2109 19.0036 23.52 15.9273 23.52 12.2727Z"
          fill="#4285F4"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.001 24C15.241 24 17.9573 22.9254 19.9428 21.0927L16.0646 18.0818C14.9901 18.8018 13.6155 19.2272 12.001 19.2272C8.87553 19.2272 6.23007 17.1163 5.28643 14.28H1.27734V17.3891C3.25189 21.3109 7.31007 24 12.001 24Z"
          fill="#34A853"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M5.28545 14.28C5.04545 13.56 4.90909 12.7909 4.90909 12C4.90909 11.2091 5.04545 10.44 5.28545 9.71999V6.6109H1.27636C0.463636 8.2309 0 10.0636 0 12C0 13.9364 0.463636 15.7691 1.27636 17.3891L5.28545 14.28Z"
          fill="#FBBC05"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.001 4.77273C13.7628 4.77273 15.3446 5.37818 16.5883 6.56727L20.0301 3.12545C17.9519 1.18909 15.2355 0 12.001 0C7.31007 0 3.25189 2.68909 1.27734 6.61091L5.28643 9.72C6.23007 6.88364 8.87553 4.77273 12.001 4.77273Z"
          fill="#EA4335"
        />
      </svg>
    ),
    url: (shareUrl: string) =>
      `mailto:?subject=Check%20this%20product&body=${encodeURIComponent(
        shareUrl
      )}`,
  },
  {
    label: "Share on LinkedIn",
    icon: (
      // LinkedIn official icon
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="8" fill="#fff" />
        <g>
          <rect x="6" y="6" width="20" height="20" rx="4" fill="#0A66C2" />
          <path
            d="M13.5 13.5h2.25v1.25h.03c.31-.59 1.07-1.21 2.2-1.21 2.36 0 2.8 1.55 2.8 3.56V22h-2.25v-3.13c0-.75-.01-1.71-1.04-1.71-1.04 0-1.2.81-1.2 1.65V22H13.5v-8.5ZM11 11.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Zm1.13 1.5H8.88V22h2.25V13Zm0 0Z"
            fill="#fff"
          />
        </g>
      </svg>
    ),
    url: (shareUrl: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
  },
];

export function ProductShareSidebar({
  open,
  onClose,
  shareUrl,
  product,
}: {
  open: boolean;
  onClose: () => void;
  shareUrl: string;
  product: {
    image: string;
    title: string;
    rating: number;
    reviews: number;
    description: string;
  };
}) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open ? "visible" : "invisible pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      {/* Sidebar */}
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-sm bg-white dark:bg-slate-900 shadow-xl transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ minWidth: 320 }}
      >
        {/* Product Info */}
        <div className="px-6 pt-6 pb-2 border-b border-gray-100 dark:border-slate-700">
          <div className="flex gap-4 items-center">
            <img
              src={product.image}
              alt={product.title}
              className="w-20 h-20 object-cover rounded bg-gray-100 border border-gray-200"
            />
            <div className="flex-1 min-w-0">
              <div className="font-sukar font-bold text-lg text-gray-900 dark:text-white truncate">
                {product.title}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Icon name="star" size={18} className="text-yellow-400" />
                <Icon name="star" size={18} className="text-yellow-400" />
                <Icon name="star" size={18} className="text-yellow-400" />
                <Icon name="star" size={18} className="text-yellow-400" />
                <Icon
                  name="star"
                  size={18}
                  className="text-yellow-300 opacity-60"
                  style={{ clipPath: "inset(0 50% 0 0)" }}
                />
                <span className="ml-2 text-gray-500 text-xs font-sukar">
                  {product.reviews} Review
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-300 text-xs font-sukar mt-1 truncate">
                {product.description}
              </div>
            </div>
          </div>
        </div>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-700">
          <h3 className="text-2xl font-sukar font-bold text-gray-900 dark:text-white">
            Share with
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary-500 p-2"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 6 6 18M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-3">
          {shareOptions.map((opt, i) => (
            <a
              key={opt.label}
              href={opt.url(shareUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-slate-800 rounded transition hover:bg-primary-50 dark:hover:bg-primary-900 text-lg font-sukar font-medium text-gray-800 dark:text-white"
            >
              {opt.icon}
              {opt.label}
            </a>
          ))}
        </div>
        <button
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#8b9c98] to-[#dbe2e0] text-gray-800 font-sukar text-lg font-bold rounded-none border-t border-gray-100 dark:border-slate-700 hover:from-[#7d8c86] hover:to-[#cfd7d4] transition-all"
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
          }}
        >
          <Icon name="copy" size={22} className="text-gray-800" />
          Share Product Link
        </button>
      </aside>
    </div>
  );
}
