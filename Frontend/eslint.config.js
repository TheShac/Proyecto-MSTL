import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Patrones legítimos de "sincronizar estado desde props / reset al
      // abrir/cerrar". Regla advisory desactivada para este proyecto.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
  {
    // Los contextos exportan un hook (useX) junto al Provider: patrón estándar
    // de React. La regla de fast-refresh no aplica aquí.
    files: ['**/stores/*.jsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
