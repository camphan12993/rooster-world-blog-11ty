const terser = require('terser');
const htmlmin = require('html-minifier');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function (config) {
  if (process.env.NODE_ENV == 'production') {
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

  config.addPassthroughCopy('src/assets/css');
  return {
    dir: {
      input: 'src',
    },
    passthroughFileCopy: true,
    templateFormats: ['html', 'md', 'liquid'],
    passthroughFileCopy: true,
  };
};
