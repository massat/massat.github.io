---
categories:
- mac
- php
- homebrew
comments: true
date: 2012-11-24T00:00:00Z
title: Mountain Lion にPHP開発環境をつくった
url: /blog/2012/11/24/setup-php-on-mountain-lion/
---

クリーンインストールしてからのPHP環境構築ログ。

<!--more-->

## 準備

ログインシェルをzshにしたりとかemacsいれたりとかいろいろやったけど、
PHP環境に関係ある話としては

* [Command Line Tools for Xcode](https://developer.apple.com/downloads/index.action) をインストール
* [Homebrew](http://mxcl.github.com/homebrew/) をインストール

くらい。

## パッケージインストール

レポジトリ追加して

``` sh
$ brew tap homebrew/dupes
$ brew tap josegonzalez/php
```

開発で使うあたりをつらつら追加

``` sh
$ brew install make
$ brew install httpd mysql memcached mongodb
```

PHP

``` sh
$ brew install php53 --with-mysql
$ brew install php53-memcache php53-mongo php53-redis
$ brew install phpsh
```

## 設定&起動

phpの設定ファイルは `/usr/local/etc/php/` あたり、
apacheの設定ファイルは `/usr/local/etc/apache2/` あたりにあるのでVirtualHostをよしなに設定する。

apacheは `/usr/local/sbin/apachectl` あたり、
mysqlは `/usr/local/bin/mysql.server` あたりで起動する。
