import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Allow `any` in tRPC context, queue payloads, and AI goal mapping
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow natural language apostrophes and quotes in JSX text
      "react/no-unescaped-entities": "off",
      // Downgrade unused-vars to warnings (scaffold code for future impl)
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      // Allow <img> where Next.js Image isn't needed (external avatars, SVG)
      "@next/next/no-img-element": "warn",
    },
  },
]);

export default eslintConfig;

