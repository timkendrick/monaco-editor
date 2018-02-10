const path = require('path');
const webpack = require('webpack');
const escapeStringRegexp = require('escape-string-regexp');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = function createConfig(paths, { outputPath, inline, library }) {
  return {
    target: 'web',
    devtool: 'source-map',
    output: {
      path: outputPath,
      filename: 'index.js',
      libraryTarget: 'umd',
      library,
    },
    // Load main entry point using custom Monaco Editor loader
    entry: getMonacoEntryPath(paths.entry, {
      modules: paths.modules,
      workers: paths.workers,
      workerOptions: {
        inline,
        filename: paths.workers.length > 1 ? `${library}.worker.[id].js` : `${library}.worker.js`,
      },
    }),
    resolve: {
      alias: {
        // Define global module aliases for extensions etc
        ...getModuleAliases(paths.modules),
        // HACK: Prevent runtime error when importing unused "fs" module
        fs: require.resolve('./stub'),
        // HACK: Pending resolution of https://github.com/evanw/node-source-map-support/pull/198
        'source-map-support': require.resolve('source-map-support/browser-source-map-support'),
      },
      extensions: ['.ts', '.js', '.json'],
    },
    node: {
      // HACK: Disabled due to some modules assuming that a global "process" object implies Node.js
      process: false,
    },
    module: {
      rules: [
        {
          test: /\.css?$/,
          use: (inline ? [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
          ] : ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader',
          })),
        },
        {
          test: /\.(png|jpg|gif|svg|ttf|otf|eot|woff|woff2)$/,
          use: [
            {
              loader: 'url-loader',
            },
          ],
        },
        {
          test: /\.tsx?$/,
          use: [
            {
              // HACK: Use custom babel loader due to babel-loader not processing input source maps
              // https://github.com/babel/babel/issues/5408
              loader: require.resolve('./loaders/babel'),
              options: {
                presets: [
                  // Custom Babel preset to convert VS Code AMD modules to CommonJS modules
                  '@timkendrick/babel-preset-vscode',
                ],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                configFile: paths.tsconfig,
                compilerOptions: {
                  module: 'commonjs',
                  sourceMap: true,
                },
              },
            },
          ],
        },
        {
          // HACK: Wrap UMD modules with top-level require() shim to avoid runtime webpack errors
          test: paths.umd,
          use: [
            { loader: require.resolve('./loaders/umd') },
          ],
        },
      ],
    },
    plugins: [
      // Create contexts for runtime require expressions
      ...getDynamicRequireContextPlugins(paths.contexts),
      // HACK: Required for ts-loader to work correctly within webpack v4
      new webpack.LoaderOptionsPlugin({ options: {} }),
      ...(inline ? [] : [new ExtractTextPlugin(`${library}.css`)]),
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
      }),
      new ProgressBarPlugin(),
    ],
  };
};

function getModuleAliases(modules) {
  return modules
    .sort((a, b) => (
      a.name.startsWith(`${b.name}/`) || b.name.startsWith(`${a.name}/`)
        ? b.name.length - a.name.length
        : 0
    ))
    .reduce((acc, module) => Object.assign(
      acc,
      (module.main ? { [`${module.name}$`]: path.join(module.root, module.main) } : undefined),
      { [module.name]: module.root }
    ), {});
}

function getMonacoEntryPath(entry, options) {
  return `@timkendrick/monaco-editor-loader?${JSON.stringify(options)}!${entry}`;
}

function getDynamicRequireContextPlugins(contexts) {
  const includesByPath = contexts.reduce((acc, context) => Object.assign(acc, {
    [context.path]: { ...acc[context.path], ...context.includes },
  }), {});
  return Object.keys(includesByPath).map(
    (contextPath) => new webpack.ContextReplacementPlugin(
      new RegExp(escapeStringRegexp(contextPath)),
      '',
      includesByPath[contextPath]
    )
  );
}
