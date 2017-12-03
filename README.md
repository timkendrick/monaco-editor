# @timkendrick/monaco-editor
[![npm version](https://img.shields.io/npm/v/@timkendrick/monaco-editor.svg)](https://www.npmjs.com/package/@timkendrick/monaco-editor)
![Stability](https://img.shields.io/badge/stability-experimental-yellow.svg)

> CommonJS/Webpack compatible Monaco editor

This module exports a prebuilt UMD bundle that exposes a standalone [Monaco editor](https://microsoft.github.io/monaco-editor/).

# Installation

```bash
npm install @timkendrick/monaco-editor --save
```

# Usage

As a CommonJS module:

```js
const monaco = require('@timkendrick/monaco-editor');

monaco.editor.create(...);
```

As an EcmaScript module:

```js
import monaco from '@timkendrick/monaco-editor';

monaco.editor.create(...);
```

As a global variable:

```js
window.monaco.editor.create(...);
```

For full usage instructions, see the [Monaco API Docs](https://microsoft.github.io/monaco-editor/api/index.html).

# Configuration

The editor configuration is identical to the RequireJS version in the [Microsoft/monaco-editor](https://github.com/Microsoft/monaco-editor) repository.

The accompanying CSS and web worker scripts are all compiled into the main JavaScript bundle, avoiding the need to serve external assets separately.

To generate custom builds, see the [@timkendrick/monaco-editor-loader](https://www.npmjs.com/package/@timkendrick/monaco-editor-loader) Webpack loader.
