---
date: 2017-02-15T15:15:28+09:00
title: Docker、docker-composeで開発環境作っていく
categories:
  - docker
  - docker-compose
  - ruby
---

簡単なRubyアプリケーションの開発環境を docker-compose を使って作ってみる。
そのうちCI環境やProduction環境まで同一のDockerイメージを利用した構成にまで発展していく予定。

<!--more-->

## お題

Rubyで書かれたWebアプリケーションの開発環境。
シンプルに sinatra でやってみる。

実際の成果物は[ここ](https://github.com/massat/rubyapp-on-docker/)にある。

## Rubyで書かれたWebアプリケーション

特にRubyでWebアプリケーションを書くことに慣れてるわけではないので悪しからず。
まずはRackに載せるアプリケーションとして、至極簡単なアプリケーションを[書いた](https://github.com/massat/rubyapp-on-docker/commit/259d0af08486aabf4bcd8704dc0ed8470387753c)。

```
➜  rubyapp-on-docker git:(master) ✗ tree
.
├── Gemfile
├── Gemfile.lock
├── app.rb
└── config.ru
```

### Gemfile

```
source "https://rubygems.org"

ruby '2.4.0'

gem 'sinatra'
```

### app.rb

```
require 'sinatra'

class App < Sinatra::Base

  get '/' do
    'Hello world!'
  end

end
```

### config.ru

```
require './app'

run App
```

この状態で `bundle && bundle exec rackup` とすれば sinatra が入ってサーバーが立ち上がる。

<script type="text/javascript" src="https://asciinema.org/a/9nzgtie1973ftvzknf70gkmsl.js" id="asciicast-9nzgtie1973ftvzknf70gkmsl" async></script>

## Dockernize

次に、Dockerfileを[書いて](https://github.com/massat/rubyapp-on-docker/commit/7346070a6d9633182ac3e642d1aac3bf7665f089)、上のアプリケーションをDockerに載せてみる

```
➜  rubyapp-on-docker git:(master) tree
.
├── Dockerfile
├── Gemfile
├── Gemfile.lock
├── app.rb
└── config.ru

0 directories, 5 files
```

### Dockerfile

```
FROM ruby:2.4.0-alpine

RUN mkdir /app
WORKDIR /app

ADD Gemfile /app
RUN bundle install
ADD . /app

EXPOSE 9292
ENTRYPOINT [ "bundle", "exec" ]
CMD [ "rackup", "--host", "0.0.0.0" ]
```

この状態で

```
docker build -t rubyapp-on-docker .
docker run --rm -p 9292:9292 rubyapp-on-docker
```

すると、コンテナ上でアプリケーションが動く。

<script type="text/javascript" src="https://asciinema.org/a/6nz48bbytkd7mth7cdxqr41qb.js" id="asciicast-6nz48bbytkd7mth7cdxqr41qb" async></script>

## Docker Compose

Dockerを使った開発環境を考えるのであれば、実際的にはデータベースなりなんなりのコンポーネントも欲しくなる。
Docker Composeを[インストール](https://docs.docker.com/compose/install/)して、その辺りを解決してみる。

Docker Compose を使ってMySQLを構成するための docker-compose.yml と初期化のためのSQLを[書いた](https://github.com/massat/rubyapp-on-docker/commit/cc20b6a82c3d9a718ba732fd6d9c734912e17ccd)。

```
➜  rubyapp-on-docker git:(master) tree
.
├── Dockerfile
├── Gemfile
├── Gemfile.lock
├── app.rb
├── config.ru
├── db
│   ├── 00_schema.sql
│   └── 01_book.sql
└── docker-compose.yml

1 directory, 8 files
```

### docker-compose.yml

```
version: '2.1'
services:
  app:
    build: .
    ports:
      - '9292:9292'
    volumes:
      - .:/app
    links:
      - mysql
  mysql:
    image: "mysql"
    volumes:
      - ./db:/docker-entrypoint-initdb.d
    ports:
      - "3306:3306"
    environment:
      MYSQL_ALLOW_EMPTY_PASSWORD: 1
      MYSQL_DATABASE: app
      MYSQL_USER: app
      MYSQL_PASSWORD: app
    command: mysqld --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci --skip-character-set-client-handshake
```

DockerHub公式のmysqlイメージは、起動した時に `/docker-entrypoint-initdb.d` というディレクトリにあるファイル(`.sh`, `.sql`, `.sql.gz`)を実行してくれるので、ソースファイル上の `db` ディレクトリに初期化のためのSQLを置いて、そこを `/docker-entrypoint-initdb.d` にマウントさせた。
また、 `command` で起動コマンドを上書きして character set 周りの調整をしている。

### 初期化のためのsql

#### db/00_schema.sql

```
create table `book` (
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(256) NOT NULL,
    `created` DATETIME NOT NULL,
    `updated` DATETIME NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=Innodb DEFAULT CHARACTER SET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

#### db/01_book.sql

```
INSERT INTO `book` (`title`, `created`, `updated`) VALUES
('ピアノの森', NOW(), NOW()),
('ダンジョン飯', NOW(), NOW()),
('花男', NOW(), NOW()),
('蒼天航路', NOW(), NOW()),
('SLAM DUNK', NOW(), NOW())
;
```

この状態で `docker-compose up` すれば、RubyアプリケーションとMySQLが立ち上がる。

<script type="text/javascript" src="https://asciinema.org/a/c2zml3ttqf2gey7p2ssa4itec.js" id="asciicast-c2zml3ttqf2gey7p2ssa4itec" async></script>

### RubyアプリケーションからMySQLに接続する

#### mysql2

`mysql2` をインストールするためにDockerfileとGemfileを[修正する](https://github.com/massat/rubyapp-on-docker/commit/777e1f7d64149c064bbbbe59631c0940c3818247)

##### Dockerfile

```
FROM ruby:2.4.0-alpine

RUN mkdir /app
WORKDIR /app

RUN apk add --update \
  alpine-sdk \
  mariadb-dev \
  && rm -rf /var/cache/apk/* \
  && rm -rf /usr/lib/mysqld*

ADD Gemfile /app
RUN bundle install
ADD . /app

EXPOSE 9292
ENTRYPOINT [ "bundle", "exec" ]
CMD [ "rackup", "--host", "0.0.0.0" ]
```

`mysql2`のコンパイルに必要なものをあれこれ入れている。

##### Gemfile

```
source "https://rubygems.org"

ruby '2.4.0'

gem 'mysql2'
gem 'sinatra'
```

#### MySQLから値を返す

アプリケーションからDB参照して[値を返すようにする](https://github.com/massat/rubyapp-on-docker/commit/666e1e0ac00a11b3cf53c2e879c99ebff3afe191)

##### app.rb

```
require 'json'
require 'mysql2'
require 'sinatra'

class App < Sinatra::Base

  get '/' do
    mysql = Mysql2::Client.new(
      host: 'mysql',
      username: 'app',
      password: 'app',
      database: 'app'
    )
    entries = mysql.query('SELECT * FROM `book`').entries

    JSON.generate(entries)
  end

end
```

<script type="text/javascript" src="https://asciinema.org/a/6zjj4pw7s6n4i8efhgsohhfy0.js" id="asciicast-6zjj4pw7s6n4i8efhgsohhfy0" async></script>

## まとめ

記事としては長くなったが、Dockerfile と docker-compose.yml の記述だけで、手元にRuby x MySQLな開発環境が作れる。
実際的にはアプリケーションサーバーのオートリロードとか、[MySQLが起動するまでアプリケーションサーバーは待機する](https://docs.docker.com/compose/startup-order/)とか、さらなる調整は必要そう。

プロジェクトが発展したら、ビルド済みのイメージを使うとかした方が良さそう。
次は、CIを同一のDockerイメージを使って回すことをやろうかと思っている。
