from flask_restful import Resource, reqparse
from models import UserModel, MarkerModel, ImageModel
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt, decode_token
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
            return {'error': 'User {} already exists'.format(data['username'])}
        if UserModel.find_by_email(data['email']):
            return {'error': 'Email {} already exists'.format(data['email'])}

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
                'username': new_user.username,
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
            }, 401

        if UserModel.verify_hash(data['password'], current_user.password):
            access_token = create_access_token(identity=data['username'])
            refresh_token = create_refresh_token(identity=data['username'])
            return {
                'id': current_user.id,
                'username': current_user.username,
                'access_token': access_token,
                'refresh_token': refresh_token
            }
        else:
            return {'message': 'Wrong credentials'}, 401


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

    @jwt_required(verify_type=False)
    def post(self):
        username = get_jwt_identity()
        cur_user = UserModel.find_by_username(username)
        if not cur_user:
            return {'message': 'User {} does not exist'.format(username)}, 401
        try:
            token_type = get_jwt()['type']
            access_token = None
            if token_type == 'refresh':
                access_token = create_access_token(identity=username)
            result = return_user_data(cur_user, access_token)
            return result
        except:
            return {'message': 'Fail to return the markers list'}, 500


class UpdateUserInfo(Resource):

    @jwt_required(verify_type=False)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('avatar')
        parser.add_argument('username')
        parser.add_argument('email')
        parser.add_argument('new_password')
        parser.add_argument('old_password')
        parser.add_argument('locale')
        parser.add_argument('display_user', type=bool)
        parser.add_argument('display_other_users', type=bool)

        # 更新 token
        username = get_jwt_identity()
        token_type = get_jwt()['type']
        access_token = None
        if token_type == 'refresh':
            access_token = create_access_token(identity=username)

        username = get_jwt_identity()
        cur_user = UserModel.find_by_username(username)
        if not cur_user:
            return {'message': 'User {} does not exist'.format(username)}, 401
        try:
            # 更新用户信息，每次只能更新单一信息
            data = parser.parse_args()
            error_msg = None

            if data['avatar']:
                cur_user.avatar = data['avatar']
            elif data['username']:
                if UserModel.find_by_username(data['username']):
                    error_msg = 'User {} already exists'.format(
                        data['username'])
                else:
                    cur_user.username = data['username']
            elif data['email']:
                if UserModel.find_by_email(data['email']):
                    error_msg = 'Email {} already exists'.format(data['email'])
                else:
                    cur_user.email = data['email']
            elif (data['old_password'] and data['new_password']):
                if UserModel.verify_hash(data['old_password'],
                                         cur_user.password):
                    cur_user.password = UserModel.generate_hash(
                        data['new_password'])
                else:
                    error_msg = 'Wrong Old Password!'
            elif data['locale']:
                cur_user.locale = data['locale']

            if isinstance(data['display_user'], bool):
                cur_user.display_user = data['display_user']
            if isinstance(data['display_other_users'], bool):
                cur_user.display_other_users = data['display_other_users']
            if error_msg:
                return {'error': error_msg, 'access_token': access_token}
            cur_user.save_to_db()
            return {
                'access_token': access_token,
                'id': cur_user.id,
                "username": cur_user.username
            }
        except:
            return {'message': 'Fail to update the user information'}, 500


#
class AddMarker(Resource):

    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('position',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('text',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('title',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('images',
                            help='This field cannot be blank',
                            required=False,
                            action='append')

        data = parser.parse_args()
        cur_user = UserModel.find_by_user_id(data['id'])
        if not cur_user:
            return {
                'message': 'User {} does not exist'.format(data['username'])
            }, 401

        try:
            new_marker = MarkerModel(user=cur_user,
                                     position=data['position'],
                                     title=data['title'],
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
