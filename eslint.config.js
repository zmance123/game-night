import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'

export default [
  ...pluginVue.configs['flat/essential'],

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  {
    languageOptions: {
      globals: { confirm: 'readonly' },
    },
    rules: {
      'no-undef': 'error',
    },
  },
]
