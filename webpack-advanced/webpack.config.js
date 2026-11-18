const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const pages = ['index', 'cart'];

module.exports = (env = {}, argv = {}) => {
  const isProd = argv.mode === 'production';
  const hash = isProd ? '.[contenthash:8]' : '';

  const styleLoader = isProd ? MiniCssExtractPlugin.loader : 'style-loader';
  const cssLoader = (importLoaders) => ({
    loader: 'css-loader',
    options: { importLoaders, sourceMap: !isProd },
  });

  return {
    mode: isProd ? 'production' : 'development',
    target: 'browserslist',
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',

    entry: Object.fromEntries(pages.map((name) => [name, `./src/js/pages/${name}.js`])),

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: `js/[name]${hash}.js`,
      chunkFilename: `js/[name]${hash}.chunk.js`,
      assetModuleFilename: `assets/[name]${hash}[ext]`,
      clean: true,
    },

    resolve: {
      extensions: ['.ts', '.js'],
    },

    module: {
      rules: [
        {
          test: /\.html$/i,
          loader: 'html-loader',
        },
        {
          test: /\.ts$/i,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader',
            options: { configFile: path.resolve(__dirname, 'tsconfig.json') },
          },
        },
        {
          test: /\.js$/i,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: { cacheDirectory: true },
          },
        },
        {
          test: /\.css$/i,
          use: [styleLoader, cssLoader(0)],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            styleLoader,
            cssLoader(1),
            { loader: 'sass-loader', options: { sourceMap: !isProd } },
          ],
        },
        {
          test: /\.less$/i,
          use: [
            styleLoader,
            cssLoader(1),
            { loader: 'less-loader', options: { sourceMap: !isProd } },
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
        (name) =>
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
      new ESLintPlugin({
        configType: 'flat',
        extensions: ['js', 'ts'],
        files: 'src',
        failOnError: isProd,
        emitWarning: true,
      }),
      env.analyze &&
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: 'bundle-report.html',
          openAnalyzer: !process.env.CI,
        }),
    ].filter(Boolean),

    optimization: {
      minimize: isProd,
      minimizer: [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()],
      usedExports: true,
      sideEffects: true,
      runtimeChunk: 'single',
      moduleIds: 'deterministic',
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          styles: {
            type: 'css/mini-extract',
            minChunks: 2,
            name: 'styles',
            priority: 20,
            enforce: true,
          },
          vendors: {
            test: /[\\/]node_modules[\\/].*\.js$/,
            name: 'vendors',
            priority: 10,
          },
          common: {
            test: /[\\/]src[\\/](ts|js)[\\/](?!pages)/,
            minChunks: 2,
            minSize: 0,
            name: 'common',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
    },

    performance: {
      hints: isProd ? 'warning' : false,
    },

    devServer: {
      static: path.resolve(__dirname, 'dist'),
      port: 8080,
      open: true,
      hot: true,
      liveReload: true,
      compress: true,
      watchFiles: ['src/**/*.html'],
      client: {
        overlay: { errors: true, warnings: false },
        progress: true,
      },
    },
  };
};
