import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const filename = fileURLToPath(import.meta.url)
const __dirname = dirname(filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  // Add ignores for Next.js build directories
  {
    ignores: [
      '.next/**',
      'next/**',
      'out/**',
      'build/**',
      'dist/**',
      '**/next/static/**',
      '**/next/server/**',
      '**/next/cache/**',
    ],
  },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
]

export default eslintConfig
