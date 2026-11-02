import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

const config = [
  {
    ignores: ['.next/**', 'node_modules/**', 'Exported/**', '.migration/**', 'next-env.d.ts'],
  },
  // Type safety is enforced by `npm run typecheck`; ESLint covers the React and
  // Next.js correctness rules that tsc cannot see.
  ...compat.extends('next/core-web-vitals'),
];

export default config;
