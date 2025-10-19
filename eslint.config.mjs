// eslint.config.mjs

import globals from 'globals'
import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

// Cria o objeto de compatibilidade para carregar o AirBnb (formato antigo)
const compat = new FlatCompat({
  baseDirectory: import.meta.url,
})

export default [
  // 1. Bloco de Ignorar Arquivos
  {
    ignores: ['node_modules/', 'dist/', 'build/'],
  },

  // 2. Aplica o AirBnb (Qualidade de Código)
  ...compat.extends('airbnb-base'),

  // 3. Configurações Específicas para o Ambiente Node.js (Sobrescrevem o Airbnb)
  {
    files: ['**/*.{js,mjs,cjs}'],

    languageOptions: {
      globals: globals.node,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    rules: {
      // ✅ Solução para a dependência 'globals'
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

      // AJUSTES COMUNS PARA NODE/API
      'import/prefer-default-export': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',

      // Permite 'for...of' (regra do Airbnb)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is almost never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        {
          selector: 'LabeledStatement',
          message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
        },
        {
          selector: 'WithStatement',
          message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
        },
      ],
    },
  },

  // 4. Integração Prettier (DEVE SER O ÚLTIMO ELEMENTO)
  // Desliga as regras de estilo do Airbnb e habilita a formatação do Prettier.
  eslintPluginPrettierRecommended,

  // 5. Bloco de regras EXCLUSIVAS para o eslint.config.mjs (para desativar o erro de 'globals' no próprio arquivo de configuração)
  {
    files: ['eslint.config.mjs'],
    rules: {
      // Desativa a verificação de 'dependencies' no arquivo de configuração
      'import/no-extraneous-dependencies': 'off',
    },
  },
]
