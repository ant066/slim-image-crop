const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpackConfig = require('./webpack.config.js');
const path = require('path');

module.exports = merge(webpackConfig, {
    entry: {
        app: './demo/index.js'
    },
    devtool: 'inline-source-map',
    output: {
        pathinfo: true,
        publicPath: '',
        filename: '[name].js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'DEMO PHOTO EDITOR',
            template: './public/index.html',
            filename: './index.html'
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, 'public'),
        watchContentBase: true,
        publicPath: '/',
        open: true
    }
});