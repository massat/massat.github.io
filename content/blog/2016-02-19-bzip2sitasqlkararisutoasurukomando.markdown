---
categories:
- mysql
- bzip2
- ops
comments: true
date: 2016-02-19T18:14:25Z
title: bzip2したSQLからリストアするコマンド
url: /blog/2016/02/19/bzip2sitasqlkararisutoasurukomando/
---

`mysqldump` したデータを `bzip2` で固めたアーカイブからリストアするコマンドメモ

```sh
$ bunzip2 < ./dump.sql.bz2 | mysql -u user -p database
```

という感じ。仕事では間で `sed` かましたりしてるので実際には

```sh
$ bunzip2 < ./dump.sql.bz2 | sed -f path/to/sed |  mysql -u user -p database
```

みたいにやっている。
