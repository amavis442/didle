const path = require('path');
const webpack = require('webpack'); //to access built-in plugins

module.exports = {
    mode: 'production',
    entry: './src/main.ts',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    module: {
        rules: [
            { test: /\.css$/, use: 'css-loader' },
            { test: /\.ts$/, use: 'ts-loader' },
        ],
    },
};

