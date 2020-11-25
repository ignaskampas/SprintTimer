const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common");
const HtmlWebPackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
    mode: "development",
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    devServer: {
      historyApiFallback: true,
    },
    plugins: [
        new HtmlWebPackPlugin({
          template: "./src/index.html",
          filename: "./index.html"
        })
      ]
});