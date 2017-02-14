---
categories:
- vim
comments: true
date: 2016-03-04T09:08:05Z
title: インサートモードで覚えたTIPS
url: /blog/2016/03/04/vim-tips-for-insert-mode/
---

[実践VIM](http://www.amazon.co.jp/gp/product/4048916599/ref=as_li_qf_sp_asin_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=4048916599&linkCode=as2&tag=massat02-22) より。

## インサートモードでの修正

`<Backspace>` だけでなく、

* `<C-h>`: 直前の1文字削除
* `<C-w>`: 直前の1単語削除
* `<C-u>`: 行頭まで削除

というアプローチもある。これはVIM固有のものではなくshell上でも使えるキーバインドだった。知らなかった。

## 挿入ノーマルモード

インサートモードから`<C-o>`を入力することで、`挿入ノーマルモード`という状態になる。
ノーマルモードで1コマンドだけを受けつけて、インサートモードに復帰するというもの。
紹介されている

* `<C-o>zz`: 画面を再描画して、現在の行を中央にする

は使えそう。

インサートモード中に使えるコマンドをほとんど知らない。`i_CTRL_` というプレフィックスでヘルプがひけるが非常にたくさんのことができそうである。

