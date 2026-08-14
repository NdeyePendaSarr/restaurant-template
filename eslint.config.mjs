import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Contenu en français : les apostrophes typographiques sont partout,
      // les échapper en &apos; nuit à la lisibilité du code sans rien apporter.
      "react/no-unescaped-entities": "off",
      // Patterns volontaires et corrects : révélation au scroll et fermeture du
      // menu au changement de route synchronisent l'état APRÈS le montage
      // (rendu SSR cohérent, pas de cascade réelle).
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
