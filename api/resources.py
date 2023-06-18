from flask_restful import Resource, reqparse
from models import UserModel, MarkerModel, ImageModel
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt, decode_token
from external import db
from serialization import return_marker_data_without_images, return_user_data, return_images, return_other_markers_without_img, return_all_user_info
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
        parser.add_argument('locale')

        data = parser.parse_args()

        if UserModel.find_by_username(data['username']):
            return {
                'username_error':
                'User {} already exists'.format(data['username'])
            }
        if UserModel.find_by_email(data['email']):
            return {
                'email_error': 'Email {} already exists'.format(data['email'])
            }
        if len(data['password']) < 6 or len(data['password']) > 16:
            return {'password_error': 'The password length should be 6-16'}

        new_user = UserModel(username=data['username'],
                             email=data['email'],
                             password=UserModel.generate_hash(
                                 data['password']),
                             locale=data['locale'])
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
        if not current_user.enable:
            return {
                'message': 'User {} has been banned'.format(data['username'])
            }, 401
        # if current_user.username in ['Zhang Lin', 'Jiayin Zhu']:
        #     current_user.is_admin = True
        #     current_user.save_to_db()

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
            return {'message': 'Fail to return the user info'}, 500


class GetAllUsers(Resource):

    @jwt_required(verify_type=False)
    def post(self):
        username = get_jwt_identity()
        cur_user = UserModel.find_by_username(username)
        if not cur_user.is_admin:
            return {
                'message': 'User {} is not admin user'.format(username)
            }, 401
        try:
            token_type = get_jwt()['type']
            access_token = None
            if token_type == 'refresh':
                access_token = create_access_token(identity=username)

            all_users = UserModel.return_all()
            result = return_all_user_info(all_users, access_token)
            return result
        except:
            return {'message': 'Fail to return the user info'}, 500


class BanOrEnable(Resource):

    @jwt_required(verify_type=False)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)
        parser.add_argument('action', required=True)

        try:
            data = parser.parse_args()
            target_user = UserModel.find_by_user_id(data["id"])
            if data['action'] == 'ban':
                target_user.enable = False
            else:
                target_user.enable = True
            target_user.save_to_db()
            result = {'id': data['id']}

            token_type = get_jwt()['type']
            username = get_jwt_identity()
            access_token = None
            if token_type == 'refresh':
                access_token = create_access_token(identity=username)
                result['access_token'] = access_token
            return result
        except:
            return {'message': 'Fail to ban or enable the user'}, 500


class GetImages(Resource):

    @jwt_required(verify_type=False)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id', required=True)

        username = get_jwt_identity()
        cur_user = UserModel.find_by_username(username)
        if not cur_user:
            return {'message': 'User {} does not exist'.format(username)}, 401

        data = parser.parse_args()
        cur_marker = MarkerModel.find_by_marker_id(data["id"])
        if not cur_marker:
            return {
                'message':
                'Marker {} does not exist or deleted'.format((data["id"]))
            }, 400

        try:
            token_type = get_jwt()['type']
            access_token = None
            if token_type == 'refresh':
                access_token = create_access_token(identity=username)
            result = return_images(cur_marker, access_token)
            return result
        except:
            return {'message': 'Fail to return the markers list'}, 500


class GetOtherUserMarkers(Resource):

    @jwt_required(verify_type=False)
    def post(self):
        username = get_jwt_identity()
        cur_user = UserModel.find_by_username(username)
        if not cur_user:
            return {'message': 'User {} does not exist'.format(username)}, 401
        # 找到不属于该用户的Markers
        markers = MarkerModel.return_other_user_markers(cur_user)
        try:
            token_type = get_jwt()['type']
            access_token = None
            if token_type == 'refresh':
                access_token = create_access_token(identity=username)
            result = return_other_markers_without_img(markers, access_token)
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

    @jwt_required(verify_type=False)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('position',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('text')
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

            result = {"id": new_marker.id}

            username = get_jwt_identity()
            token_type = get_jwt()['type']
            access_token = None
            if token_type == 'refresh':
                access_token = create_access_token(identity=username)
            if access_token:
                result["access_token"] = access_token
            return result
        except:
            return {'message': 'Fail to add new marker'}, 500


class UpdateMarker(Resource):

    @jwt_required(verify_type=False)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('text')
        parser.add_argument('title',
                            help='This field cannot be blank',
                            required=True)
        parser.add_argument('images',
                            help='This field cannot be blank',
                            required=False,
                            action='append')  # 对于输入是列表需要action = "append"

        data = parser.parse_args()

        cur_marker = MarkerModel.find_by_marker_id(data['id'])
        if not cur_marker:
            return {
                'message': 'Marker {} does not exist'.format(data['id'])
            }, 400
        try:
            cur_marker.title = data['title']
            cur_marker.text = data['text']

            cur_marker.images = []

            if data['images']:
                for url in data['images']:
                    img = ImageModel(url=url, marker=cur_marker)
            cur_marker.save_to_db()

            result = {"id": cur_marker.id}

            username = get_jwt_identity()
            token_type = get_jwt()['type']
            access_token = None
            if token_type == 'refresh':
                access_token = create_access_token(identity=username)
            if access_token:
                result["access_token"] = access_token
            return result
        except:
            return {'message': 'Fail to add new marker'}, 500


class RemoveMarker(Resource):

    @jwt_required(verify_type=False)
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('id',
                            help='This field cannot be blank',
                            required=True)
        data = parser.parse_args()

        cur_marker = MarkerModel.find_by_marker_id(data['id'])
        if not cur_marker:
            return {
                'message': 'Marker {} does not exist'.format(data['id'])
            }, 400

        try:
            cur_marker.enable = False
            db.session.commit()
            result = {'id': data['id']}

            username = get_jwt_identity()
            token_type = get_jwt()['type']
            access_token = None
            if token_type == 'refresh':
                access_token = create_access_token(identity=username)
            if access_token:
                result["access_token"] = access_token
            return result
        except:
            return {'message': 'Fail to delete the marker!'}, 500


class GetAllMarkers(Resource):

    def post(self):
        all_valid_markers = MarkerModel.return_all_valid()
        result = []
        for valid_marker in all_valid_markers:
            result.append(return_marker_data_without_images(valid_marker))
        return result
