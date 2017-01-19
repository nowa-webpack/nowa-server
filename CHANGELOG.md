# Changelog

## 1.10.0 (2017-01-19)

* [feature] Support html injection.
* [feature] Add host option to support custom host.
* [feature] Add TypeScript support.

> https://github.com/nowa-webpack/nowa-server/issues/14

> https://github.com/nowa-webpack/nowa-server/pull/7

> https://github.com/nowa-webpack/nowa-server/pull/15

## 1.9.1 (2017-01-17)

* [fix] Fix loader found error issue.

> https://github.com/nowa-webpack/nowa-server/issues/11

## 1.9.0 (2016-12-26)

* [fix] Fix root dependency mismatch bug.

> https://github.com/nowa-webpack/nowa/issues/30

## 1.8.3 (2016-12-22)

* [fix] Update less version.

## 1.8.2 (2016-12-22)

* [fix] Update stylus-loader version for supporting Nodejs 6+.

## 1.8.1 (2016-12-13)

* [fix] Fix alias bug.

## 1.8.0 (2016-12-11)

* [feature] Add alias option for module path alias defination.

> https://github.com/nowa-webpack/nowa-server/issues/10

## 1.7.0 (2016-11-22)

* [feature] Add jsx extension support.

> https://github.com/nowa-webpack/nowa-server/pull/9

## 1.6.1 (2016-11-17)

* [fix] Add missing babel-runtime for non-lazyload mode.

> https://github.com/nowa-webpack/nowa-server/issues/8

## 1.6.0 (2016-10-23)

* [feature] Support font files(woff,woff2,ttf,otf).

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
