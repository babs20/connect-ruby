/** @type {import("prettier").Config} */
const config = {
  arrowParens: 'always',
  printWidth: 120,
  singleQuote: true,
  jsxSingleQuote: true,
  semi: true,
  trailingComma: 'all',
  tabWidth: 2,
  quoteProps: 'consistent',
  endOfLine: 'auto',
  plugins: ['@ianvs/prettier-plugin-sort-imports'],
  importOrder: [
    '<BUILTIN_MODULES>', // Node.js built-in modules
    'react', // React
    '<THIRD_PARTY_MODULES>', // Imports not matched by other special words or groups.
    '^[.]', // relative imports
    '<TYPES>', // Imports from files in the project's src/types directory.
  ],
};

export default config;
