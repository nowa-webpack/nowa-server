/*
* @Author: gbk
* @Date:   2017-01-19 20:20:58
* @Last Modified by:   gbk
* @Last Modified time: 2017-01-19 21:43:37
*/

'use strict';

var fs = require('fs');
var path = require('path');

var parseUrl = require('parseurl');
var resolveCwd = require('resolve-cwd');

var util = require('./util');

module.exports = function(root, injects) {
  root = path.resolve(root);
  injects = (injects || []).map(function(inject) {
    var script = (resolveCwd(inject) || inject).replace(process.cwd(), '');
    return '<script src="' + script + '"></script>';
  }).join('');

  if (util.isDirectory(root) && injects.length) {

    // root must be a directory
    return function(req, res, next) {
      var pathname = parseUrl(req).pathname;
      if (pathname.substr(-1) === '/') {
        pathname += 'index.html';
      }
      if (/\.html?$/.test(pathname)) {
        var file = path.join(root, pathname);
        try {
          var content = fs.readFileSync(file).toString();
          content = content.replace(/<body([^>]*)>/, '<body$1>' + injects);
          res.end(content);
        } catch (e) {
          next();
        }
      } else {
        next();
      }
    };

  } else {

    // is not, do nothing
    return function(req, res, next) {
      next();
    };

  }
};
