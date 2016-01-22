// libraries
import path from 'path';

// functions
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';
import merge from 'webpack-merge';

// modules
import Clean from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

// constants
const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET; // set flag for babel to enable hot reload plugin

// define the app paths
const paths = {
  src: path.join(__dirname, 'src'),
  app: path.join(__dirname, 'src', 'app'),
  assets: path.join(__dirname, 'assets'),
  build: path.join(__dirname, 'build')
};

// define a default configuration that will be shared for all targets
const defaultConfiguration = {
  // define the input path
  entry: {
    app: paths.app
  },

  // define the output paths
  output: {
    path: paths.build,
    filename: '[name].[hash].js',
    publicPath: '/'
  },

  plugins: [
    // embed the app in an index page
    new HtmlWebpackPlugin({
      template: path.join(paths.app, 'index.html'),
      inject: 'body',
      favicon: path.join(paths.assets, 'favicon.ico'),
      files: {
        css: ['[name].[hash].css']
      }
    }),

    // remove duplicate files
    new webpack.optimize.DedupePlugin()
  ],

  // define the files to load with modules
  module: {
    loaders: [{
      // transpile js files with babel
      test: /\.js?$/,
      loader: 'babel',
      include: paths.src
    }, {
      // load assets and insert a build hash into the url
      test: /\.(png|jpg|svg|eot|ttf|woff|woff2)$/,
      loader: 'url-loader?limit=8192',
      include: paths.assets
    }]
  },

  // define the files types to load
  resolve: {
    extensions: ['', '.js']
  }
};

// export the development configuration when deploying locally
if (!TARGET || TARGET === 'start') {
  module.exports = merge(defaultConfiguration, {

    module: {
      loaders: [{
        // transpile stylus files into css
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader',
        include: paths.app
      }, {
        // inline the css into javascript for hot reloading
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }]
    },

    // add or remove vendor prefixes from css rules
    postcss: [
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ],

    // generate source maps for debugging
    devtool: 'eval-source-map',

    // define the dev server
    devServer: {
      contentBase: './build',
      host: 'localhost', // hard code this to match the facebook test app settings
      port: '3000', // hard code this to match the facebook test app settings
      historyApiFallback: true, // support the history api for routing
      stats: 'errors-only' // only display errors to the console
    }
  });
}

// export the production configuration when building to deploy for production
if (TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(defaultConfiguration, {

    // extract css during the build
    module: {
      loaders: [{
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('css-loader!postcss-loader?browsers=last 2 version!stylus-loader'),
        include: paths.src
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader')
      }]
    },

    plugins: [
      // clear the build directory
      new Clean(paths.build),

      // output the extracted css to a separate file
      new ExtractTextPlugin('[name].[hash].css'),

      // shrink the react library size by removing type checking on production
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      }),

      // minify the javascript with compression
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),

      // embed the app in an 200.html page for surge
      new HtmlWebpackPlugin({
        filename: '200.html',
        template: path.join(paths.app, 'index.html'),
        inject: 'body',
        favicon: path.join(paths.assets, 'favicon.ico'),
        files: {
          css: ['[name].[hash].css']
        }
      })
    ]
  });
}
