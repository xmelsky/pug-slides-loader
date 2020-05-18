const path = require('path');

module.exports = {
  entry: './src/index.js',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel-loader'],
      },
    ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve('./', ''),
  },
}