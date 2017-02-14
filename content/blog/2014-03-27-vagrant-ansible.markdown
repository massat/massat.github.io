---
categories:
- ansible
- vagrant
comments: true
date: 2014-03-27T00:00:00Z
title: ansibleの手習いをvagrantにてする
url: /blog/2014/03/27/vagrant-ansible/
---

ansibleがよさげなので[これ](http://docs.ansible.com/intro_getting_started.html)みながらvagrantとつなげてみる。

<!--more-->

## 準備

### vagrant

[このへん](http://docs.vagrantup.com/v2/getting-started/index.html)みて。
`homebrew-cask`と`brewfile`でいけるらしい。未来。

### ansible

```
➜  ~  brew install ansible
```
で済ませた。

## provisioningするホストの用意

vagrantで用意する。
`ubuntu 13.04`にした。

```sh
➜  ~  vagrant box add ubuntu13.04 http://cloud-images.ubuntu.com/vagrant/raring/current/raring-server-cloudimg-amd64-vagrant-disk1.box
➜  ~  mkdir -p ~/Workspace/ansible/
➜  ~  cd ~/Workspace/ansible
➜  ansible  vagrant init
```

Vagrantfile の`config.vm.box`でさっきのboxを指定して

```ruby
  # ...

  # Every Vagrant virtual environment requires a box to build off of.
  config.vm.box = "ubuntu13.04"

  # ...
```

手っ取り早く起動。

```sh
➜  ansible  vagrant up
Bringing machine 'default' up with 'virtualbox' provider...
==> default: Importing base box 'ubuntu13.04'...
==> default: Matching MAC address for NAT networking...
==> default: Setting the name of the VM: ansible_default_1395929701950_33564
==> default: Clearing any previously set forwarded ports...
==> default: Clearing any previously set network interfaces...
==> default: Preparing network interfaces based on configuration...
    default: Adapter 1: nat
==> default: Forwarding ports...
    default: 22 => 2222 (adapter 1)
==> default: Booting VM...
==> default: Waiting for machine to boot. This may take a few minutes...
    default: SSH address: 127.0.0.1:2222
    default: SSH username: vagrant
    default: SSH auth method: private key
    default: Error: Connection timeout. Retrying...
==> default: Machine booted and ready!
==> default: Checking for guest additions in VM...
    default: The guest additions on this VM do not match the installed version of
    default: VirtualBox! In most cases this is fine, but in rare cases it can
    default: prevent things such as shared folders from working properly. If you see
    default: shared folder errors, please make sure the guest additions within the
    default: virtual machine match the version of VirtualBox you have installed on
    default: your host and reload your VM.
    default:
    default: Guest Additions Version: 4.2.10
    default: VirtualBox Version: 4.3
==> default: Mounting shared folders...
    default: /vagrant => /Users/massat/Workspace/ansible
➜  ansible
```

## ansibleの設定

[これ](http://docs.ansible.com/intro_getting_started.html)にしたがって進む。

### inventry

ansibleが対象にするホストは`inventry`として指定するらしい。
詳しい書式は[このへん](http://docs.ansible.com/intro_inventory.html)。

上記で起動したホストを指定する。
さっきの起動ログに

```sh
default: SSH address: 127.0.0.1:2222
```

とあるので

```sh
➜  ansible  echo '127.0.0.1:2222' > hosts
```

した。

### ホストへssh接続

このホストは

```sh
➜  ansible  ssh vagrant@127.0.0.1 -p 2222 -i ~/.vagrant.d/insecure_private_key
```

でssh接続できるので、

```sh
➜  ansible  ansible all -m ping -i hosts -u vagrant --private-key=~/.vagrant.d/insecure_private_key
127.0.0.1 | success >> {
    "changed": false,
    "ping": "pong"
}
```

で接続できる。

### commandの実行

`-m`オプションは、ansibleのmoduleを指定するオプションで、デフォルトは`command`となる。
`command`で、ssh越しにコマンドを送りつけることができる。

```sh
➜  ansible  ansible all -a '/bin/cat /etc/hostname'  -i hosts -u vagrant --private-key=~/.vagrant.d/insecure_private_key --sudo
127.0.0.1 | success | rc=0 >>
vagrant-ubuntu-raring-64
```

なるほどねー。
