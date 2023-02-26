const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackBundleAnalyzer = require('webpack-bundle-analyzer');

// @see https://itnext.io/create-react-typescript-project-with-webpack-and-babel-2431cac8cf5b
module.exports = {
  entry: './src/app/Index.tsx',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  mode: 'development',
  devServer: {
    https: true,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, './dist')
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.(png|jpg|svg|eot|ttf|woff|woff2|mp3|mp4)$/,
        use: {
          loader: 'file-loader'
        }
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.ts', '.tsx', '.js']
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/static',
          globOptions: {
            ignore: ['**/*.d.ts']
          }
        }
      ]
    }),
    new WebpackBundleAnalyzer.BundleAnalyzerPlugin()
  ]
}
