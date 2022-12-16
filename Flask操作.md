## Flask 操作内容

- mkdir api && cd api

- Unix 搭建虚拟环境
  $ # Virtualenv modules installation (Unix based systems)
  $ virtualenv env
  $ source env/bin/activate

- Windows 搭建虚拟环境
  $ # Virtualenv modules installation (Windows based systems)
  $ # virtualenv env
  $ # .\env\Scripts\activate

- 每次运行 activate 即可激活虚拟环境

- $ pip install flask python-dotenv flask-restful flask-jwt-extended passlib flask-sqlalchemy

- api 下建立 app.py 作为主程序，建立.env 作为配置文件，配置说明如下：https://flask.palletsprojects.com/en/2.0.x/config/

- resources.py 放 API，models.api 放 ORM 模型

- API 请求参数解析逻辑：https://flask-restful.readthedocs.io/en/latest/reqparse.html

- 通过 get_jwt_identity 来获取 token 的所属人，从而辨识用户身份
