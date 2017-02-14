---
categories:
- python
comments: true
date: 2016-03-21T23:21:04Z
title: pythonのデフォルト引数の挙動には気をつけよう
url: /blog/2016/03/21/be-careful-of-default-args/
---

pythonのデフォルト引数の挙動は勘違いしそうで怖いので気をつけたい。

```sh
➜  ~ python
Python 2.7.11 (default, Feb  2 2016, 21:44:54)
[GCC 4.2.1 Compatible Apple LLVM 7.0.2 (clang-700.1.81)] on darwin
Type "help", "copyright", "credits" or "license" for more information.
>>> def func(arg={}):
...     return arg
...
>>> foo = func()
>>> foo['a'] = 'foo'
>>>
>>> bar = func()
>>> bar['b'] = 'bar'
>>> print(foo)
{'a': 'foo', 'b': 'bar'}
>>> print(bar)
{'a': 'foo', 'b': 'bar'}
```

デフォルト引数はモジュールロード時の1度だけしか評価されないために、呼び出しの間で共有されている。
なんでこんな仕様にしたんだろうな・・・。
