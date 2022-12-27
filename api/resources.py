from flask_restful import Resource, reqparse
from models import UserModel, MarkerModel, ImageModel
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt
from external import db
from serialization import return_marker_data, return_user_data
'''
参数解析器
添加参数解析逻辑，解析逻辑使用文档：https://flask-restful.readthedocs.io/en/latest/reqparse.html
parser = reqparse.RequestParser()
parser.add_argument('username',
                    help='This field cannot be blank',
                    required=True)
parser.add_argument('password',
                    help='This field cannot be blank',
                    required=True)
'''
'''
Flask设置token过期时间默认值如下：
JWT_ACCESS_TOKEN_EXPIRES 默认为 15 min
JWT_REFRESH_TOKEN_EXPIRES 默认为 30 days
'''


class UserRegistration(Resource):

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('password',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('email',
                            help='This field cannot be blank',
                            required=True)

        data = parser.parse_args()

        if UserModel.find_by_username(data['username']):
            return {
                'message': 'User {} already exists'.format(data['username'])
            }

        new_user = UserModel(username=data['username'],
                             email=data['email'],
                             password=UserModel.generate_hash(
                                 data['password']))
        try:
            new_user.save_to_db()
            # 无论是登录或者注册成功，都生成access_token和refresh_token
            access_token = create_access_token(identity=data['username'])
            refresh_token = create_refresh_token(identity=data['username'])
            return {
                'id': new_user.id,
                'user_name': new_user.username,
                'access_token': access_token,
                'refresh_token': refresh_token
            }

        except:
            return {'message': 'Something went wrong'}, 500


class UserLogin(Resource):

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('password',
                            help='This field cannot be blank',
                            required=True)

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
                'id': current_user.id,
                'user_name': current_user.username,
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


class SecretResource(Resource):
    # 给一个接口的方法添加jwt验证的装饰器
    @jwt_required()
    def get(self):
        return {'answer': 42}


# 业务接口
class GetUserInfo(Resource):

    def post(self):

        parser = reqparse.RequestParser()
        parser.add_argument('username',
                            help='This field cannot be blank',
                            required=True)
        data = parser.parse_args()
        cur_user = UserModel.find_by_username(data['username'])
        if not cur_user:
            return {
                'message': 'User {} does not exist'.format(data['username'])
            }, 400
        try:
            result = return_user_data(cur_user)
            return result
        except:
            return {'message': 'Fail to return the markers list'}, 500


#
class AddMarker(Resource):

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('username',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('position',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('text',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('images',
                            help='This field cannot be blank',
                            required=False)

        data = parser.parse_args()
        cur_user = UserModel.find_by_username(data['username'])
        if not cur_user:
            return {
                'message': 'User {} does not exist'.format(data['username'])
            }, 400

        try:
            new_marker = MarkerModel(user=cur_user,
                                     position=data['position'],
                                     text=data['text'])

            if data['images']:
                for url in data['images']:
                    img = ImageModel(url=url, marker=new_marker)
            new_marker.save_to_db()
            return {"id": new_marker.id}
        except:
            return {'message': 'Fail to add new marker'}, 500


class RemoveMarker(Resource):

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('marker_id',
                            help='This field cannot be blank',
                            required=True)
        data = parser.parse_args()

        cur_marker = MarkerModel.find_by_marker_id(data['marker_id'])
        if not cur_marker:
            return {
                'message': 'Marker {} does not exist'.format(data['marker_id'])
            }, 400

        try:
            cur_marker.enable = False
            db.session.commit()
            return {'message': 'Marker has been successfully deleted!'}
        except:
            return {'message': 'Fail to delete the marker!'}, 500


class GetAllUsers(Resource):

    def post(self):
        all_users = UserModel.return_all()
        result = []
        for user in all_users:
            result.append(return_user_data(user))
        return result


class GetAllMarkers(Resource):

    def post(self):
        all_valid_markers = MarkerModel.return_all_valid()
        result = []
        for valid_marker in all_valid_markers:
            result.append(return_marker_data(valid_marker))
        return result
