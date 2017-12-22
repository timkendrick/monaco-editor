# @timkendrick/monaco-editor
[![npm version](https://img.shields.io/npm/v/@timkendrick/monaco-editor.svg)](https://www.npmjs.com/package/@timkendrick/monaco-editor)
![Stability](https://img.shields.io/badge/stability-experimental-yellow.svg)

> CommonJS/Webpack compatible Monaco editor

This module exports a prebuilt UMD bundle that exposes a standalone [Monaco editor](https://microsoft.github.io/monaco-editor/).

## Installation

```bash
npm install @timkendrick/monaco-editor --save
```

## Usage

The editor comes in two versions: standalone and external.

In the standalone version, the accompanying CSS and web worker scripts are all compiled into the main JavaScript bundle, avoiding the need to serve external assets separately.

In the external version, the accompanying CSS and web worker scripts are provided as separate assets that must be served separately.

### Importing the standalone version

As a CommonJS module:

```js
const monaco = require('@timkendrick/monaco-editor');

monaco.editor.create(...);
```

As an ECMAScript module:

```js
import * as monaco from '@timkendrick/monaco-editor';

monaco.editor.create(...);
```

As a global variable:

```js
window.monaco.editor.create(...);
```

### Using the external version

#### Setup

Additional CSS and worker scripts are located in the `dist/external` directory. These must be loaded by the browser at runtime.

The `monaco.css` file must be loaded as a stylesheet, and the path to directory containing the worker scripts can be specified as `window.MonacoEnvironment.baseUrl`:

```html
<html>
  <head>
    <link rel="stylesheet" href="node_modules/@timkendrick/monaco-editor/dist/external/monaco.css" />
  </head>
  <body>
    <script>
      window.MonacoEnvironment = {
        baseUrl: 'node_modules/@timkendrick/monaco-editor/dist/external',
      };
    </script>
    <script src="index.js"></script>
  </body>
</html>
```

#### Importing the external version

As a CommonJS module:

```js
const monaco = require('@timkendrick/monaco-editor/dist/external');

monaco.editor.create(...);
```

As an ECMAScript module:

```js
import * as monaco from '@timkendrick/monaco-editor/dist/external';

monaco.editor.create(...);
```

As a global variable:

```js
window.monaco.editor.create(...);
```

## Editor API

For full usage instructions, see the [Monaco API Docs](https://microsoft.github.io/monaco-editor/api/index.html).

## Configuration

The editor configuration is based on the AMD version in the [Microsoft/monaco-editor](https://github.com/Microsoft/monaco-editor) repository.

To generate custom builds, see the [@timkendrick/monaco-editor-loader](https://www.npmjs.com/package/@timkendrick/monaco-editor-loader) Webpack loader.

## Building from source

```bash
git clone https://github.com/timkendrick/monaco-editor.git
git submodule update --init
npm install

npm run build
```
