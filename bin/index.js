#!/usr/bin/env node

var path = require('path');

var program = require('commander');

var pluginDef = require('../src');
var pkg = require('../package.json');

var plugin = program.command('start');

if (pluginDef.description) {
  plugin.description(pluginDef.description);
}

// set options
if (pluginDef.options) {
  pluginDef.options.forEach(function(optArgs) {
    plugin.option.apply(plugin, optArgs);
  });
}

// set action
if (pluginDef.action) {

  // default options in abc.json
  var defauleOpts = loadDefaultOpts(path.join(process.cwd(), 'abc.json'));
  plugin.action(function(cmd, opts) {
    if (cmd instanceof program.Command) {
      opts = cmd;
      cmd = '';
    }
    opts = opts || {};

    // abc.json options override
    for (var key in defauleOpts) {
      if (typeof opts[key] === 'undefined') {
        opts[key] = defauleOpts[key];
      }
    }

    // run plugin action
    if (cmd) {
      pluginDef.action.call(this, cmd, opts);
    } else {
      pluginDef.action.call(this, opts);
    }
  });
}

// parse argvs
program.parse(process.argv);

// load default options
function loadDefaultOpts(configFile) {
  try {
    return require(configFile).options;
  } catch (e) {
    return {};
  }
}
