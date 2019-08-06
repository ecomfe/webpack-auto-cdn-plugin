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
