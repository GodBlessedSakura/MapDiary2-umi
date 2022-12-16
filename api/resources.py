from flask_restful import Resource, reqparse
from models import UserModel
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt

# 参数解析器
# 添加参数解析逻辑，解析逻辑使用文档：https://flask-restful.readthedocs.io/en/latest/reqparse.html
parser = reqparse.RequestParser()
parser.add_argument('username',
                    help='This field cannot be blank',
                    required=True)
parser.add_argument('password',
                    help='This field cannot be blank',
                    required=True)


class UserRegistration(Resource):

    def post(self):
        data = parser.parse_args()

        if UserModel.find_by_username(data['username']):
            return {
                'message': 'User {} already exists'.format(data['username'])
            }

        new_user = UserModel(username=data['username'],
                             password=UserModel.generate_hash(
                                 data['password']))
        try:
            new_user.save_to_db()
            # 无论是登录或者注册成功，都生成access_token和refresh_token
            access_token = create_access_token(identity=data['username'])
            refresh_token = create_refresh_token(identity=data['username'])
            return {
                'message': 'User {} was created'.format(data['username']),
                'access_token': access_token,
                'refresh_token': refresh_token
            }

        except:
            return {'message': 'Something went wrong'}, 500


class UserLogin(Resource):

    def post(self):
        data = parser.parse_args()
        current_user = UserModel.find_by_username(data['username'])
        if not current_user:
            return {
                'message': 'User {} doesn\'t exist'.format(data['username'])
            }

        if UserModel.verify_hash(data['password'], current_user.password):
            access_token = create_access_token(identity=data['username'])
            refresh_token = create_refresh_token(identity=data['username'])
            return {
                'message': 'Logged in as {}'.format(data['username']),
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        else:
            return {'message': 'Wrong credentials'}


class UserLogoutAccess(Resource):

    @jwt_required()
    def post(self):
        jti = get_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti=jti)
            revoked_token.add()
            return {'message': 'Access token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class UserLogoutRefresh(Resource):

    @jwt_required(refresh=True)
    def post(self):
        jti = get_jwt()['jti']
        try:
            revoked_token = RevokedTokenModel(jti=jti)
            revoked_token.add()
            return {'message': 'Refresh token has been revoked'}
        except:
            return {'message': 'Something went wrong'}, 500


class TokenRefresh(Resource):

    # 允许使用refresh token并返回一个新的access_token
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return {'access_token': access_token}


class AllUsers(Resource):

    def get(self):
        return {'message': 'List of users'}

    def delete(self):
        return UserModel.delete_all()


class SecretResource(Resource):
    # 给一个接口的方法添加jwt验证的装饰器
    @jwt_required()
    def get(self):
        return {'answer': 42}
