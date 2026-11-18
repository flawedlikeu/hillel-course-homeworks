const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}, argv = {}) => {
  const isProd = argv.mode === 'production';

  const hash = isProd ? '.[contenthash:8]' : '';

  const pages = [
    { name: 'index' },
    { name: 'cart' },
  ];

  return {
    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',

    entry: Object.fromEntries(
      pages.map(({ name }) => [name, `./src/js/pages/${name}.js`]),
    ),

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `js/[name]${hash}.js`,
      chunkFilename: `js/[name]${hash}.chunk.js`,
      assetModuleFilename: `assets/[name]${hash}[ext]`,
      clean: true,
    },

    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },

        {
          test: /\.css$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            { loader: 'css-loader', options: { importLoaders: 0 } },
          ],
        },

        {
          test: /\.(png|jpe?g|gif|webp|avif|svg)$/i,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 4 * 1024 } },
          generator: { filename: `images/[name]${hash}[ext]` },
        },

        {
          test: /\.(woff2?|ttf|otf|eot)$/i,
          type: 'asset/resource',
          generator: { filename: `fonts/[name]${hash}[ext]` },
        },
      ],
    },

    plugins: [
      ...pages.map(
        ({ name }) =>
          new HtmlWebpackPlugin({
            template: `./src/pages/${name}.html`,
            filename: `${name}.html`,
            chunks: [name],
            minify: isProd,
          }),
      ),
      new MiniCssExtractPlugin({
        filename: `css/[name]${hash}.css`,
        chunkFilename: `css/[name]${hash}.chunk.css`,
      }),
      env.analyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean),

    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({ extractComments: false }),
        new CssMinimizerPlugin(),
      ],
      usedExports: true,
      sideEffects: true,
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          styles: {
            type: 'css/mini-extract',
            name: 'styles',
            chunks: 'all',
            priority: 20,
            enforce: true,
          },
          common: {
            test: /[\\/]src[\\/]js[\\/]modules[\\/]/,
            minChunks: 2,
            minSize: 0,
            name: 'common',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
      moduleIds: 'deterministic',
    },

    performance: {
      hints: isProd ? 'warning' : false,
    },

    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 8080,
      open: false,
      hot: true,
      watchFiles: ['src/**/*.html'],
    },
  };
};
