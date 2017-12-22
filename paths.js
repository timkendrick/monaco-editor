const fs = require('fs');
const path = require('path');

function getSubmodulePath(filePath) {
  return path.join(__dirname, 'submodules', filePath);
}

module.exports = {
  tsconfig: getSubmodulePath('vscode/src/tsconfig.json'),
  entry: getSubmodulePath('vscode/src/vs/editor/editor.main.ts'),
  modules: [
    {
      name: 'vs',
      root: getSubmodulePath('vscode/src/vs'),
    },
    {
      name: 'vs/basic-languages',
      root: getSubmodulePath('monaco-languages/src'),
      main: 'monaco.contribution.ts',
      include: true,
    },
    {
      name: 'vs/language/css',
      root: getSubmodulePath('monaco-css/src'),
      main: 'monaco.contribution.ts',
      include: true,
    },
    {
      name: 'vs/language/html',
      root: getSubmodulePath('monaco-html/src'),
      main: 'monaco.contribution.ts',
      include: true,
    },
    {
      name: 'vs/language/json',
      root: getSubmodulePath('monaco-json/src'),
      main: 'monaco.contribution.ts',
      include: true,
    },
    {
      name: 'vs/language/typescript/src',
      root: getSubmodulePath('monaco-typescript/src'),
      main: 'monaco.contribution.ts',
      include: true,
    },
    {
      name: 'vscode-css-languageservice',
      root: getSubmodulePath('vscode-css-languageservice/src'),
      main: 'cssLanguageService.ts',
    },
    {
      name: 'vscode-html-languageservice',
      root: getSubmodulePath('vscode-html-languageservice/src'),
      main: 'htmlLanguageService.ts',
    },
    {
      name: 'vscode-json-languageservice',
      root: getSubmodulePath('vscode-json-languageservice/src'),
      main: 'jsonLanguageService.ts',
    },
    {
      name: 'vscode-languageserver-types',
      root: getSubmodulePath('vscode-languageserver-node/types/src'),
      main: 'main.ts',
    },
    {
      name: 'vscode-nls',
      root: getSubmodulePath('vscode-nls/src'),
      main: 'main.ts',
    },
    {
      name: 'vscode-uri',
      root: getSubmodulePath('vscode-uri/lib'),
      main: 'index.ts',
    },
    {
      name: 'jsonc-parser',
      root: getSubmodulePath('jsonc-parser/src'),
      main: 'main.ts',
    },
  ],
  workers: [
    {
      name: 'workerMain.js',
      main: getSubmodulePath('vscode/src/vs/base/worker/workerMain.ts'),
      includes: [
        getSubmodulePath('vscode/src/vs/editor/common/services/editorSimpleWorker.ts'),
      ],
    },
  ],
  contexts: [
    {
      path: path.dirname(getSubmodulePath('vscode/src/vs/base/worker/workerMain.ts')),
      includes: {
        'vs/base/common/worker/simpleWorker': getSubmodulePath('vscode/src/vs/base/common/worker/simpleWorker.ts'),
      },
    },
    {
      path: path.dirname(getSubmodulePath('vscode/src/vs/base/common/worker/simpleWorker.ts')),
      includes: {
        'vs/editor/common/services/editorSimpleWorker': getSubmodulePath('vscode/src/vs/editor/common/services/editorSimpleWorker.ts'),
      },
    },
    {
      path: path.dirname(getSubmodulePath('vscode/src/vs/editor/common/services/editorSimpleWorker.ts')),
      includes: {
        'vs/language/css/cssWorker': getSubmodulePath('monaco-css/src/cssWorker.ts'),
        'vs/language/html/htmlWorker': getSubmodulePath('monaco-html/src/htmlWorker.ts'),
        'vs/language/json/jsonWorker': getSubmodulePath('monaco-json/src/jsonWorker.ts'),
        'vs/language/typescript/src/worker': getSubmodulePath('monaco-typescript/src/worker.ts'),
      },
    },
    {
      path: path.dirname(getSubmodulePath('monaco-languages/src/monaco.contribution.ts')),
      includes: (
        fs.readdirSync(getSubmodulePath('monaco-languages/src')).reduce(
          (acc, filename) => Object.assign(acc, {
            [`./${path.basename(filename, path.extname(filename))}`]:
            path.join(getSubmodulePath('monaco-languages/src'), filename),
          }),
          {}
        )
      ),
    },
  ],
  umd: [
    getSubmodulePath('vscode-css-languageservice/src/data/browsers.js'),
  ],
};

