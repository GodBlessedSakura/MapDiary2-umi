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

- 生成新 User, Marker 的逻辑写在 resources 里，models 文件直接用 models 实例交互

- Flask 实现增删改查：https://www.cnblogs.com/nq31/p/14338856.html#_label1_3

- ORM 返回的模型为对象类，不能直接转化成 JSON 格式，需要序列化：https://blog.csdn.net/qq_44265217/article/details/103141734

- Flask get 请求用查询字符串 request.args.get('a') 来获取参数，post 通过请求体或者表单获取参数。注意 query 和 params 的参数传递方式差异是前端差异（?a=1&b=2 和 /:id），不是后端差异
