# NPM 源设置

```shell
$ npm install -g nrm
$ nrm add qycloud http://192.168.0.159:4873
```

# 安装

```shell
$ git clone git@git.qycloud.com.cn:Mage/Zero.git
$ cd ~/Zero
$ nrm use qycloud
$ yarn install 
```

# 配置

## 本地开发

```shell
$ cd ~/Zero/config
$ cp server.example.js server.js
$ vim server.js # 根据实际情况修改具体配置
$ sudo vim /etc/hosts # 在文件末尾添加类似配置：127.0.0.1 xxx.qycloud.com.cn
```

# 命令

```shell
$ cd ~/Zero

# 本地开发
$ yarn serve

# 编译打包
$ yarn build
```

# 其他

* git commit 格式检查：https://github.com/conventional-changelog/commitlint