---
categories:
- mysql
comments: true
date: 2016-02-19T18:22:49Z
title: MySQLでテーブルが使用している容量を確認するSQL
url: /blog/2016/02/19/mysqldeteburugashi-yong-siteirurong-liang-woque-ren-surusql/
---

[データベースとテーブルのサイズを確認する方法 - ふってもハレても](http://d.hatena.ne.jp/sho-yamasaki/20120405/1333640589) より。

```sql
use databaseName;
select
table_name, engine, table_rows as tbl_rows, avg_row_length as rlen,
floor((data_length+index_length)/1024/1024) as allMB,  #総容量
floor((data_length)/1024/1024) as dMB,  #データ容量
floor((index_length)/1024/1024) as iMB   #インデックス容量
from information_schema.tables
where table_schema=database()
order by (data_length+index_length) desc;

+------------------------------+--------+----------+------+-------+------+------+
| table_name                | engine     | tbl_rows  | rlen | allMB | dMB | iMB |
+------------------------------+--------+----------+------+-------+------+------+
| table1                 | MyISAM   |   156382     | 3738 |   570 |  557 |   12 |
| table2                 | MyISAM   |   185280     | 1624 |   311 |  287 |   24 |
| table3                 | MyISAM   |   208823     |  394  |   103 |   78  |   24 |
+------------------------------+--------+----------+------+-------+------+------+
```
