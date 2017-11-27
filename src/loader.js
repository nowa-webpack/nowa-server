/*
* @Author: gbk
* @Date:   2016-05-02 22:07:46
* @Last Modified by:   gbk
* @Last Modified time: 2017-06-21 20:00:57
*/

'use strict';

var os = require('os');
var path = require('path');

var util = require('./util');

module.exports = function(options) {
  var srcPath = util.cwdPath(options.src);
  if (options.includes) {
    srcPath = [
      srcPath
    ].concat(options.includes.map(function(include) {
      return util.cwdPath(include);
    }));
  }
  var preLoader = options.keepcss ? 'style-loader!export-css-loader?remove=false' : 'style-loader';
  var presets = util.babel('preset', [
    {
      name: 'es2015',
      options: {
        loose: !!options.loose
      }
    },
    'stage-0',
    'react'
  ]);
  var cacheDirectory = path.join(os.tmpdir(), options.loose ? 'babel-loose' : 'babel-strict');
  var plugins = [
    'add-module-exports',
    'transform-decorators-legacy',
    'transform-es3-member-expression-literals',
    'transform-es3-property-literals',
    {
      name: 'transform-runtime',
      options: {
        polyfill: !!options.polyfill,
        helpers: false,
        regenerator: true
      }
    }
  ];
  if (options.loose) {
    plugins.push('transform-proto-to-assign');
  }
  return [{
    test: /\.jsx?$/,
    loader: 'babel-loader',
    include: srcPath,
    query: options.lazyload ? {
      plugins: util.babel('plugin', plugins),
      presets: presets,
      cacheDirectory: cacheDirectory,
      babelrc: false
    } : {
      plugins: util.babel('plugin', [
        'add-module-exports',
        'transform-decorators-legacy',
        {
          name: 'transform-runtime',
          options: {
            polyfill: !!options.polyfill,
            helpers: false,
            regenerator: true
          }
        },
        {
          name: 'react-transform',
          options: {
            transforms: [
              {
                transform: 'react-transform-hmr',
                imports: [ 'react' ],
                locals: [ 'module' ]
              }, {
                transform: 'react-transform-catch-errors',
                imports: [ 'react', 'redbox-react' ]
              }
            ]
          }
        }
      ]),
      presets: presets,
      cacheDirectory: cacheDirectory,
      babelrc: false
    }
  }, {
    test: /\.js$/,
    loader: 'es3ify-loader',
    include: function(path) {
      return ~path.indexOf('babel-runtime');
    }
  }, {
    test: /\.css$/,
    loader: preLoader + '!css-loader?sourceMap',
  }, {
    test: /\.less$/,
    loader: preLoader + '!css-loader?sourceMap!less-loader',
  }, {
    test: /\.styl$/,
    loader: preLoader + '!css-loader?sourceMap!stylus-loader',
  }, {
    test: /\.svg$/,
    loader: 'babel-loader',
    query: {
      presets: presets,
      cacheDirectory: cacheDirectory,
      babelrc: false
    }
  }, {
    test: /\.svg$/,
    loader: 'svg2react-loader',
  }, {
    test: /\.json$/,
    loader: 'json-loader',
  }, {
    test: /\.(png|jpe?g|gif|woff|woff2|ttf|otf)$/,
    loader: 'url-loader',
  },{
    test: /\.tsx?$/,
    loader: 'ts-loader',
    include: srcPath,
    query: {
      transpileOnly: true
    }
  }];
};
