const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: path.resolve(__dirname, 'src') + '/index.jsx',
    output: {
        filename: 'react-pivot-webpack.js',
        path: path.resolve(__dirname, "./dist"),
        libraryTarget: 'commonjs'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }
        ]
    }
};