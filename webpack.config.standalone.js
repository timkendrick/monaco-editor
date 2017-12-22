const path = require('path');

const createConfig = require('./webpack/createConfig');
const paths = require('./paths');

module.exports = createConfig(paths, {
  outputPath: path.join(__dirname, 'dist', 'standalone'),
  library: 'monaco',
  inline: true,
});
