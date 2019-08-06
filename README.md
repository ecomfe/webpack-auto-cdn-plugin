# webpack-auto-cdn-plugin

Webpack plugin to automatically extract dependencies and reference them via CDN.

This plugin will scan your `dependencies` and `devDependencies`, extract those suitable to be hosted on CDN via [lib/hints.js](lib/hints.js) and add them to `externals`, a `<script>` tag will be added to your `html-webpack-plugin` generated HTML file so that these dependencies can be referenced via CDN.

## Usage

This plugin requires `html-webpack-plugin@4.x` to work.

```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AutoCDNPlugin = require('../index');

module.exports = {
    mode: 'development',
    context: __dirname,
    entry: path.join(__dirname, 'index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin(),
        new AutoCDNPlugin({cwd: __dirname}),
    ],
};
```

### Options

- `{string} cwd`: Current working directory where `package.json` of your project is.

## Play It

```shell
cd demo
yarn install
webpack --config=webpack.config.js
```

Have a look at `dist/index.html` and `dist/main.js`, all dependencies are removed from dist javascript, `<script>` tags are generated automatically.
