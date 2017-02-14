---
categories:
- aws
- checkinstall
comments: true
date: 2013-02-16T00:00:00Z
title: 64bit版Amazon AMIにcheckinstallをインストールする
url: /blog/2013/02/16/install-checkinstall-on-amazon-ami-64bit/
---

64bit環境でのcheckinstallのインストール手順をすぐ忘れるのでメモ

<!--more-->

準備
====

```sh
# yum -y install git make gettext gcc rpm-build
# cd /usr/local/src/
# git clone http://checkinstall.izto.org/checkinstall.git
# cd checkinstall/
```

64bit向けにpatchをあてる
========================

[これらのpatch](https://gist.github.com/massat/4967004)をあてる

```sh
# curl https://gist.github.com/massat/4967004/raw/0a485150b270cb9e9397d1040963a627a86436e2/Makefile.patch | patch -u Makefile
# curl https://gist.github.com/massat/4967004/raw/2e447f2a7519337ca8d15a80e0bad31871b39eb7/checkinstallrc-dist.patch | patch -u checkinstallrc-dist
# curl https://gist.github.com/massat/4967004/raw/bb87f7ee31d0758e5cec9c8d430215739428ecc1/installwatch+Makefile.patch | patch -u installwatch/Makefile
```

checkinstallをRPM化
===================

```sh
# mkdir -p ~/rpmbuild/SOURCES
# make
# make install
# checkinstall
```

いくつか質問される。パッケージを選ぶ質問には"R"(rpm)を入力。その他はReturnのみでOK。

```sh
**********************************************************************

 Done. The new package has been saved to

 /root/rpmbuild/RPMS/x86_64/checkinstall-20130216-1.x86_64.rpm
 You can install it in your system anytime using:

       rpm -i checkinstall-20130216-1.x86_64.rpm

**********************************************************************

# rpm -ivh /root/rpmbuild/RPMS/x86_64/checkinstall-20130216-1.x86_64.rpm
```

インストールを確認

```sh
# rpm -qi checkinstall
Name        : checkinstall                 Relocations: (not relocatable)
Version     : 20130216                          Vendor: (none)
Release     : 1                             Build Date: Sat 16 Feb 2013 02:13:02 PM UTC
Install Date: Sat 16 Feb 2013 02:18:34 PM UTC      Build Host: ip-10-152-103-196.ap-northeast-1.compute.internal
Group       : Applications/System           Source RPM: checkinstall-20130216-1.src.rpm
Size        : 453850                           License: GPL
Signature   : (none)
Packager    : checkinstall-1.6.3
Summary     : CheckInstall installations tracker, version 1.6.2
Description :
CheckInstall installations tracker, version 1.6.2

CheckInstall  keeps  track of all the files created  or
modified  by your installation  script  ("make install"
"make install_modules",  "setup",   etc),   builds    a
standard   binary   package and  installs  it  in  your
system giving you the ability to uninstall it with your
distribution's  standard package management  utilities.
```
