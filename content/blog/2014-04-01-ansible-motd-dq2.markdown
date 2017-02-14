---
categories:
- ansible
comments: true
date: 2014-04-01T21:53:02Z
title: ansible-motd-dq2
url: /blog/2014/04/01/ansible-motd-dq2/
---

* *2014/4/2 ansible-galaxyの推奨する仕様に修正 commit: [c8058f3](https://github.com/massat/ansible-motd-dq2/commit/c8058f36a1c0ab61f412e684f42cc0082760627b)*

ansibleでsshログインしたときにドラクエのキャラクターが表示されるplaybookを書いた。

[ansible-motd-dq2](https://galaxy.ansible.com/list#/roles/685)

ネタ元は[こちら](http://qiita.com/makocchi/items/5549c41526d6a6cabab1)

<!--more-->

## Get started

ansible-galaxy からは、

```sh
$ ansible-galaxy install massat.ansible-motd-dq2
```

でインストールでき、`massat.ansible-motd-dq2`のrole名で以下の感じで利用可能。

```yml example.yml
- hosts: example
  roles:
  - { role: massat.ansible-motd-dq2, motd_dq2_figure: slime-beth }
```

```sh
$ ansible-playbook example.yml -i path/to/your-inventry
```

また、githubからcloneするとVagrantfileが同梱してるので、`vagrant`が入っていれば手元ですぐ確認ができる。

```sh
$ vagrant up
$ ansible-playbook example.yml -i example_inventry
$ ssh vagrant@127.0.0.1 -p 2222 -i ~/.vagrant.d/insecure_private_key
```

![](/images/posts/1__vagrant_vagrant-ubuntu-raring-64_____ssh_.png)

## 表示できるキャラクター

* slime
* slime-beth
* metal-slime
* bubble-slime
* hagure-metal
* slime-allstar
* dq2-lorasia
* dq2-samaltria
* dq2-moonbrooke
* dq2-allstar
* dq2-allstar_half

キャラクターはplaybookの外部変数`motd_dq2_figure`で指定できる。デフォルトは`slime`。

ローレシアの王子は

```sh
$ ansible-playbook example.yml -i example_inventry --extra-vars "motd_dq2_figure=dq2-lorasia"
```

で表示できる。

![](/images/posts/2__vagrant_vagrant-ubuntu-raring-64_____ssh_.png)

