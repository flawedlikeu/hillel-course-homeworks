const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}, argv = {}) => {
  const isProd = argv.mode === 'production';

  // Хешування імен файлів: у production додаємо [contenthash],
  // щоб браузер підтягував новий файл лише коли змінився його вміст
  const hash = isProd ? '.[contenthash:8]' : '';

  // Кожна сторінка — окрема точка входу і окремий HTML
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
      clean: true, // очищення dist перед кожною збіркою
    },

    module: {
      rules: [
        // HTML: html-loader підхоплює <img src> і <link rel="icon">
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },

        // CSS: у dev — через <style> (швидко), у prod — окремий .css файл
        {
          test: /\.css$/i,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            { loader: 'css-loader', options: { importLoaders: 0 } },
          ],
        },

        // Зображення: дрібні (< 4 КБ) вбудовуються як data URI,
        // більші — копіюються окремими файлами з хешем
        {
          test: /\.(png|jpe?g|gif|webp|avif|svg)$/i,
          type: 'asset',
          parser: { dataUrlCondition: { maxSize: 4 * 1024 } },
          generator: { filename: `images/[name]${hash}[ext]` },
        },

        // Локальні шрифти: завжди окремими файлами в dist/fonts
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
            chunks: [name], // на кожну сторінку — лише її скрипти
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
      // Tree-shaking: прибираємо невикористаний код бібліотек (lodash-es)
      usedExports: true,
      sideEffects: true,
      // Код webpack-рантайму — окремим маленьким файлом,
      // щоб хеші vendors/app не змінювались без потреби
      runtimeChunk: 'single',
      // Зовнішні бібліотеки — окремий vendors-чанк, спільний для сторінок.
      // Він рідко змінюється, тож довго живе в кеші браузера
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
          },
          // Спільні стилі обох сторінок — один файл styles.[hash].css
          styles: {
            type: 'css/mini-extract',
            name: 'styles',
            chunks: 'all',
            priority: 20,
            enforce: true,
          },
          // Власний код, який використовують обидві сторінки (ui, cart-store, mock-data)
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
