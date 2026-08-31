import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", lg: "3rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        base: "hsl(var(--bg-base) / <alpha-value>)",
        elevated: "hsl(var(--bg-elevated) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        ink: {
          DEFAULT: "hsl(var(--ink) / <alpha-value>)",
          muted: "hsl(var(--ink-muted) / <alpha-value>)",
          subtle: "hsl(var(--ink-subtle) / <alpha-value>)",
        },
        gold: {
          highlight: "hsl(var(--gold-highlight) / <alpha-value>)",
          warm: "hsl(var(--gold-warm) / <alpha-value>)",
          DEFAULT: "hsl(var(--gold-primary) / <alpha-value>)",
          deep: "hsl(var(--gold-deep) / <alpha-value>)",
        },
        hairline: "hsl(var(--hairline) / <alpha-value>)",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "Times New Roman", "serif"],
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "display-2xl": ["clamp(3.5rem, 8vw, 6.5rem)", { lineHeight: "1", letterSpacing: "-0.03em" }],
        "display-xl": ["clamp(2.5rem, 5vw, 4rem)", { lineHeight: "1.05", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(2rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
      },
      letterSpacing: { widest: "0.24em" },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, hsl(var(--gold-highlight)) 0%, hsl(var(--gold-primary)) 50%, hsl(var(--gold-deep)) 100%)",
        "gold-text": "linear-gradient(180deg, hsl(var(--gold-highlight)) 0%, hsl(var(--gold-primary)) 55%, hsl(var(--gold-deep)) 100%)",
        "radial-glow": "radial-gradient(ellipse at center, hsl(var(--gold-primary) / 0.08) 0%, transparent 60%)",
      },
      animation: {
        "fade-up": "fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 500ms ease-out forwards",
        shimmer: "shimmer 3s linear infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
