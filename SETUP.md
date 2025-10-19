# Configuração Padrão de Projeto Node.js (ESLint, Airbnb & Prettier)

Este guia resume os passos para configurar rapidamente o linter (ESLint), o guia de estilo (Airbnb) e o formatador (Prettier) em novos projetos Node.js que utilizam o ES Modules (Flat Config).

## 1. Inicialização do Projeto

### Inicializa o projeto

- npm init -y

### Altera o projeto para ES Modules (necessário para o Flat Config)

#### Adicione "type": "module" ao seu package.json

- npx json -I -f package.json -e 'this.type="module"'

## 2. Instalação das Dependências

Instale todas as bibliotecas de linting, formatação e suas integrações como dependências de desenvolvimento.

```
npm install --save-dev \
  eslint@latest \
  @eslint/js \
  @eslint/eslintrc \
  globals \
  eslint-config-airbnb-base \
  eslint-plugin-import \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier

```

## 3. Configuração do Prettier (.prettierrc.json)

Crie o arquivo .prettierrc.json na raiz do projeto para definir as regras de formatação (aspas, ponto-e-vírgula, etc.).

```
// .prettierrc.json
{
"semi": false,
"trailingComma": "all",
"singleQuote": true,
"printWidth": 150,
"tabWidth": 2,
"useTabs": false,
"arrowParens": "always",
"bracketSpacing": true
}
```

## 4. Configuração do ESLint (eslint.config.mjs)

Crie o arquivo eslint.config.mjs na raiz do projeto. Esta configuração combina o guia de qualidade do Airbnb com a formatação do Prettier.

Importante: A configuração do Prettier (eslintPluginPrettierRecommended) deve ser a última na array para sobrescrever as regras de estilo conflitantes do Airbnb.

```
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
      // AJUSTES DE DEPENDÊNCIAS
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

      // [1] Regras de Airbnb Desativadas/Relaxadas (Comum em APIs)
      'class-methods-use-this': 'off',
      'no-param-reassign': 'off',
      'import/prefer-default-export': 'off', // Manteve esta

      // [2] Regra de Nomenclatura (Permite snake_case)
      camelcase: 'off',

      // [3] Regra de Variáveis Não Usadas (Ignora 'next' e '_' - Padrão para Middlewares)
      'no-unused-vars': ['error', { argsIgnorePattern: '^(next|_)$' }],

      // [4] Regra de Console (Mais restritiva que 'warn', mas permite alguns métodos)
      'no-console': ['error', { allow: ['warn', 'error', 'log'] }],

      // [5] Regra 'no-restricted-syntax' (Permite for...of, etc.)
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for..in loops iterate over the entire prototype chain, which is almost never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
        },
        { selector: 'LabeledStatement', message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.' },
        { selector: 'WithStatement', message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.' },
      ],
      // FIM DOS AJUSTES PESSOAIS
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


```

## 5. Configuração dos Scripts (package.json)

Adicione os comandos de lint no seu package.json para facilitar a execução.

```
// package.json (apenas a seção scripts)
"scripts": {
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "test": "echo \"Error: no test specified\" && exit 1"
},

```

## 6. Integração com o VS Code (Opcional, mas Recomendado)

Crie o arquivo .vscode/settings.json na raiz do projeto para configurar a formatação automática ao salvar (necessário se você usa o VS Code).

```
// .vscode/settings.json
{
  // Define o Prettier como o formatador padrão
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  // Executa o ESLint --fix e o Prettier ao salvar
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## . Teste e Correção Inicial

Execute o comando para corrigir e formatar todo o seu código base imediatamente.

npm run lint:fix

### ⚠️ Resolução de Conflitos (ERESOLVE)

A instalação pode falhar com o erro `npm ERESOLVE` devido a um conflito conhecido entre o `eslint-config-airbnb-base` e as versões mais recentes do ESLint (v9+). Este erro é não-crítico e o setup funcionará normalmente.

Para forçar a instalação e ignorar o aviso de dependência, execute o comando completo com a _flag_ `--force`:

```bash
# Comando completo para forçar a instalação de todas as dependências
npm install --save-dev --force \
  eslint@latest \
  @eslint/js \
  @eslint/eslintrc \
  globals \
  eslint-config-airbnb-base \
  eslint-plugin-import \
  prettier \
  eslint-config-prettier \
  eslint-plugin-prettier
```
