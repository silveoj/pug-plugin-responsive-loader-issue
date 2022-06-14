const path = require('path');
const PugPlugin = require('pug-plugin');

module.exports = (env, argv) => {
  const dirname = path.resolve(__dirname, 'src');
  const isProd = argv.mode === 'production';

  return {
    context: dirname,
    mode: isProd,
    entry: {
      index: `./views/index.pug`,
    },
    output: {
      filename: '[name].[contenthash:8].js',
      clean: true,
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
    },
    resolve: {
      // extensions: ['.js', '.json', 'scss'],
      alias: {
        Images: '/assets/img',
        Styles: '/styles',
        Scripts: '/js',
      },
    },
    devServer: {
      port: 2437,
    },
    plugins: [
      // new CleanWebpackPlugin(),
      new PugPlugin({
        modules: [
          PugPlugin.extractCss({
            filename: '[name].[contenthash:8].css',
          }),
        ],
      }),
    ],
    module: {
      rules: [
        // pug
        {
          test: /\.(pug)$/,
          loader: PugPlugin.loader, // <-- ultra important
          options: {
            method: 'render', // fastest method to generate static HTML files
          },
        },

        // styles
        {
          test: /\.(css|sass|scss)$/,
          include: [path.join(dirname, "styles")],
          use: ['css-loader', 'sass-loader'],
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
              name: 'assets/img/[name].[hash:8]-[width]w.[ext]',
            },
          },
        },
      ]
    }
  };
};
