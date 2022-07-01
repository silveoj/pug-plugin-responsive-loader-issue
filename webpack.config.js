const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PugPlugin = require('pug-plugin');

// ******************

const startDir = path.resolve(__dirname, 'src');

module.exports = (argv) => {
  const isProduction = argv.mode === 'production';

  return {
    context: startDir,
    mode: isProduction,
    entry: {
      index: './html/pages/index.pug',
      view2: './html/pages/view-2.pug', // ./html/pages/view-2/index.pug doesn't works too
    },
    output: {
      filename: `assets/js/[name].[contenthash:8].js`,
      chunkFilename: 'assets/js/[id].[contenthash:8].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    resolve: {
      extensions: ['.js', '.json', 'scss'],
      alias: {
        '@': startDir,
        Fonts: path.join(startDir, '/assets/fonts'),
        Images: path.join(startDir, '/assets/img'),
        Styles: path.join(startDir, '/styles'),
      },
    },
    optimization: {
      splitChunks: {
        chunks: 'all', // TODO: comment here to get success
      },
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      watchFiles: {
        paths: ['src/**/*.*'],
        options: {
          usePolling: true,
        },
      },
      open: true, // open in browser
    },
    plugins: [
      new CleanWebpackPlugin(),
      new PugPlugin({
        modules: [
          PugPlugin.extractCss({
            filename: `assets/css/[name].[contenthash:8].css`,
          }),
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.pug$/,
          loader: PugPlugin.loader, // '@webdiscus/pug-loader',
          options: {
            method: 'render', // 'render' is fastest method to generate static HTML files
          },
        },
        {
          test: /\.s[ac]ss$/,
          include: [path.join(startDir, 'styles')],
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [['postcss-preset-env']],
                },
              },
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /\.(jpe?g|png|webp)$/,
          // type: 'asset/resource',
          include: [path.join(startDir, '/assets/img')],
          use: {
            loader: 'responsive-loader',
            options: {
              outputPath: 'assets/img',
              name: '[name]-[width].[ext]',
            },
          },
        },
    
        // Fonts
        {
          test: /\.(woff2?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          type: 'asset/resource',
          include: [path.join(startDir, 'assets/fonts')],
          generator: {
            filename: 'assets/fonts/[name][ext]',
          },
        },
      ],
    },
  };
};
