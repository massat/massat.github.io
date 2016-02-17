## kamakura.go #2

### @massat

---

# 課題

`serf-hosts` を go で実装してみよう

---

# `serf-hosts`

* https://github.com/kentaro/serf-hosts
* [`serf`](https://www.serfdom.io/)のイベントを受け取って、hostsファイルのレコードを追加・削除してくれるスクリプト。
* レコードが重複したりするのでちょっとつらい
* 最近は `consulで`、っていうのよくみる

---
# `event-handlers`

https://www.serfdom.io/docs/agent/event-handlers.html

---

# loadmap

1. `serf` から、環境変数 `SERF_EVENT` で、イベントを受け取る
2. `serf` から、標準入力から、 ノードの情報を受け取る
  1. `\t` で区切ってパースして〜
3. `/etc/hosts` 読み込んで、エントリを取り込み、エントリを追加・削除
4. `/etc/hosts` を更新

## プログラマの習作に持ってこい

---

# 成果

1. `serf` から、環境変数 `SERF_EVENT` で、イベントを受け取る
2. `serf` から、標準入力から、 node の情報を受け取る
3. `/etc/hosts` 読み込んで、エントリを取り込み、エントリを追加・削除 <= イマココ
4. `/etc/hosts` を更新

`src/net/hosts.go` の実装参考にしてみよう。

---

# 感想
