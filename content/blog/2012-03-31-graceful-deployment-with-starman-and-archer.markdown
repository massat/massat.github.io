---
categories:
- perl
- deploy
comments: true
date: 2012-03-31T00:00:00Z
title: StarmanとArcherで優雅にデプロイする話
url: /blog/2012/03/31/graceful-deployment-with-starman-and-archer/
---

[Starman](https://github.com/miyagawa/Starman)に対してリモートから[Archer](https://github.com/tokuhirom/Archer)でソースをデプロイしつつHUPを投げつけるという話。

構成は例えば以下のような感じで、`admin`から`app*`にばらまく感じ。

```
[admin] --+--> [app01]
          |
          +--> [app02]
```

<!--more-->

Starmanの再起動
---------------

[StarmanのREADME](https://github.com/miyagawa/Starman/blob/master/README)によれば、

> Supports "HUP" for graceful worker restarts, and "TTIN"/"TTOU" to
> dynamically increase or decrease the number of worker processes, as
> well as "QUIT" to gracefully shutdown the worker processes.

と書いてあって、HUPでGraceful Restartしてくれるとある。

ためしに

```sh
% plackup -r -s Starman --pid=/tmp/starman.pid

2012/03/29-19:53:12 Starman::Server (type Net::Server::PreFork) starting! pid(23802)

(中略)

Binding to TCP port 5000 on host *
Setting gid to "20 20 20 204 100 98 81 80 79 61 12 401 402"
Starman: Accepting connections at http://*:5000/
```

としてStarmanを起動して別のシェルプロセスから

```sh
% sudo kill -HUP `cat /tmp/starman.pid`
```

とすると、Starman側に

```sh
Sending children hup signal during HUP on prefork server
2012/03/29-19:54:12 Server closing!
```

と表示される。

ちなみにStarmanはRubyの[Unicorn](http://unicorn.bogomips.org/)ライクなものなのかなーと思っていたけど、

> The name Starman is taken from the song (*Star na Otoko*) by the
> Japanese rock band Unicorn (yes, Unicorn!). It's also known as a song by
> David Bowie, a power-up from Super Mario Brothers and a character from
> Earthbound, all of which I love.

とあって、 "Unicorn -> ユニコーン -> スターな男 -> Starman" ってことかしら。


Archerでのデプロイ
------------------

Archerでリモートホストから rsync でソースを投げた後、Starman にHUPを投げたい。
正直Archerはまだあまり使いかたがわかってない。

設定ファイルは[ここ](https://github.com/tokuhirom/Archer/blob/master/assets/kwalify/schema.yaml)とか[ここ](https://github.com/tokuhirom/Archer/blob/master/examples/config.yaml)とかよく見ておこうと思う。あとソースも。

今回は以下のような感じ。

```yml deploy.yml
global:
  work_dir: /path/to/work_dir
  dest_dir: /path/to/dest_dir
  assets_path: assets
  log:
    level: debug

tasks:
  init:
    - module: Confirm
      name: confirm
      config:
        msg: 'deploy ok? [y/n]'
  process:
    - module: Rsync
      name: rsync
      role: app
      config:
        user: app
        verbose: 1
        archive: 1
        compress: 1
        rsh: ssh
        update: 0
        delete: 1
        source: /path/to/source
        exclude:
          - .svn/
          - tmp/*
          - log/*
    - module: Exec::Remote
      name: restart
      role: app
      config:
        command: "-t 'sudo kill -HUP `cat /tmp/starman.pid`'"
projects:
  example:
    app:
      - app01
      - app02
```

tasks.process の

```yml
    - module: Exec::Remote
      name: restart
      role: app
      config:
        command: "-t 'sudo kill -HUP `cat /tmp/starman.pid`'"
```

で、リモートからSSHログインしてHUPを送ることをしている。
実際には

```sh
sudo -u app ssh app01 -t 'sudo kill -HUP `cat /tmp/starman.pid`'
```

って感じに展開される。
当然app*に対しては公開鍵認証設定するなどしてパスワードなしでSSHログインできるようにしておくのと、killとcatはsudoで実行できるようにしておく必要がある。

sshの`-t`オプションっていうのは知らなかったんだけど、

```
-t      Force pseudo-tty allocation.  This can be used to execute arbitrary screen-based programs on a remote machine, which can be very
        useful, e.g. when implementing menu services.  Multiple -t options force tty allocation, even if ssh has no local tty.
```

というもの。これがないと

```sh
sudo: sorry, you must have a tty to run sudo
```

と怒られるのを回避できる。

これで

```sh
archer.pl --config=deploy.yaml
```

って感じで実行すると、先ほどと同じようにapp*側のStarmanが再起動されるはず。


まとめ
------

StarmanとArcherで、デプロイからのGraceful Restartを構成した。

実運用する場合にはStarmanをdaemontoolsとかsupervisordとかで監視したりってのも出てくると思うけど、基本的には同じ話かと思う。
daemontoolsにはsvcってユーティリティでシグナルの送信ができるので、sudo killできる必要がなくなる。
supervisordはsupervisorctlに`restart`ってコマンドがあるんだけど、これがHUPを送るものなのかは確認していない。
