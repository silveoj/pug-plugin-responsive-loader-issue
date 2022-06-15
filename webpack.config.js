const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, argv) => {
  const dirname = path.resolve(__dirname, 'src');
  const isProd = argv.mode === 'production';

  return {
    context: dirname,
    mode: isProd,
    entry: {
      main: './js/main.js',
    },
    output: {
      filename: '[name].[contenthash:8].js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      extensions: ['.js', '.json'],
      alias: {
        Images: '/assets/img',
      },
    },
    devServer: {
      port: 2437,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'responsive-loader',
        filename: 'index.html',
        template: './views/index.html',
      }),
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        // {
        //   test: /\.html$/i,
        //   loader: "html-loader",
        // },

        // styles
        {
          test: /\.(css|sass|scss)$/,
          include: [path.join(dirname, "styles")],
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },

        // images
        {
          test: /\.(gif|png|jpe?g|ico|svg|webp)$/i,
          type: 'asset/resource',
          // include: /assets\/images/,
          include: [path.join(dirname, "/assets/img")],
          use: {
            loader: 'responsive-loader',
            options: {
              // adapter: require('responsive-loader/sharp'),
              outputPath: 'assets/img',
              name: '[name].[hash:8]-[width]w.[ext]',
            },
          },
        },
      ]
    }
  };
};
