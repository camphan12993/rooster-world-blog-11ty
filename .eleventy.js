const terser = require('terser');
const htmlmin = require('html-minifier');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const pluginSEO = require('eleventy-plugin-seo');
const isProd = process.env.NODE_ENV == 'production';
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (config) {
  if (isProd) {
    config.addTransform('htmlmin', function (content, outputPath) {
      if (outputPath.endsWith('.html')) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
        });
        return minified;
      }

      return content;
    });
  }

  config.addPlugin(lazyImagesPlugin, {
    transformImgPath: (imgPath) => {
      if (imgPath.startsWith('/') && !imgPath.startsWith('//')) {
        return `./src${imgPath}`;
      }

      return imgPath;
    },
  });

  // minify js
  config.addFilter('jsmin', function (code) {
    let minified = terser.minify(code);
    if (minified.error) {
      console.log('Terser error: ', minified.error);
      return code;
    }

    return minified.code;
  });

  // SEO
  config.addPlugin(pluginSEO, {
    title: 'Rooster World Blog',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    url: 'https://blog.rooster-world.com',
    author: 'Cam Phan',
  });

  config.addPlugin(syntaxHighlight);

  config.addPassthroughCopy('src/assets');
  config.addPassthroughCopy('src/admin');
  return {
    dir: {
      input: 'src',
    },
    passthroughFileCopy: true,
    templateFormats: ['html', 'md', 'liquid'],
    passthroughFileCopy: true,
  };
};
