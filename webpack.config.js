/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'babel-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        host: 'editor.local',
        disableHostCheck: true,
        https: false,
    },
    devtool: 'inline-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Editor',
        }),
    ],
    // output: {
    //   filename: '[name].bundle.js',
    //   path: path.resolve(__dirname, 'dist')
    // }
};
