const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');

const srcPath = path.resolve(__dirname, '../src');
const publicPath = path.resolve(__dirname, '../public');
const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || 'localhost';

module.exports = () => {
  return {
    module: {
      strictExportPresence: true,
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                modules: {
                  localIdentName: '[local]__[hash:base64:5]',
                },
                importLoaders: 1,
                sourceMap: process.env.GENERATE_SOURCEMAP !== 'false',
              },
            },
            {
              loader: require.resolve('sass-loader'),
              options: {
                sourceMap: process.env.GENERATE_SOURCEMAP !== 'false',
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: false,
                ident: 'postcss',
                plugins: () => [
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  }),
                ],
              },
            },
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                sourceMap: process.env.GENERATE_SOURCEMAP !== 'false',
              },
            },
          ],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env'],
            plugins: ['babel-plugin-transform-class-properties']
          }
        },
        {
          test: /\.(ttf|eot|otf|svg|png)$/,
          loader: 'file-loader'
        },
      ]
    },
    mode: 'development',
    resolve: {
      extensions: ['.tsx', '.ts', '.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
    },
    devtool: 'source-map',
    devServer: {
      contentBase: publicPath,
      hot: true,
      compress: true,
      host,
      port: '3000',
      publicPath: '/',
      https: protocol === 'https',
      clientLogLevel: 'none',
      quiet: true,
      open: true,
      historyApiFallback: {
        disableDotRule: true,
      },
      before(app) {
        app.use(errorOverlayMiddleware());
      },
    },
    entry: path.resolve(srcPath, 'index.js'),
    output: {
      path: publicPath,
      filename: 'bundle.js',
      publicPath: '/',
      pathinfo: true,
      devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env': {
          'GOOGLE_API_KEY': `'${process.env.GOOGLE_API_KEY}'`
        },
        PLATFORM: JSON.stringify('client')
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(publicPath, 'index.html')
      }),
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash:8].css',
      }),
      new webpack.ProvidePlugin({
        "React": "react",
      }),
      new ErrorOverlayPlugin(),
    ],
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  }
};
