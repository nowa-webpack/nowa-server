/*
* @Author: gbk
* @Date:   2016-05-02 22:07:46
* @Last Modified by:   gbk
* @Last Modified time: 2016-09-24 23:33:27
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
  var preLoader = options.keepcss ? 'style!export-css?remove=false' : 'style';
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
  return [{
    test: /\.jsx?$/,
    loader: 'babel',
    include: srcPath,
    query: options.lazyload ? {
      plugins: util.babel('plugin', [
        'add-module-exports',
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
      ]),
      presets: presets,
      cacheDirectory: cacheDirectory,
      babelrc: false
    } : {
      plugins: [
        util.babel('plugin', 'add-module-exports'),
        [
          util.babel('plugin', 'react-transform'),
          {
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
        ]
      ],
      presets: presets,
      cacheDirectory: cacheDirectory,
      babelrc: false
    }
  }, {
    test: /\.css$/,
    loader: preLoader + '!css?sourceMap',
    include: srcPath
  }, {
    test: /\.less$/,
    loader: preLoader + '!css?sourceMap!less',
    include: srcPath
  }, {
    test: /\.styl$/,
    loader: preLoader + '!css?sourceMap!stylus',
    include: srcPath
  }, {
    test: /\.svg$/,
    loader: 'babel',
    include: srcPath,
    query: {
      presets: presets,
      cacheDirectory: cacheDirectory,
      babelrc: false
    }
  }, {
    test: /\.svg$/,
    loader: 'svg2react',
    include: srcPath
  }, {
    test: /\.json$/,
    loader: 'json',
    include: srcPath
  }, {
    test: /\.(png|jpe?g|gif)$/,
    loader: 'url',
    include: srcPath
  }];
};
