/*
* @Author: gbk
* @Date:   2016-05-02 17:15:36
* @Last Modified by:   tommytroylin
* @Last Modified time: 2016-11-21 19:10:07
*/

'use strict';

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

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
  makeEntry: function(options) {
    var params = Array.prototype.slice.call(arguments, 1);
    if (options.lazyload) {
      return './' + path.join.apply(path, params);
    } else {
      var address = encodeURIComponent(options.address + '/__webpack_hmr');
      return [
        'webpack-hot-middleware/client?reload=true&noInfo=true&path=' + address,
        './' + path.join.apply(path, params)
      ]
    }
  },

  // make all valid pages as webpack entries
  makePageEntries: function(options, src, entries) {
    var pages = fs.readdirSync(path.join(src, 'pages'));
    pages.forEach(function(page) {
      try {
        var entry = path.join(src, 'pages', page, 'index.js');
        if (fs.statSync(entry).isFile()) {
          entries[page] = util.makeEntry(options, src, 'pages', page, 'index.js');
          return;
        }
      } catch (e) {
      }
      try {
        var entry = path.join(src, 'pages', page, 'index.jsx');
        if (fs.statSync(entry).isFile()) {
          entries[page] = util.makeEntry(options, src, 'pages', page, 'index.jsx');
        }
      } catch (e) {
      }
    });
    return entries;
  },

  // parse vars for DefinePlugin
  parseVars: function(vars) {
    var newVars = {};
    for (var key in vars) {
      newVars[key] = JSON.stringify(vars[key]);
    }
    return newVars;
  },

  // make filename suffix by vars
  suffixByVars: function (vars, buildvars) {
    if (vars) {
      var suffix = '';
      for (var key in vars) {
        var value = vars[key];

        // filename suffix will not contain `/`
        if (value !== undefined && buildvars && buildvars[key] && buildvars[key].length > 1) {
          suffix += '-' + value.toString().replace(/\//, '');
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
      if (typeof name === 'object') {
        return [
          require.resolve([
            'babel',
            type,
            name.name
          ].join('-')),
          name.options
        ];
      } else {
        return require.resolve([
          'babel',
          type,
          name
        ].join('-'));
      }
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
  },

  // open url in default browser
  open: function(url) {
    var command;
    switch (process.platform) {
      case 'darwin':
        command = 'open';
        break;
      case 'win32':
        command = 'explorer.exe';
        break;
      case 'linux':
        command = 'xdg-open';
        break;
      default:
        console.error('Can not open browser');
        return;
    }
    spawn(command, [ url ]);
  }
};

module.exports = util;
