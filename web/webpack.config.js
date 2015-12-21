var path = require("path");

module.exports = {
    entry: "./src/client.js",

    output: {
        path: path.join(__dirname, "public"),
        filename: "app.js"
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "babel",
                exclude: /node_modules/,
                query: {
                    plugins: [ "transform-decorators-legacy" ],
                    presets: [ "es2015", "stage-0" ]
                }
            }
        ]
    }
};
