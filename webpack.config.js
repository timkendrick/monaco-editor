const fs = require('fs');
const path = require('path');

const MONACO_CORE_PATH = getModulePath('monaco-editor-core/dev');

function getModulePath(modulePath) {
  const [, packageName, innerPath] = /^(@[^/]+\/[^/]+|[^/]+)(?:\/(.*))?$/.exec(modulePath);
  return path.join(path.dirname(require.resolve(`${packageName}/package.json`)), innerPath || '');
}

const getMonacoCorePath = path.join.bind(path, MONACO_CORE_PATH);

module.exports = {
  target: 'web',
  entry: getMonacoCorePath('vs/editor/editor.main.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'monaco',
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        include: getMonacoCorePath('vs/editor/editor.main.js'),
        use: [
          {
            loader: 'source-map-loader',
          },
          {
            loader: '@timkendrick/monaco-editor-loader',
            options: {
              assets: {
                'vs/editor/editor.main.css': {
                  type: 'css',
                  path: getMonacoCorePath('vs/editor/editor.main.css'),
                },
                'vs/base/worker/workerMain.js': {
                  type: 'worker',
                  path: getMonacoCorePath('vs/base/worker/workerMain.js'),
                  config: {
                    scripts: {
                      'vs/language/typescript/src/worker.js': getModulePath('monaco-typescript/release/src/worker.js'),
                      'vs/language/typescript/lib/typescriptServices.js': getModulePath('monaco-typescript/release/lib/typescriptServices.js'),
                    },
                  },
                },
              },
              extensions: [
                getMonacoCorePath('vs/editor/editor.main.nls'),
                ...findModulesInPath(getModulePath('monaco-css/release/min')),
                ...findModulesInPath(getModulePath('monaco-html/release/min')),
                ...findModulesInPath(getModulePath('monaco-json/release/min')),
                ...findModulesInPath(getModulePath('monaco-languages/release/src')),
                ...findModulesInPath(getModulePath('monaco-typescript/release')),
              ],
            },
          },
        ],
      },
    ],
  },
};

function findModulesInPath(dirPath) {
  return fs.readdirSync(dirPath).reduce((modules, filename) => {
    if (fs.statSync(path.join(dirPath, filename)).isDirectory()) {
      return [...modules, ...findModulesInPath(path.join(dirPath, filename))];
    } else if (filename.endsWith('.js')) {
      return [...modules, path.join(dirPath, path.basename(filename, path.extname(filename)))];
    } else {
      return modules;
    }
  }, []);
}
