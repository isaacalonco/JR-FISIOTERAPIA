import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          dark: "#000A1B",       // Azul-marinho
          deep: "#010F25",       // Azul profundo
          secondary: "#011733",  // Azul secundário
        },
        gold: {
          dark: "#C1801F",       // Dourado escuro
          primary: "#E5A838",    // Dourado principal
          light: "#F5CD67",      // Dourado claro
        },
        brand: {
          offwhite: "#E3DCBE",   // Off-white
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "#E5A838",
          foreground: "#000A1B",
        },
        secondary: {
          DEFAULT: "#011733",
          foreground: "#E3DCBE",
        },
        accent: {
          DEFAULT: "#F5CD67",
          foreground: "#000A1B",
        },
        muted: {
          DEFAULT: "#011733",
          foreground: "#E3DCBE",
        },
        border: "#011733",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        gold: "0 4px 20px -2px rgba(229, 168, 56, 0.25)",
        "gold-glow": "0 0 25px rgba(245, 205, 103, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
