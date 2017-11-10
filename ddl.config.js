var webpack = require('webpack');

var vendors = [
    'react',
    'react-dom',
    'react-router',
    'reflux',
    'react-mixin',
    'bundle-loader',
    'superagent',
    'style-loader',
    'shallow-equal-fuzzy',
    'react-hot-loader',
    'path',
    'jquery',
    'select2',
    // 'babel-core',
    // 'babel-loader',
    // 'babel-plugin-transform-react-jsx',
    // 'babel-preset-es2015',
    // 'babel-preset-react',
    // 'babel-preset-stage-0',
    // 'babel-runtime',
    // 'css-loader',
    // 'eslint',
    // 'eslint-config-airbnb',
    // 'eslint-plugin-import',
    // 'eslint-plugin-jsx-a11y',
    // 'eslint-plugin-react'
];

module.exports = {
    output: {
        path: './build',
        filename: '[name].js',
        library: '[name]'
    },
    entry: {
        "lib": vendors
    },
    plugins: [
        new webpack.DllPlugin({
            path: 'manifest.json',
            name: '[name]',
            context: __dirname
        })
    ]
};