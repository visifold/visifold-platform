import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    files: ["**/*.{js,mjs,ts,tsx}"],
    rules: {
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  globalIgnores([
    "**/.next/**",
    "**/out/**",
    "**/dist/**",
    "**/coverage/**",
    "**/next-env.d.ts",
  ]),
]);
