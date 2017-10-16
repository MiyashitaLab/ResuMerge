const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const src = path.resolve(__dirname, '../client/src/');
const dist = path.resolve(__dirname, '../client/dist/');

module.exports = {
  entry: ['react-hot-loader/patch', path.resolve(src, './scripts/index.tsx')],
  output: {
    path: dist,
    filename: 'scripts/bundle.js',
    publicPath: '/',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'react-hot-loader/webpack',
          },
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: path.resolve(__dirname, './tsconfig.client.json'),
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      title: 'レジュメ結合ツール',
      template: path.resolve(src, './index.ejs'),
      inject: 'head',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),
  ],
  devServer: {
    publicPath: 'http://localhost:9000/',
    contentBase: dist,
    port: 9000,
    hot: true,
    proxy: {
      '/': 'http://localhost:3000',
    },
  },
};
