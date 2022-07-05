const path = require('path');
const PugPlugin = require('pug-plugin');

const startDir = path.resolve(__dirname, 'src');

module.exports = (argv) => {
  const isProduction = argv.mode === 'production';

  return {
    context: startDir,
    mode: isProduction,
    devtool: 'source-map',
    entry: {
      index: './html/pages/index.pug',
      view2: './html/pages/view-2.pug', // ./html/pages/view-2/index.pug doesn't works too
    },
    output: {
      filename: `assets/js/[name].[contenthash:8].js`,
      chunkFilename: 'assets/js/[id].[contenthash:8].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      clean: true,
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
        //chunks: 'all', // DON'T use default spliting, it's break compilation process in pug-plugin (Webpack BUG!!!)
        cacheGroups: {
          scripts: {
            test: /\.(js|ts)$/, // here must be specified all extensions of scripts which should be splitted
            chunks: 'all',
            enforce: true, // only as example to force split all js files, remove in your code
          },
        },
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
      //open: true, // open in browser
    },
    plugins: [
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
          loader: PugPlugin.loader,
          options: {
            method: 'render', // 'render' is fastest method to generate static HTML files
          },
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            {
              loader: 'css-loader',
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
          type: 'asset/resource', // <-- MUST BE defined
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
