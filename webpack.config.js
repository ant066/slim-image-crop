const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            // {
            //     test: /\.(ttf|woff?g|gif)$/i,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //         },
            //     ],
            // },
            {
                test: /\.(woff|woff2|ttf|otf)$/,
                loader: 'file-loader',
                include: [/fonts/],

                options: {
                    name: '[hash].[ext]',
                    outputPath: 'css/',
                    publicPath: url => '../css/' + url
                }
            },
        ],
    }
};