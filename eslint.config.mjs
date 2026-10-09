import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: [".next/**", "coverage/**", "node_modules/**", "prototype/**", "diagrams/**", "experiments/**", "evidence/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["src/**/*.{ts,tsx}", "tests/**/*.ts", "*.{ts,mts}"],
    rules: { "no-undef": "off" },
  },
);
