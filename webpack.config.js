const ArcGISPlugin = require("@arcgis/webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: 'development',
  entry: {
    index: "./src/index.js"
  },
  output: {
    filename: "[name].bundle.js",
    publicPath: "/"
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        resolve: { extensions: ['.js', '.jsx'] }
      },
      {
        test: /\.(jpe?g|png|gif|webp)$/,
        use: [
          "cache-loader",
          {
            loader: "url-loader",
            options: {
              // Inline files smaller than 10 kB (10240 bytes)
              limit: 10 * 1024,
            }
          }
        ]
      },
      {
        test: /\.(wsv|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [
          "cache-loader",
          {
            loader: "file-loader",
            options: {
              name: "build/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ["cache-loader", MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },

  plugins: [
    new ArcGISPlugin({
      useDefaultAssetLoaders: false
    }),
    new HtmlWebPackPlugin({
      title: "My ArcGIS Webpack App",
      chunksSortMode: "none",
      meta: {
        viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      }
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],

  resolve: {
    modules: [
      path.resolve(__dirname, "/src"),
      path.resolve(__dirname, 'node_modules/')
    ],
    extensions: [".js", ".scss"]
  },

  externals: [
    (context, request, callback) => {
      if (/pe-wasm$/.test(request)) {
        return callback(null, "amd " + request);
      }
      callback();
    }
  ],

  node: {
    process: false,
    global: false,
    fs: 'empty',

  },
  devtool: 'source-map',
  devServer: {
    contentBase: './',
    //     // port: 3001,
    historyApiFallback: true
  },
};