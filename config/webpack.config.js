var path = require('path');
var webpack = require('webpack');
var StatsPlugin = require('stats-webpack-plugin');

// must match config.webpack.dev_server.port
var devServerPort = 3808;

// set NODE_ENV=production on the environment to add asset fingerprints
var production = process.env.NODE_ENV === 'production';

var config = {
  entry: {
    application: './app/assets/javascripts/app.js',
    globals: './app/assets/javascripts/globals.js'
  },

  output: {
    // Build assets directly in to public/webpack/, let webpack know
    // that all webpacked assets start with webpack/

    // must match config.webpack.output_dir
    path: path.join(__dirname, '..', 'public', 'webpack'),
    publicPath: '/webpack/',

    filename: production ? '[name]-[chunkhash].js' : '[name].js'
  },

  resolve: {
    root: path.join(__dirname, '..', 'app/assets/javascripts'),
    alias: {
      vendor: path.join(__dirname, '..', 'vendor/assets/javascripts'),
      collections: path.join(__dirname, '..', 'app/assets/javascripts/collections'),
      mixins: path.join(__dirname, '..', 'app/assets/javascripts/mixins'),
      models: path.join(__dirname, '..', 'app/assets/javascripts/models'),
      templates: path.join(__dirname, '..', 'app/assets/javascripts/templates'),
      views: path.join(__dirname, '..', 'app/assets/javascripts/views')
    }
  },

  plugins: [
    // must match config.webpack.manifest_filename
    new StatsPlugin('manifest.json', {
      // We only need assetsByChunkName
      chunkModules: false,
      source: false,
      chunks: false,
      modules: false,
      assets: true
    }),

    new webpack.NormalModuleReplacementPlugin(
      /jquery\.ui\.widget/,
      require.resolve('cloudinary_js/js/jquery.ui.widget')
    ),

    new webpack.ProvidePlugin({
      Backbone: 'backbone',
      $: 'jquery',
      jQuery: 'jquery',
      _: 'underscore'
    })
  ]
};

if (production) {
  config.plugins.push(
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: { warnings: false },
      sourceMap: false
    }),
    new webpack.DefinePlugin({
      'process.env': { NODE_ENV: JSON.stringify('production') }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  );
} else {
  config.devServer = {
    port: devServerPort,
    headers: { 'Access-Control-Allow-Origin': '*' }
  };
  config.output.publicPath = '//localhost:' + devServerPort + '/webpack/';
  // Source maps
  config.devtool = 'cheap-module-eval-source-map';
}

module.exports = config;
