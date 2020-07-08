module.exports = function (config) {
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
