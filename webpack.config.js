const webpack = require('webpack');
const path = require('path');

const production = process.env.NODE_ENV === 'production';

// Constants
const names = {
  library: 'media-events',
  src: 'src',
  dist: 'dist',
  entry: 'media-events.js',
  output: production ? 'media-events.min.js' : 'media-events.js',
};
const paths = {
  root: __dirname,
  src: path.join(__dirname, names.src),
  entry: path.join(__dirname, names.src, names.entry),
  output: path.join(__dirname, names.dist),
};

// Plugins
const plugins = {
  development: [],
  production: [
    new webpack.optimize.UglifyJsPlugin({ minimize: true }),
  ],
};

// Export main config
module.exports = {
  entry: paths.entry,
  devtool: production ? undefined : 'source-map',
  output: {
    path: paths.output,
    filename: names.output,
    library: names.library,
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
      },
    ],
  },
  plugins: production ? plugins.production : plugins.development,
  resolve: {
    root: paths.src,
    extensions: ['', '.js'],
  },
};
