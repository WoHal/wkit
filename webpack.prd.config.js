'use strict';

const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

let baseConfig = require('./webpack.config');
baseConfig.plugins = [];

let config = merge(baseConfig, {
    output: {
        path: __dirname + '/dist',
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        new ExtractTextPlugin({
            filename: '[name].[contenthash].css'
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                },
                output: {
                    comments: false
                }
            },
            sourceMap: true,
            parallel: true
        }),
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: false
            },
            chunksSortMode: 'dependency'
        }),
        new webpack.HashedModuleIdsPlugin()
    ],
    devtool: '#source-map'
});

module.exports = config;
