const loaderUtils = require('loader-utils');
const { default: LinesAndColumns } = require('lines-and-columns');
const { SourceMapConsumer, SourceMapGenerator } = require('source-map');

module.exports = function wrap(source, sourceMap) {
  const { before = '', after = '' } = loaderUtils.getOptions(this) || {};
  if (!before && !after) { return this.callback(null, source, sourceMap); }
  const output = `${before || ''}${source}${after || ''}`;
  if (!this.sourceMap) { return output; }
  const map = createSourceMap(this.resourcePath, source);
  const getSourceLocation = getLinePositionFinder(source);
  const getOutputLocation = getLinePositionFinder(output);
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < output.length; i++) {
    map.addMapping({
      source: this.resourcePath,
      original: getSourceLocation(Math.max(0, Math.min(source.length, i - before.length))),
      generated: getOutputLocation(i),
    });
  }
  if (sourceMap) { map.applySourceMap(parseSourceMap(sourceMap)); }
  this.callback(null, output, JSON.parse(map.toString()));
};

function getLinePositionFinder(string) {
  const positionFinder = new LinesAndColumns(string);
  return (index) => {
    const location = positionFinder.locationForIndex(index);
    return { line: location.line + 1, column: location.column };
  };
}

function createSourceMap(filePath, source) {
  const map = new SourceMapGenerator({ file: filePath });
  map.setSourceContent(filePath, source);
  return map;
}

function parseSourceMap(sourceMap) {
  return new SourceMapConsumer(typeof sourceMap === 'string' ? JSON.parse(sourceMap) : sourceMap);
}
