import time
from flask import Flask
from flask_restful import Api
import external
from external import db
from flask_jwt_extended import JWTManager
import resources, models

# 实例化App
app = Flask(__name__)

# 接口注册到应用
api = Api(app)

# 设置jwt token
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
app.config['JWT_BLOCKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

jwt = JWTManager(app)

# 数据库注册到应用
app.config.from_object(external)
db.init_app(app)

api.add_resource(resources.UserRegistration, '/registration')
api.add_resource(resources.UserLogin, '/login')
api.add_resource(resources.UserLogoutAccess, '/logout/access')
api.add_resource(resources.UserLogoutRefresh, '/logout/refresh')
api.add_resource(resources.TokenRefresh, '/token/refresh')
api.add_resource(resources.SecretResource, '/secret')
# 业务接口
api.add_resource(resources.GetUserInfo, '/user/get_info')
api.add_resource(resources.GetImages, '/user/get_images')  # 通过marker的id获取图片信息
api.add_resource(resources.GetOtherUserMarkers, '/user/get_other_user_markers')
api.add_resource(resources.UpdateUserInfo, '/user/update_info')
api.add_resource(resources.AddMarker, '/user/add_marker')
api.add_resource(resources.RemoveMarker, '/user/remove_marker')
api.add_resource(resources.UpdateMarker, '/user/update_marker')
api.add_resource(resources.GetAllUsers, '/user/get_all_users')
api.add_resource(resources.BanOrEnable, '/user/ban_or_enable')
api.add_resource(resources.GetAllMarkers, '/markers')


@app.before_first_request
def create_tables():
# with app.app_context():
    db.create_all()


@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, decrypted_token):
    jti = decrypted_token['jti']
    return models.RevokedTokenModel.is_jti_blacklisted(jti)