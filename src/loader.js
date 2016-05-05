/*
* @Author: gbk
* @Date:   2016-05-02 22:07:46
* @Last Modified by:   gbk
* @Last Modified time: 2016-05-05 22:23:13
*/

'use strict';

var util = require('./util');

module.exports = function(options) {
  var srcPath = util.cwdPath(options.src);
  var preLoader = options.keepcss ? 'style!export-css?remove=false' : 'style';
  var presets = util.babel('preset', [
    'es2015',
    'stage-0',
    'react'
  ]);
  return [{
    test: /\.jsx?$/,
    loader: 'babel',
    include: srcPath,
    query: options.lazyload ? {
      plugins: util.babel('plugin', [
        'add-module-exports',
        'transform-es3-member-expression-literals',
        'transform-es3-property-literals'
      ]),
      presets: presets
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
      presets: presets
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
      presets: presets
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
