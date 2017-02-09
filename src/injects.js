/*
* @Author: gbk
* @Date:   2017-01-19 20:20:58
* @Last Modified by:   Tommy Troy Lin
* @Last Modified time: 2017-02-08 18:06:34
*/

'use strict';

var fs = require('fs');
var path = require('path');

var parseUrl = require('parseurl');
var resolveCwd = require('resolve-cwd');

var util = require('./util');

module.exports = function (root, injects) {
  root = path.resolve(root);
  injects = (injects || []).map(function (inject) {
    var res = (resolveCwd(inject) || inject).replace(process.cwd(), '');
    if (/\.css$/.test(res)) {
      return '<link rel="stylesheet" href="' + res + '" />';
    }
    return '<script src="' + res + '"></script>';
  }).join('');

  if (util.isDirectory(root) && injects.length) {

    // root must be a directory
    return function (req, res, next) {
      var pathname = parseUrl(req).pathname;
      if (pathname.substr(-1) === '/') {
        pathname += 'index.html';
      }
      if (/\.html?$/.test(pathname)) {
        var file = path.join(root, pathname);
        try {
          var content = fs.readFileSync(file).toString();
          var injectionComment = /<!--\s*Nowa\s*Server\s*Injects\s*-->/i;
          if (injectionComment.test(content)) {
            content = content.replace(injectionComment, injects);
          }
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
    return function (req, res, next) {
      next();
    };

  }
};
