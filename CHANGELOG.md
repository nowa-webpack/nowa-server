# Changelog

## 1.5.0 (2016-10-14)

* [feature] Use eval mode to build sourcemap.

## 1.4.1 (2016-09-27)

* [fix] babel-runtime do not support old IEs, so use es3ify-loader to transform babel-runtime.

> https://github.com/nowa-webpack/nowa/issues/22

## 1.4.0 (2016-09-27)

* [feature] Update version of babel plugins.
* [feature] Use es2015 internel loose mode.
* [feature] Use babel-runtime to support polyfill.

> https://github.com/nowa-webpack/nowa-build/issues/10

> https://github.com/nowa-webpack/nowa/issues/20

## 1.3.0 (2016-08-23)

* [feature] Add include option to support adding more include path for loader.

> https://github.com/nowa-webpack/nowa-build/issues/9

## 1.2.0 (2016-07-27)

* [feature] Ignore babelrc.
* [improve] Add cache directory for babel to speed up.

## 1.1.2 (2016-07-12)

* [fix] `--loose` argument do not take effect.

> https://github.com/nowa-webpack/nowa-server/issues/4

## 1.1.1 (2016-06-30)

* [fix] Can not find nowa plugin when nowa was locally installed.

> https://github.com/nowa-webpack/nowa/issues/6

## 1.1.0 (2016-06-27)

* [feature] Support varible replacement in historyApiFallback.

> https://github.com/nowa-webpack/nowa-server/issues/3

## 1.0.0 (2016-06-26)

* [feature] Add historyApiFallback.
* [feature] Add mockapi.

> https://github.com/nowa-webpack/nowa-server/issues/1

> https://github.com/nowa-webpack/nowa-server/issues/2
