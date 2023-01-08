# MapDiary2-umi

### 功能设计

- 日记功能
  - 当点击地图时添加一个 Marker
  - 点击添加日记弹出一个窗口用于添加内容，新增一个日记
  - 窗口上半部分添加图片，下半部分添加文字（支持富文本编辑）
- 轨迹动画
- 账号功能

  - 设置用户名，头像
  - 设置自己的 Marker 是否对其它人可见
  - 设置是否展示他人 Marker
  - 修改密码功能
  - 管理员功能
  - 密码找回功能 (Todo)

- 部署至服务器 (Todo)

### 启动项目

#### 后端启动

- $ cd api
- 搭建虚拟环境 - Unix

  - $ # Virtualenv modules installation (Unix based systems)
  - $ virtualenv env
  - $ source env/bin/activate

- 搭建虚拟环境 - Windows

  - $ # Virtualenv modules installation (Windows based systems)
  - $ virtualenv env
  - $ .\env\Scripts\activate

- 安装依赖
  $ pip install -r requirements.txt

- 运行后端
  $ flask run

- 每次启动执行以下操作即可
  $ cd api
  $ source env/bin/activate (Unix)
  $ .\env\Scripts\activate (Windows)
  $ flask run

#### 前端启动

- 再打开一个新的命令行终端
- $ cd ui
- $ npm i # 安装依赖
- $ npm start # 启动项目
- 打开浏览器：http://localhost:8000/

- 后端也可以这样启动: npm run start-api
