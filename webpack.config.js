var webpack = require('webpack');
var path = require("path");

module.exports = {
    cache: true,
    debug: true,
    entry: {
        app: './entry.js'
    },

    output: {
        path: './build', 
        publicPath: './build/',
        filename: 'bundle.js'
    },

    // devtool: 'source-map',//开发环境
    devtool: 'cheap-module-source-map',//生产环境
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loaders: ['react-hot', 'babel?compact=false,presets[]=react,presets[]=es2015,presets[]=stage-0']
        }, {
            test: /\.css$/,
            loader: 'style!css'
        }]
    },

    plugins: [
        // kills the compilation upon an error.
        // this keeps the outputed bundle **always** valid
        new webpack.NoErrorsPlugin(),
        //这个使用uglifyJs压缩你的js代码
        //new webpack.optimize.UglifyJsPlugin({minimize: true}),

        //new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js')

        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./manifest.json')
        })
    ]
}