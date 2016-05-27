/*
* @Author: gbk <ck0123456@gmail.com>
* @Date:   2016-04-21 17:34:00
* @Last Modified by:   gbk
* @Last Modified time: 2016-05-27 23:13:43
*/

'use strict';

var url = require('url');
var https = require('https');

var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var chalk = require('chalk');
var ip = require('ip');
var portscanner = require('portscanner');
var httpProxy = require('express-http-proxy');

var util = require('./util');
var loader = require('./loader');
var favicon = require('./favicon');
var serveStatic = require('./static');
var pkg = require('../package.json');

// plugin defination
module.exports = {

  description: pkg.description,

  options: [
    [ '-s, --src <dir>', 'source directory, default to `src`', 'src' ],
    [ '-d, --dist <dir>', 'build directory, default to `dist`', 'dist' ],
    [ '-p, --port <port>', 'server port, default to `3000`', 3000 ],
    [ '-e  --entry <file>', 'app entry, default to `app/app.js`', 'app/app.js' ],
    [ '    --pages', 'add multi-page entries' ],
    [ '    --vars', 'runtime context varibles' ],
    [ '    --buildvars', 'build varibles' ],
    [ '-r, --proxy', 'dev proxy hostname or mappings' ],
    [ '-k, --keepcss', 'keep flush css files' ],
    [ '-l, --lazyload', 'disable hot reload' ],
    [ '-h, --https', 'start https server' ],
    [ '    --externals', 'webpack external varibles' ],
    [ '-o, --open', 'open url in default browser' ],
    [ '    --loose', 'use babel es2015 loose mode to transform codes' ]
  ],

  action: function(options) {

    // options
    var src = options.src;
    var dist = options.dist;
    var port = parseInt(options.port);
    var entry = options.entry;
    var pages = options.pages;
    var vars = options.vars;
    var buildvars = options.buildvars;
    var proxy = options.proxy;
    var keepcss = options.keepcss;
    var lazyload = options.lazyload;
    var httpsOpt = options.https;
    var loose = options.loose;
    var open = options.open;
    var externals = options.externals || {
      'react': 'window.React',
      'react-dom': 'window.ReactDOM || window.React'
    };

    // enable es2015 loose mode
    if (loose) {

      // modify es2015 presets, add `loose: true` option
      var es2015Plugins = require(util.babel('preset', 'es2015')).plugins;
      for (var i = 0; i < es2015Plugins.length; i++) {
        if (Array.isArray(es2015Plugins[i])) {
          es2015Plugins[i][1].loose = true;
        } else {
          es2015Plugins[i] = [
            es2015Plugins[i],
            { loose: true }
          ];
        }
      }
    }

    // entries
    var entries = {
      app: util.makeEntry(lazyload, src, entry)
    };

    // plugins
    var plugins = [
      new webpack.NoErrorsPlugin(),
      new webpack.SourceMapDevToolPlugin({
        columns: false
      })
    ];
    vars && plugins.push(new webpack.DefinePlugin(util.parseVars(vars)));
    !lazyload && plugins.push(new webpack.HotModuleReplacementPlugin());

    // compiler
    var compiler = preProcess({
      entry: pages ? util.makePageEntries(lazyload, src, entries) : entries,
      output: {
        path: util.cwdPath(dist),
        filename: '[name]' + util.suffixByVars(vars, buildvars) + '.js',
        publicPath: '/'
      },
      plugins: plugins,
      resolve: {
        modulesDirectories: [
          'node_modules',
          util.relPath('..', 'node_modules')
        ],
        alias: {
          i18n: util.cwdPath(src, 'i18n')
        }
      },
      resolveLoader: {
        modulesDirectories: [
          util.relPath('..', 'node_modules'),
          'node_modules'
        ]
      },
      externals: externals,
      module: {
        loaders: loader(options)
      }
    });
    var webpackCompiler = webpack(compiler);

    // dev server
    var app = express();

    // some pre-process
    app.use(function(req, res, next) {

      // deal with proxied request
      if (req.url.indexOf('/') !== 0) {
        req.url = '/' + req.url.split('/').slice(3).join('/');
      }

      // exclude css request with entry name
      if (!keepcss) {
        var match = /\/([^\/]+)\.css$/.exec(req.url);
        if (match && (match[1] in entries)) {
          res.setHeader('Content-Type', 'text/css; charset=utf-8');
          return res.end();
        }
      }

      // support cors
      res.setHeader('Access-Control-Allow-Origin', '*');

      next();
    });

    // favicon
    app.use(favicon(util.cwdPath('favicon.ico')));

    // dev middleware
    var devMiddlewareOpts = {
      publicPath: '/',
      stats: {
        chunks: false
      }
    };
    var devMiddleware = webpackDevMiddleware(webpackCompiler, devMiddlewareOpts);
    if (pages) {
      app.use(function() { // for hot replace middleware when multi-entries changed
        devMiddleware.apply(this, arguments);
      });
    } else {
      app.use(devMiddleware);
    }

    // hot middleware
    if (!lazyload) {
      var hotMiddleware = webpackHotMiddleware(webpackCompiler);
      if (pages) {
        app.use(function() { // for hot replace middleware when multi-entries changed
          hotMiddleware.apply(this, arguments);
        });
      } else {
        app.use(hotMiddleware);
      }
    }

    // static server
    app.use(serveStatic('html'));
    app.use(serveStatic(util.cwdPath(src, 'lib')));
    app.use(serveStatic(dist));
    app.use(serveStatic('.'));

    // http proxy
    var httpProxyOpts =  {
      forwardPath: function(req) {
        return url.parse(req.originalUrl).path;
      }
    };
    if (typeof proxy === 'string') {
      app.use('*', httpProxy(proxy, httpProxyOpts));
    } else if (typeof proxy === 'object') {
      for (var pattern in proxy) {
        app.use(pattern, httpProxy(proxy[pattern], httpProxyOpts));
      }
    }

    // find a usable ip address
    var ipAddr = ip.address();
    portscanner.findAPortNotInUse(port, port + 10, ipAddr, function(err, aPort) {
      if (err || !aPort) {
        console.error('Port ' + port + ' in use. exit now!');
        return process.exit(1);
      }
      if (aPort != port) {
        console.log('Port ' + port + ' in use, Change to ' + aPort);
        port = aPort;
      }

      // create https server
      if (httpsOpt) {

        app = https.createServer(util.makeKeyCert(httpsOpt), app);
      }

      // listen for dev server
      app.listen(port, function(err) {
        if (err) {
          console.log(err);
        }
        var address = (httpsOpt ? 'https' : 'http') + '://' + ipAddr + ':' + port;
        console.log('Listening at ' + chalk.green.bold(address));

        // open url in default browser
        if (open) {
          util.open(address);
        }
      });
    });

    if (pages) {

      // watching dir changes to update entry
      util.watch(util.cwdPath(src, 'pages'), function() {
        var newEntries = {
          app: util.makeEntry(lazyload, src, entry)
        };
        util.makePageEntries(lazyload, src, newEntries);
        if (JSON.stringify(newEntries) !== JSON.stringify(compiler.entry)) {
          compiler.entry = newEntries;
          webpackCompiler = webpack(compiler);
          devMiddleware = webpackDevMiddleware(webpackCompiler, devMiddlewareOpts);
          if (!lazyload) {
            hotMiddleware = webpackHotMiddleware(webpackCompiler);
          }
        }
      });
    }
  }
};

// compiler pre-process
function preProcess(config) {
  var newConfig;
  try {
    newConfig = require(util.cwdPath('webpack.config.js'))(config);
  } catch (e) {
  }
  return newConfig || config;
}
