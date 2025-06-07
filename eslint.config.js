import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
export default defineConfig([
  {
    files: ["**/*.{ts,cts,mts}"],
    ...tseslint.configs.recommended,
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
]);