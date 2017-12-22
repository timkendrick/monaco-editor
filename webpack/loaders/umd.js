const loaderUtils = require('loader-utils');

module.exports.pitch = function pitch(remainingRequest) {
  return `module.exports = require(${loaderUtils.stringifyRequest(this, `!!${require.resolve('./wrap')}?${JSON.stringify({
    before: '(function(require, define) {',
    after: `}(${[
      'function require(id) { throw new Error("Invalid dynamic require"); }',
      'function define(id) { throw new Error("Invalid dynamic define"); })',
    ].join(', ')});`,
  })}!${remainingRequest}`)});`;
};
