const path = require('path');

const config = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.(glsl|vs|fs|vert|frag)$/,
                exclude: /node_modules/,
                use: ['raw-loader']
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    devServer: {
        contentBase: './dist'
    },
    output: {
        filename: 'webfund.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'rh',
        libraryTarget: 'var'
    }
};

module.exports = (env, argv) => {
    if (argv.mode === 'development') {
        config.devtool = 'source-map';
        config.output.filename = 'webfund.dev.js';
    }

    if (argv.mode === 'production') {
        config.output.filename = 'webfund.min.js';
    }

    return config;
};
