---
categories:
- aws
- mysql
- q4m
comments: true
date: 2012-04-08T00:00:00Z
title: Amazon Linux AMIにQ4Mをインストール
url: /blog/2012/04/08/install-q4m-on-amazon-linux-ami/
---

今運用しているサービスでそろそろジョブキューが必要となりそう。
インストール手順を確認がてら、EC2にQ4Mをインストールしてみる。
Q4Mはソースからではなく、ビルド済のパッケージを使う。

<!--more-->

EC2でmicroインスタンスたちあげて、Q4Mをインストール。
AMIにはAmazon Linux AMIを使用した。
このエントリ時点のAMIのバージョンは`amzn-ami-pv-2012.03.1.x86_64-ebs (ami-e47acbe5)`。

MySQLのインストール
-------------------

Officialのrpmをつかってインストール。
現在配布されている最新のビルド済Q4MはMySQL5.1.55向けのもの。
MySQLサイトからRPMをダウンロードしてインストール。

``` sh
# wget http://downloads.mysql.com/archives/mysql-5.1/MySQL-server-5.1.55-1.glibc23.x86_64.rpm
# wget http://downloads.mysql.com/archives/mysql-5.1/MySQL-client-5.1.55-1.glibc23.x86_64.rpm
# rpm -ivh MySQL-server-5.1.55-1.glibc23.x86_64.rpm
# rpm -ivh MySQL-client-5.1.55-1.glibc23.x86_64.rpm
```

Q4Mのインストール
-----------------

MySQLが`--with-fast-mutexes`オプションを使ってコンパイルされているかどうかで使用するQ4Mのパッケージが変わる。

``` sh
# cat `which mysqlbug` | grep CONFIGURE_LINE
CONFIGURE_LINE="./configure  '--with-mysqld-ldflags=-static' '--with-client-ldflags=-static' '--enable-assembler' '--enable-local-infile' '--with-fast-mutexes' '--with-mysqld-user=mysql' '--with-unix-socket-path=/var/lib/mysql/mysql.sock' '--with-pic' '--prefix=/' '--with-extra-charsets=complex' '--with-ssl' '--exec-prefix=/usr' '--libexecdir=/usr/sbin' '--libdir=/usr/lib64' '--sysconfdir=/etc' '--datadir=/usr/share' '--localstatedir=/var/lib/mysql' '--infodir=/usr/share/info' '--includedir=/usr/include' '--mandir=/usr/share/man' '--enable-thread-safe-client' '--with-comment=MySQL Community Server (GPL)' '--with-readline' '--with-zlib-dir=bundled' '--without-plugin-ndbcluster' '--with-plugin-innobase' '--without-plugin-innodb_plugin' '--with-plugin-partition' '--with-plugin-csv' '--with-plugin-archive' '--with-plugin-blackhole' '--with-plugin-federated' '--without-plugin-daemon_example' '--without-plugin-ftexample' '--with-embedded-server' '--with-big-tables' '--enable-shared' 'CC=gcc' 'CFLAGS=-O2 -g -pipe' 'LDFLAGS=' 'CXX=gcc' 'CXXFLAGS=-O2 -g -pipe -felide-constructors -fno-exceptions -fno-rtti '"
`test -n "$CONFIGURE_LINE"  && echo "Configure command: $CONFIGURE_LINE"`
```

コンパイルオプションに`--with-fast-mutexes`があるので、それ用のパッケージをDLしてインストールする。

``` sh
# wget http://q4m.kazuhooku.com/dist/mysql-5.1.55-linux-x86_64-glibc23-with-fast-mutexes-q4m-0.9.5.tar.gz
# tar xzf mysql-5.1.55-linux-x86_64-glibc23-with-fast-mutexes-q4m-0.9.5.tar.gz
# cd q4m-0.9.5-linux-unknown/
# cp support-files/q4m-forward /usr/bin/
# cp libqueue_engine.so /usr/lib64/mysql/plugin/
# mysql < support-files/install.sql
```

動作確認
--------

``` sh
# mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 3
Server version: 5.1.55 MySQL Community Server (GPL)

Copyright (c) 2000, 2010, Oracle and/or its affiliates. All rights reserved.
This software comes with ABSOLUTELY NO WARRANTY. This is free software,
and you are welcome to modify and redistribute it under the GPL v2 license

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show engines;
+------------+---------+----------------------------------------------------------------+--------------+------+------------+
| Engine     | Support | Comment                                                        | Transactions | XA   | Savepoints |
+------------+---------+----------------------------------------------------------------+--------------+------+------------+
| InnoDB     | YES     | Supports transactions, row-level locking, and foreign keys     | YES          | YES  | YES        |
| MRG_MYISAM | YES     | Collection of identical MyISAM tables                          | NO           | NO   | NO         |
| QUEUE      | YES     | Queue storage engine for MySQL                                 | NO           | NO   | NO         |
| CSV        | YES     | CSV storage engine                                             | NO           | NO   | NO         |
| MEMORY     | YES     | Hash based, stored in memory, useful for temporary tables      | NO           | NO   | NO         |
| FEDERATED  | NO      | Federated MySQL storage engine                                 | NULL         | NULL | NULL       |
| ARCHIVE    | YES     | Archive storage engine                                         | NO           | NO   | NO         |
| BLACKHOLE  | YES     | /dev/null storage engine (anything you write to it disappears) | NO           | NO   | NO         |
| MyISAM     | DEFAULT | Default engine as of MySQL 3.23 with great performance         | NO           | NO   | NO         |
+------------+---------+----------------------------------------------------------------+--------------+------+------------+
9 rows in set (0.00 sec)
```

`QUEUE`エンジンが確認できた。

まとめ
------

とりあえずインストールだけ。
worker書いたりはまた後日。Rubyで書くつもり。
