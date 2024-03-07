/** @type {import('prettier').Config} */
const config = {
  arrowParens: "always",
  singleQuote: false,
  jsxSingleQuote: false,
  semi: false,
  trailingComma: "all",
  plugins: ["prettier-plugin-organize-imports"],
}

module.exports = config
