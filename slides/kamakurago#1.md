# kamakura.go #1

---

## やってたこと

* [A Tour of Go](https://tour.golang.org)の写経
  * 1section毎、写経する。
  * 書く中で、書き方や挙動で疑問に思ったとことか、 `gore` 上でいじってみたり `Dash` でドキュメントみたり・・・
  * [成果](https://github.com/massat/a-tour-of-go/compare/d2d50f8985d7af9dd0fcb2bac674daaac6df2e99...988469022252dd0e0fc82bd8397eb4f131c09fbe) まだまだ先長いなぁ・・・
* すすめるにあたってローカルの環境ちょっといじったり。。。

---

## ローカルGo環境について

---

## Mac環境をAnsibleでつくってる

* https://github.com/massat/bootstrap
  * [goのrole](https://github.com/massat/bootstrap/blob/master/roles/go/tasks/main.yml)

---

## いれてるもの

* `peco`
* `gh-open`
* `ghq`
* `godoc`
* `gocode`
* `gore` <- NEW!

---

## `peco × ghq` 便利すぎですね！

```
function peco-ghq-cd () {
    local selected_dir=$(ghq list --full-path | peco --query "$LBUFFER")
    if [ -n "$selected_dir" ]; then
        BUFFER="cd ${selected_dir}"
        zle accept-line
    fi
    zle clear-screen
}
zle -N peco-ghq-cd
bindkey '^]' peco-ghq-cd
```

---

# Sublime Text2 + GoSublime

http://qiita.com/makoto_kw/items/5891f857cf4795b6955f

* syntax highlight
* compileエラー指摘
* 保存時gofmt

---

## おすすめのツール、環境があったら教えてください

---

# kamakura.go やってみて

- もくもくってこんな感じ
- どうでした？ (懇親会で)
- やりたいこと？（懇親会で）
