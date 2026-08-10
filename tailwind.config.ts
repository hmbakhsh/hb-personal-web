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
        sans: ["var(--font-geist)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "var(--grey-1)",
            "--tw-prose-headings": "var(--ink)",
            "--tw-prose-links": "var(--ink)",
            "--tw-prose-bold": "var(--ink)",
            "--tw-prose-code": "var(--ink)",
            "--tw-prose-quotes": "var(--grey-1)",
            "--tw-prose-hr": "var(--line)",
            "--tw-prose-th-borders": "var(--line)",
            "--tw-prose-td-borders": "var(--line)",
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
