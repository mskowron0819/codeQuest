const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
module.exports = {
    entry: {
        main: ['./src/js/app.js', './src/scss/style.scss']
    },
    output: {
        filename: "./dist/out.js"
    },
    watch: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {presets: ['es2015']}
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader'],
            },
        ]
    }
};
