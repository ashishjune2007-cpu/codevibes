/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core Material / Semantic Tokens from Electric Glass & Precision Syntax
        "surface": "#faf8ff",
        "surface-dim": "#d4d9ef",
        "surface-bright": "#faf8ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#eaedff",
        "surface-container-high": "#e2e7fd",
        "surface-container-highest": "#dde2f8",
        "surface-variant": "#dde2f8",
        "surface-tint": "#0058ca",
        "on-surface": "#151b2b",
        "on-surface-variant": "#424655",
        "inverse-surface": "#2a3040",
        "inverse-on-surface": "#eef0ff",
        "background": "#faf8ff",
        "on-background": "#151b2b",
        "outline": "#727786",
        "outline-variant": "#c2c6d7",

        "primary": "#0056c5",
        "on-primary": "#ffffff",
        "primary-container": "#0f6df3",
        "on-primary-container": "#fefcff",
        "inverse-primary": "#b0c6ff",
        "primary-fixed": "#d9e2ff",
        "primary-fixed-dim": "#b0c6ff",
        "on-primary-fixed": "#001945",
        "on-primary-fixed-variant": "#00429b",

        "secondary": "#006875",
        "on-secondary": "#ffffff",
        "secondary-container": "#00e3fd",
        "on-secondary-container": "#00616d",
        "secondary-fixed": "#9cf0ff",
        "secondary-fixed-dim": "#00daf3",
        "on-secondary-fixed": "#001f24",
        "on-secondary-fixed-variant": "#004f58",

        "tertiary": "#9700c6",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#b72ae9",
        "on-tertiary-container": "#fffbff",
        "tertiary-fixed": "#fad7ff",
        "tertiary-fixed-dim": "#eeb0ff",
        "on-tertiary-fixed": "#330045",
        "on-tertiary-fixed-variant": "#76009b",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        // Translucent Glass Surfaces
        "glass-subtle": "rgba(255, 255, 255, 0.70)",
        "glass-base": "rgba(255, 255, 255, 0.80)",
        "glass-elevated": "rgba(255, 255, 255, 0.90)",
        "glass-modal": "rgba(255, 255, 255, 0.92)",

        // Specular & Structural Glass Strokes
        "glass-border-specular": "rgba(255, 255, 255, 0.60)",
        "glass-border-ambient": "rgba(255, 255, 255, 0.20)",
        "glass-border-structural": "rgba(194, 198, 215, 0.35)",

        // Radiant Spectrum Colors
        "vivid-cobalt": "#2979FF",
        "electric-cyan": "#00E5FF",
        "electric-violet": "#B324E5",
        "ambient-gradient-cyan": "#00E5FF",
        "ambient-gradient-cobalt": "#2979FF",
        "ambient-gradient-violet": "#B324E5",
        "neutral-slate": "#0B1120",

        // Glow Tokens
        "glow-cyan": "rgba(0, 229, 255, 0.40)",
        "glow-cobalt": "rgba(41, 121, 255, 0.35)",
        "glow-violet": "rgba(179, 36, 229, 0.30)",

        // Compatibility Aliases
        "text-primary": "#151b2b",
        "text-secondary": "#424655",
        "text-muted": "#727786",
        "canvas-base": "#faf8ff",
        "canvas-subtle": "#f2f3ff",
        "surface-border": "rgba(194, 198, 215, 0.35)"
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px"
      },
      spacing: {
        gutter: "1.5rem",
        "gutter-sm": "1rem",
        margin: "2rem",
        "margin-mobile": "1rem",
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem"
      },
      boxShadow: {
        "card-default": "0 10px 30px -10px rgba(11, 17, 32, 0.05), 0 1px 3px 0 rgba(11, 17, 32, 0.02)",
        "glow-cobalt": "0 14px 32px -4px rgba(41, 121, 255, 0.22), 0 2px 8px -2px rgba(41, 121, 255, 0.12)",
        "glow-cyan": "0 12px 28px -4px rgba(0, 229, 255, 0.28), 0 0 12px 0 rgba(0, 229, 255, 0.15)",
        "glow-violet": "0 12px 28px -4px rgba(179, 36, 229, 0.25), 0 0 10px 0 rgba(179, 36, 229, 0.12)",
        "btn-glow": "0 6px 20px rgba(41, 121, 255, 0.35)"
      },
      backdropBlur: {
        "tier-1": "12px",
        "tier-2": "16px",
        "tier-3": "24px",
        "tier-4": "40px"
      },
      fontFamily: {
        "display-hero": ["Space Grotesk", "sans-serif"],
        "display-hero-mobile": ["Space Grotesk", "sans-serif"],
        "headline-xl": ["Space Grotesk", "sans-serif"],
        "headline-xl-mobile": ["Space Grotesk", "sans-serif"],
        "headline-lg": ["Space Grotesk", "sans-serif"],
        "headline-md": ["Space Grotesk", "sans-serif"],
        "headline-sm": ["Space Grotesk", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "mono-lg": ["JetBrains Mono", "monospace"],
        "mono-sm": ["JetBrains Mono", "monospace"],
        "label-ui": ["Inter", "sans-serif"]
      },
      fontSize: {
        "display-hero": ["56px", { lineHeight: "64px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-hero-mobile": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-xl": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-xl-mobile": ["28px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-lg": ["32px", { lineHeight: "40px", letterSpacing: "-0.02em", fontWeight: "600" }],
        "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "26px", letterSpacing: "0em", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "400" }],
        "body-md": ["15px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "400" }],
        "mono-lg": ["14px", { lineHeight: "22px", letterSpacing: "-0.01em", fontWeight: "500" }],
        "mono-sm": ["12px", { lineHeight: "16px", letterSpacing: "0.02em", fontWeight: "500" }],
        "label-ui": ["13px", { lineHeight: "16px", letterSpacing: "0.01em", fontWeight: "600" }]
      }
    },
  },
  plugins: [],
}
