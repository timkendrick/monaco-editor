// This loader ensures that source maps from previous loaders are merged into the output source map.
// It can be removed once https://github.com/babel/babel/issues/5408 has been fixed.

const babelLoader = require('babel-loader');
const mergeSourceMap = require('merge-source-map');

module.exports = function babel(input, inputSourceMap) {
  if (this.cacheable) { this.cacheable(); }
  const childContext = Object.assign(Object.create(this), {
    callback: (error, source, outputSourceMap) => {
      this.callback(error, source, mergeSourceMap(inputSourceMap, outputSourceMap));
    },
  });
  return babelLoader.call(childContext, input);
};
