import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#c7d2fe",
            "--tw-prose-headings": "#e0e7ff",
            "--tw-prose-links": "#818cf8",
            "--tw-prose-bold": "#e0e7ff",
            "--tw-prose-code": "#c7d2fe",
            "--tw-prose-pre-bg": "#1e1b4b",
            "--tw-prose-pre-code": "#c7d2fe",
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
