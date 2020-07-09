const purgecss = require('@fullhuman/postcss-purgecss')({
  // Specify the paths to all of the template files in your project
  content: ['./src/**/*.liquid', './src/**/*.md'],
  whitelist: ['active', 'pre', 'code', 'token'],
  whitelistPatterns: [/h[1-6]/],
  // Include any special characters you're using in this regular expression
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
});
const cssnano = require('cssnano')({
  preset: 'default',
  discardComments: { removeAll: true },
});

module.exports = {
  plugins: [
    // ...
    require('postcss-import'),
    require('tailwindcss'),
    require('autoprefixer'),
    ...(process.env.NODE_ENV == 'production' ? [purgecss, cssnano] : []),
    // ...
  ],
};
