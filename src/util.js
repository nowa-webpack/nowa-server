/*
* @Author: gbk
* @Date:   2016-05-02 17:15:36
* @Last Modified by:   gbk
* @Last Modified time: 2016-05-05 22:47:46
*/

'use strict';

var fs = require('fs');
var path = require('path');

var util = {

  // get absolute path to cwd
  cwdPath: function() {
    var argvs = Array.prototype.slice.call(arguments);
    argvs.unshift(process.cwd());
    return path.join.apply(path, argvs);
  },

  // get absolute path to __dirname
  relPath: function(p) {
    var argvs = Array.prototype.slice.call(arguments);
    argvs.unshift(__dirname);
    return path.join.apply(path, argvs);
  },

  // make a webpack entry
  makeEntry: function(lazyload) {
    var params = Array.prototype.slice.call(arguments, 1);
    if (lazyload) {
      return './' + path.join.apply(path, params);
    } else {
      return [
        // util.relPath('..', 'node_modules', 'webpack-hot-middleware', 'client') + '?reload=true&noInfo=true',
        'webpack-hot-middleware/client?reload=true&noInfo=true',
        './' + path.join.apply(path, params)
      ]
    }
  },

  // make all valid pages as webpack entries
  makePageEntries: function(lazyload, src, entries) {
    var pages = fs.readdirSync(path.join(src, 'pages'));
    pages.forEach(function(page) {
      try {
        var entry = path.join(src, 'pages', page, 'index.js');
        if (fs.statSync(entry).isFile()) {
          entries[page] = util.makeEntry(lazyload, src, 'pages', page, 'index.js');
        }
      } catch (e) {
      }
    });
    return entries;
  },

  // parse vars to plain kv object
  parseVars: function(vars) {
    var newVars = {};
    for (var key in vars) {
      newVars[key] = vars[key].length ? vars[key][0] : vars[key];
    }
    return newVars;
  },

  // make filename suffix by vars
  suffixByVars: function (vars) {
    if (vars) {
      var suffix = '';
      for (var key in vars) {
        if (vars[key].length) {
          var value = vars[key][0];

          // filename suffix will not contain `/`
          if (value !== undefined) {
            suffix += '-' + value.toString().replace(/\//, '');
          }
        }
      }
      return suffix;
    } else {
      return '';
    }
  },

  // make babel plugin/preset absolute path
  babel: function(type, name) {
    if (Array.isArray(name)) {
      return name.map(function(n) {
        return util.babel(type, n);
      });
    } else {
      return util.relPath('..', '..', 'nowa', 'node_modules', [
        'babel',
        type,
        name
      ].join('-'));
    }
  },

  // safe watch
  watch: function(dir, handler) {
    var timer = 0;
    fs.watch(dir, function() {
      clearTimeout(timer);
      timer = setTimeout(handler, 20);
    });
  },

  // make options for https key & cert
  makeKeyCert: function(httpsOpt) {

    if (httpsOpt === true) {

      // use preset key & cert
      return {
        key: fs.readFileSync(util.relPath('certs', 'host.key')),
        cert: fs.readFileSync(util.relPath('certs', 'host.cert'))
      };
    } else {

      // user passed key & cert
      return {
        key: fs.readFileSync(httpsOpt.key),
        cert: fs.readFileSync(httpsOpt.cert)
      };
    }
  }
};

module.exports = util;
