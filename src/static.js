/*
* @Author: gbk
* @Date:   2016-03-28 16:42:29
* @Last Modified by:   gbk
* @Last Modified time: 2016-05-03 11:49:11
*/

'use strict';

var path = require('path');

var parseUrl = require('parseurl');
var send = require('send');

// simple version for express.static
// thanks to https://github.com/expressjs/serve-static
module.exports = function(root, opts) {
  opts = opts || {};
  opts.root = path.resolve(root);

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
  };
};
