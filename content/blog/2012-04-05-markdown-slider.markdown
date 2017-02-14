---
categories:
- ruby
- markdown
comments: true
date: 2012-04-05T00:00:00Z
title: markdownからHTMLスライドをつくるgemを書いた
url: /blog/2012/04/05/markdown-slider/
---

カンタンな文書を書くのに便利なmarkdown。
このブログもエントリはmarkdownで書いていて、今後もドキュメントはなるべくmarkdownにしたいなと。

んでRubyをさわってみたくて、試しにと思ってmarkdownからHTMLスライドを作るgemを書いた。

<!--more-->

markdown_slider
---------------

[markdown_slider](https://github.com/massat/markdown_slider)

理想は [GitHub Flavored Markdown](http://github.github.com/github-flavored-markdown/) ちっくに書けて、そっからイケてるスライドを生成できるツール。

なんだけど、完成度はまだまだ。

markdownパーサーには [redcarpet](https://github.com/tanoku/redcarpet)、生成するHTMLは[html5slides](http://code.google.com/p/html5slides/)をちょっといじったものを使ってる。

### インストール

gemコマンドでインストール。

``` sh
$ gem install markdown_slider
```

### 使いかた

markdownを書いて

    プレゼンタイトル
    =============

    セクションタイトル
    ---------------

    ### スライドタイトル

    あいうえお

    ### スライドタイトル

    ``` ruby
    STDOUT.puts 'Hello, world!'
    ```

`md-slider`コマンドでスライド化

``` sh
$ md-slider path/to/markdown > path/to/slide.html
```

すると、JavascriptとCSSも一体になったHTMLができあがる。

上の例のmarkdownからスライド生成をすると、[こちら](/slides/markdown_slider-sample1.html)のようになる。
ブログエントリをそのままスライドに！とはいかなくて、ブログエントリをそのまま `md-slider` すると[こんな感じ](/slides/markdown_slider-sample2.html)になってしまう。
ブログエントリそのままーの場合は、Jekyllのプラグインとかにしないとだめそう。


### まとめ

そもそもはRubyが触りたかった。Perlでは苦しんだけど、Ruby結構すんなり書けた。
できあがるスライドがちょっと使い勝手悪いので、html5slidesじゃないガワにしようかなーと思っている。
てか、CSS/JS力が足りないだけか。そのうちガサッと変えちゃうかも。impress.jsとか？

