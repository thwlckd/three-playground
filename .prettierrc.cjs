module.exports = {
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  endOfLine: 'auto',
  arrowParens: 'always',
  bracketSameLine: false,
  printWidth: 120,
  trailingComma: 'all',
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports'), require.resolve('prettier-plugin-tailwindcss')],
};
