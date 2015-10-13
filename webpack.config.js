var path = require('path');

module.exports = {
    entry: './src/client.js',

    output: {
        path: path.join(__dirname, "public"),
        filename: 'app.js'
    },

    module: {
        loaders: [
            {
                test: path.join(__dirname, 'src'),
                loader: 'babel-loader'
            }
        ]
    }
};
