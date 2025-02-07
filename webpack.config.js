const path = require('path');
const DIST_DIR = path.join(__dirname, '/client/dist');
const SRC_DIR = path.join(__dirname, '/client/src');

module.exports = {
  mode: 'development',

  entry: {
    main: `${SRC_DIR}/index.jsx`,
  },
  output: {
    path: DIST_DIR,
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /nodeModules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(mp3|wav)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/audio/',
          },
        },
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
