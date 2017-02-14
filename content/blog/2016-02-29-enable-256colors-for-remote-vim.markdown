---
categories:
- vim
comments: true
date: 2016-02-29T11:23:58Z
title: リモートサーバーのvimを256色表示で使えるようにした
url: /blog/2016/02/29/enable-256colors-for-remote-vim/
---

色気を出して、colorschemeに`jellybeans`を[使うようにした。](https://github.com/massat/.vim/commit/33924c5459033557fc40e093a680f21da0ba6e4f)
ローカルではいい感じにかっちょよく表示されるようになったんだけど、リモートの開発サーバー(ubuntu12.04)上だと色数が足りなくて逆に見にくくなってしまった。

[ここ](https://emerg3nc3.wordpress.com/2012/07/28/full-256-color-support-for-vim-andor-xterm-on-ubuntu-12-04/)の通り、

* `t_Co=256`を[設定する](https://github.com/massat/.vim/commit/413ddbd3f0290e1b072419f22b3b4bfb9fe1b8cd)
* `.zshrc` に `export TERM="xterm-256color"` を設定する

ことで、表示が綺麗になった。

[![https://gyazo.com/56e413e2f530344a77d0d0abbfe641e9](https://i.gyazo.com/56e413e2f530344a77d0d0abbfe641e9.png)](https://gyazo.com/56e413e2f530344a77d0d0abbfe641e9)
