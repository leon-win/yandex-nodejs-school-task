const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const appPath = path.resolve(__dirname, './dist');

module.exports = {
  entry: {
    'index': './src/index.js'
  },
  output: {
    path: appPath,
    filename: '[name].js'
  },
  devServer: {
    contentBase: appPath,
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './src/index.html' },
      { from: './src/data', to: 'data' }
    ])
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['env']
        },
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            js: 'babel-loader?presets[]=env'
          }
        }
      }
    ]
  }
};
