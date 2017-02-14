---
categories:
- mac
- ansible
- homebrew
- homebrew-cask
comments: true
date: 2014-07-08T22:02:36Z
title: bootstrap-my-mac
url: /blog/2014/07/08/bootstrap-my-mac/
---

<blockquote class="twitter-tweet" lang="ja"><p>おやおや？ [pic] — <a href="https://t.co/N0BbShnkAH">https://t.co/N0BbShnkAH</a></p>&mdash; 平井雅人 (@massat) <a href="https://twitter.com/massat/statuses/470715846495444992">2014, 5月 25</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

というわけで Macbook Pro を新調して、新しい環境構築をすることとなった。

旧MBPはたしかMac2代目?で、2010年から使っていて、はじめは `port` とか使ってたように思うし、`MAMP` とかもつかってたかもしれない。
そのうちに `Homebrew` が現れて、へー美味しいの？なんて使い始めて、へー `rbenv` ? なんていってrubyも突っ込んで。
そのうちに、あれPATHが通ってないとかgemが動かないとか。あーなんか整理できていないなーなんて思いながらも、
基本1つのプロダクトに集中して携わっていてworkしてるのでよしとしていた感があった。

一方で、 `chef` だったり `puppet` だったり `serverspec` だったり。
環境をコードで記述するっていうことが普通に行われるようになった今。
新しい愛機をセットアップするにあたっては、この環境をよりcleanでポータブルなものにしようと思ってしこしこやっているのでした。

<!--more-->

[massat/bootstrap](https://github.com/massat/bootstrap)

最初は `Brewfile` を書いてたんだけど、そのうち `Homebrew` で賄いきれなくなって、
[ansible](http://www.ansible.com/home) でまとめてる。

macを新しく買ってきて、

```sh
$ xcode-select --install
```

で command line tools を入れて、

```sh
$ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
```

で Homebrewを入れて

```sh
$ brew install ansible
```

`ansible` をインストール。

```sh
$ git clone git@github.com:massat/bootstrap.git
$ cd bootstrap
```

play-book のレポジトリを clone して、

```sh
$ ansible-playbook -i inventory -K playbook.yml
```

で環境ができあがる、つもり。
なんだけど、もはや自分の環境では何度も実行してるので、cleanな環境に適用できるのか自信なし。

2014/7/8 現在、

- Homebrew
- mosh
- the_silver_searcher
- oh-my-zsh
- autojump
- peco
- ghq
- gh-open
- rbenv
- php
- go
- vagrant

などなど。
捗るツールが入る、つもり。
自分の環境では動いてる。

p-r 歓迎。

(7/9追記)

homebrew-cask で以下のも入れてる

- alfred
- coteditor
- evernote
- google-chrome
- google-japanese-ime
- hipchat
- hoster
- iterm2
- libreoffice
- mysqlworkbench
- skype
- slack
- sophos-anti-virus-home-edition
- sublime-text
- virtualbox
- yorufukurou
