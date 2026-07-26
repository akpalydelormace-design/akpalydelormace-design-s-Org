import React from "react";

interface EduMentorLogoProps {
  variant?: "full" | "horizontal" | "square" | "monochrome" | "icon-only";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  theme?: "light" | "dark" | "auto";
  className?: string;
  showTagline?: boolean;
}

export default function EduMentorLogo({
  variant = "full",
  size = "md",
  theme = "auto",
  className = "",
  showTagline = false,
}: EduMentorLogoProps) {
  // Dimension mappings for logo icon
  const sizeMap = {
    xs: { icon: "h-6 w-6", text: "text-base", tagline: "text-[9px]" },
    sm: { icon: "h-8 w-8", text: "text-lg", tagline: "text-[10px]" },
    md: { icon: "h-10 w-10", text: "text-xl", tagline: "text-[11px]" },
    lg: { icon: "h-12 w-12", text: "text-2xl", tagline: "text-xs" },
    xl: { icon: "h-16 w-16", text: "text-3xl", tagline: "text-sm" },
    "2xl": { icon: "h-24 w-24", text: "text-5xl", tagline: "text-base" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const isMonochrome = variant === "monochrome";

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* SYMBOL / ICON MARK */}
      <div className="relative group flex-shrink-0">
        {/* Glow effect in full/auto color mode */}
        {!isMonochrome && (
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-400 rounded-2xl blur-sm opacity-30 group-hover:opacity-60 transition duration-300"></div>
        )}

        <div
          className={`relative ${currentSize.icon} rounded-xl md:rounded-2xl flex items-center justify-center p-1.5 transition-transform duration-200 group-hover:scale-[1.03] ${
            isMonochrome
              ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
              : "bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-800 text-white shadow-md shadow-blue-500/20"
          }`}
        >
          {/* Custom SVG Symbol: EduMentor Emblem (Book + Letter E + AI Spark Star) */}
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient
                id="em-grad-primary"
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#2563EB" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
              <linearGradient
                id="em-grad-gold"
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
              <linearGradient
                id="em-grad-emerald"
                x1="0"
                y1="0"
                x2="100"
                y2="100"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#34D399" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>

            {/* Base Shield / Book Spine outline */}
            <path
              d="M20 22 C20 18, 24 16, 30 16 H75 C80 16, 84 20, 84 25 V75 C84 80, 80 84, 75 84 H30 C24 84, 20 82, 20 78 Z"
              fill={isMonochrome ? "currentColor" : "url(#em-grad-primary)"}
              opacity="0.15"
            />

            {/* Stylized 'E' + Book Pages Layer 1 */}
            <path
              d="M22 24 C22 20, 26 18, 32 18 L76 18 C80 18, 82 21, 82 24 V34 C82 37, 80 39, 76 39 L42 39 C38 39, 36 41, 36 45 V47 C36 51, 38 53, 42 53 L70 53 C74 53, 76 55, 76 58 V66 C76 69, 74 71, 70 71 L42 71 C38 71, 36 73, 36 77 V78 C36 81, 34 83, 30 83 C25 83, 22 80, 22 75 Z"
              fill={isMonochrome ? "currentColor" : "url(#em-grad-primary)"}
            />

            {/* Middle Page Accent Bar (Knowledge Progression) */}
            <path
              d="M44 47 H78 C81 47, 83 49, 83 52 C83 55, 81 57, 78 57 H44 C41 57, 39 55, 39 52 C39 49, 41 47, 44 47 Z"
              fill={isMonochrome ? "currentColor" : "url(#em-grad-emerald)"}
            />

            {/* Top Right AI Spark Star (Gemini Intelligence & Excellence) */}
            <path
              d="M75 12 C75 22, 85 22, 85 22 C85 22, 75 22, 75 32 C75 22, 65 22, 65 22 C65 22, 75 22, 75 12 Z"
              fill={isMonochrome ? "currentColor" : "url(#em-grad-gold)"}
            />

            {/* Small Spark Accent */}
            <path
              d="M32 26 C32 30, 36 30, 36 30 C36 30, 32 30, 32 34 C32 30, 28 30, 28 30 C28 30, 32 30, 32 26 Z"
              fill={isMonochrome ? "currentColor" : "#FFFFFF"}
              opacity="0.9"
            />
          </svg>
        </div>
      </div>

      {/* TEXT BRANDING (If not icon-only or square) */}
      {variant !== "icon-only" && variant !== "square" && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5 leading-none">
            <span
              className={`font-black font-heading tracking-tight ${currentSize.text} ${
                theme === "dark"
                  ? "text-white"
                  : theme === "light"
                  ? "text-slate-900"
                  : "text-slate-900 dark:text-white"
              }`}
            >
              Edu<span className="text-blue-600 dark:text-blue-400">Mentor</span>
            </span>

            {/* AI Chip Badge */}
            {!isMonochrome && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60">
                <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                IA
              </span>
            )}
          </div>

          {(showTagline || variant === "full") && (
            <span
              className={`font-semibold tracking-wider uppercase mt-1 ${currentSize.tagline} ${
                theme === "dark"
                  ? "text-slate-400"
                  : theme === "light"
                  ? "text-slate-500"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              L'Excellence Scolaire Intelligente
            </span>
          )}
        </div>
      )}
    </div>
  );
}
