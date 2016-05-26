/*
* @Author: gbk
* @Date:   2016-03-28 16:42:29
* @Last Modified by:   gbk
* @Last Modified time: 2016-05-26 13:42:05
*/

'use strict';

var fs = require('fs');
var path = require('path');

var parseUrl = require('parseurl');
var send = require('send');

// simple version for express.static
// thanks to https://github.com/expressjs/serve-static
module.exports = function(root, opts) {
  opts = opts || {};
  opts.root = path.resolve(root);

  if (isDirectory(opts.root)) {

    // root must be a directory
    return function(req, res, next) {
      var forwardError = false;
      send(req, parseUrl(req).pathname, opts)
        .on('directory', function() {
          this.error(404);
        })
        .on('file', function() {
          forwardError = true;
        })
        .on('error', function(err) {
          if (forwardError || !(err.statusCode < 500)) {
            next(err);
            return;
          }
          next();
        })
        .pipe(res);
    }

  } else {

    // is not, do nothing
    return function (req, res, next) {
      next();
    };

  }
};

// test if the path is a directory
function isDirectory(file) {
  try {
    return fs.statSync(file).isDirectory();
  } catch (e) {
    return false;
  }
}
