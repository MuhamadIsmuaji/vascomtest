/* eslint-disable import/no-extraneous-dependencies */
const webpack = require("webpack");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const VueLoader = require("vue-loader");
const CopyPlugin = require("copy-webpack-plugin");
const autoprefixer = require("autoprefixer");

module.exports = {
  mode: process.env.NODE_ENV === "development" ? "development" : "production",
  context: path.join(__dirname, "client"),
  entry: {
    app: {
      import: ["./src/App.ts"],
      filename: "app/app.js",
    },
  },
  output: {
    path: path.join(__dirname, "public"),
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          configFile: path.resolve(__dirname, "client", "tsconfig.json"),
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: true,
          presets: [
            [
              "@babel/preset-env",
              {
                useBuiltIns: "usage",
                corejs: "3.17",
                debug: false,
              },
            ],
          ],
        },
      },
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.pug$/,
        use: "pug-plain-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: { sourceMap: true },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.css/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  performance: {
    maxEntrypointSize: 1300000,
    maxAssetSize: 1000000,
  },
  plugins: [
    new VueLoader.VueLoaderPlugin(),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new MiniCssExtractPlugin({
      filename: (data) => {
        switch (data.chunk.name) {
          case "app":
            return "app/[name].css";
          default:
            return "[name].css";
        }
      },
    }),
    new CopyPlugin({
      patterns: [{ from: "static", to: path.join(__dirname, "public") }],
    }),
  ],
};
