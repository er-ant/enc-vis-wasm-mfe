const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { NxReactWebpackPlugin } = require('@nx/react/webpack-plugin');
const { join } = require('path');
// const { ModuleFederationPlugin } = require('webpack').container;
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/react-mfe'),
    clean: true,
  },
  devServer: {
    port: 4202,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
      htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  experiments: {
    outputModule: true,
  },
  plugins: [
    new NxAppWebpackPlugin({
      tsConfig: './tsconfig.app.json',
      compiler: 'babel',
      main: './src/main.tsx',
      index: './src/index.html',
      baseHref: '/',
      assets: ['./src/favicon.ico', './src/assets'],
      styles: ['./src/styles.scss'],
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
    }),
    new ModuleFederationPlugin({
      name: 'reactMfe',
      filename: 'remoteEntry.js',
      library: {
        type: 'module',  // ESM вместо var
      },
      exposes: {
        './ReactMFE': './src/app/app.tsx',
      },
      shared: {
        react: { singleton: true, eager: false },
        'react-dom': { singleton: true, eager: false },
      },
    }),
  ],
};
