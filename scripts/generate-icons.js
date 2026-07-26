import fs from 'fs';
import path from 'path';

// Ensure public and public/icons directories exist
const publicDir = path.join(process.cwd(), 'public');
const iconsDir = path.join(publicDir, 'icons');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate high quality SVG EduMentor Icon
const getSvgIcon = (size = 512, isMaskable = false) => {
  const padding = isMaskable ? Math.round(size * 0.15) : Math.round(size * 0.05);
  const innerSize = size - padding * 2;
  const radius = isMaskable ? 0 : Math.round(size * 0.22);

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2563EB" />
      <stop offset="50%" stop-color="#1D4ED8" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#60A5FA" />
      <stop offset="100%" stop-color="#2563EB" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBBF24" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" fill="url(#bgGrad)" />
  
  <!-- Subtle Outer Ring Glow -->
  <circle cx="${size/2}" cy="${size/2}" r="${innerSize * 0.44}" fill="none" stroke="#FFFFFF" stroke-opacity="0.1" stroke-width="${size * 0.02}" />

  <!-- Main Symbol Group -->
  <g transform="translate(${padding}, ${padding}) scale(${innerSize / 100})">
    <!-- Outer Shield / Book Base -->
    <path d="M20 22 C20 18, 24 16, 30 16 H75 C80 16, 84 20, 84 25 V75 C84 80, 80 84, 75 84 H30 C24 84, 20 82, 20 78 Z" fill="#FFFFFF" opacity="0.12" />

    <!-- Stylized 'E' + Book Pages -->
    <path d="M22 24 C22 20, 26 18, 32 18 L76 18 C80 18, 82 21, 82 24 V34 C82 37, 80 39, 76 39 L42 39 C38 39, 36 41, 36 45 V47 C36 51, 38 53, 42 53 L70 53 C74 53, 76 55, 76 58 V66 C76 69, 74 71, 70 71 L42 71 C38 71, 36 73, 36 77 V78 C36 81, 34 83, 30 83 C25 83, 22 80, 22 75 Z" fill="#FFFFFF" filter="url(#shadow)" />

    <!-- Knowledge Progression Accent Line -->
    <path d="M44 47 H78 C81 47, 83 49, 83 52 C83 55, 81 57, 78 57 H44 C41 57, 39 55, 39 52 C39 49, 41 47, 44 47 Z" fill="url(#emeraldGrad)" />

    <!-- AI Spark Star (Excellence & Gemini AI) -->
    <path d="M75 12 C75 22, 85 22, 85 22 C85 22, 75 22, 75 32 C75 22, 65 22, 65 22 C65 22, 75 22, 75 12 Z" fill="url(#goldGrad)" />

    <!-- Secondary Spark -->
    <path d="M32 26 C32 30, 36 30, 36 30 C36 30, 32 30, 32 34 C32 30, 28 30, 28 30 C28 30, 32 30, 32 26 Z" fill="#FFFFFF" opacity="0.9" />
  </g>
</svg>`;
};

// Generate SVG Favicon
const faviconSvg = getSvgIcon(64, false);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg, 'utf-8');
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), faviconSvg, 'utf-8');

// Generate all standard icon size SVGs
const iconSizes = [48, 72, 96, 144, 192, 512];

iconSizes.forEach((size) => {
  const svg = getSvgIcon(size, false);
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg, 'utf-8');
  // Also save png-compatible svg names for fallback
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.png`), svg, 'utf-8');
});

// Maskable icons
const maskable192 = getSvgIcon(192, true);
const maskable512 = getSvgIcon(512, true);
fs.writeFileSync(path.join(iconsDir, 'maskable-icon-192x192.svg'), maskable192, 'utf-8');
fs.writeFileSync(path.join(iconsDir, 'maskable-icon-192x192.png'), maskable192, 'utf-8');
fs.writeFileSync(path.join(iconsDir, 'maskable-icon-512x512.svg'), maskable512, 'utf-8');
fs.writeFileSync(path.join(iconsDir, 'maskable-icon-512x512.png'), maskable512, 'utf-8');

// Apple touch icon
const appleTouchSvg = getSvgIcon(180, false);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), appleTouchSvg, 'utf-8');
fs.writeFileSync(path.join(iconsDir, 'apple-touch-icon.png'), appleTouchSvg, 'utf-8');

console.log('✅ EduMentor official icons successfully generated in /public/ and /public/icons/!');
