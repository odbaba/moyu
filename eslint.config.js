import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'
import importPlugin from 'eslint-plugin-import'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'unused-imports': unusedImports,
      'import': importPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // ==================== 未使用代码检测 ====================
      // 未使用的导入 - 自动删除
      'unused-imports/no-unused-imports': 'error',
      
      // 未使用的变量 - 警告（TypeScript 编译器已处理）
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      
      // 未使用的表达式
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': ['error', {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }],

      // ==================== 导入排序和规范 ====================
      // 自动排序导入
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      
      // 禁止重复导入
      'import/no-duplicates': 'error',
      
      // 导入顺序（已由 simple-import-sort 处理）
      'import/order': 'off',

      // ==================== 代码质量 ====================
      // 禁止 console（警告）
      'no-console': 'warn',
      
      // 禁止 debugger
      'no-debugger': 'error',
      
      // 禁止空块语句（允许 catch 空块）
      'no-empty': ['error', { allowEmptyCatch: true }],
      
      // 禁止不必要的布尔转换
      'no-extra-boolean-cast': 'error',
      
      // 禁止不必要的分号
      'no-extra-semi': 'error',
      
      // 禁止多行空行（最多2行）
      'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
      
      // 禁止在 return 之前有空行
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],

      // ==================== TypeScript 规则 ====================
      // 禁止显式 any（警告）
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // 要求函数返回类型（可选）
      '@typescript-eslint/explicit-function-return-type': 'off',
      
      // 要求模块边界处有显式类型
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // 禁止非空断言（警告）
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // 要求使用 === 和 !==
      '@typescript-eslint/strict-boolean-expressions': 'off',
      
      // 优先使用 interface 定义对象类型
      '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      
      // 优先使用 import type
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

      // ==================== React 规则 ====================
    
      // ==================== 最佳实践 ====================
      // 禁止 var
      'no-var': 'error',
      
      // 优先使用箭头函数作为回调
      'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
      
      // 优先使用模板字面量
      'prefer-template': 'error',
      
      // 禁止字符串字面量中使用不必要的转义字符
      'no-useless-escape': 'error',
      
      // 要求使用 isNaN() 检查 NaN
      'use-isnan': 'error',
      
      // 禁止 case 语句落空
      'no-fallthrough': 'error',
      
      // 禁止在 switch/case 中使用词法声明
      'no-case-declarations': 'error',

      // ==================== 代码风格 ====================
      // 禁止使用多个空格
      'no-multi-spaces': 'error',
      
      // 禁止行尾空格
      'no-trailing-spaces': 'error',
      
      // 强制使用单引号
      'quotes': ['error', 'single', { avoidEscape: true }],
      
      // 强制使用分号
      'semi': ['error', 'always'],
      
      // 强制使用一致的缩进（2空格）
      'indent': ['error', 2, { SwitchCase: 1 }],
      
      // 强制在对象字面量属性中键和值之间使用一致的空格
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      
      // 强制在关键字前后使用一致的空格
      'keyword-spacing': ['error', { before: true, after: true }],
      
      // 强制在逗号前后使用一致的空格
      'comma-spacing': ['error', { before: false, after: true }],
      
      // 强制在括号内使用一致的空格
      'space-in-parens': ['error', 'never'],
      
      // 强制在箭头函数的箭头前后使用一致的空格
      'arrow-spacing': ['error', { before: true, after: true }],
      
      // 强制在注释前有空白
      'spaced-comment': ['error', 'always'],
    },
  },
])
