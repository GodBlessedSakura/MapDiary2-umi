from external import db
from passlib.hash import pbkdf2_sha256 as sha256
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from flask import json


class ImageModel(db.Model):
    __tablename__ = 'images'

    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.Text, nullable=False)

    marker_id = db.Column(db.Integer, ForeignKey('markers.id'))
    marker = relationship('MarkerModel', back_populates="images")


class MarkerModel(db.Model):
    __tablename__ = 'markers'

    id = db.Column(db.Integer, primary_key=True)
    position = db.Column(db.String(120), nullable=False)
    text = db.Column(db.Text, nullable=False)
    enable = db.Column(db.Boolean, default=True, nullable=False)

    # User表的外键，指定外键的时候，是使用的是数据库表的名称，而不是类名
    user_id = db.Column(db.Integer, ForeignKey('users.id'))
    # 在ORM层面绑定两者之间的关系，第一个参数是绑定的表的类名，
    # 第二个参数back_populates是通过User反向访问时的字段名称
    user = relationship('UserModel', back_populates="markers")

    images = relationship('ImageModel',
                          order_by=ImageModel.id,
                          back_populates="marker")

    # 类方法
    @classmethod
    def find_by_marker_id(cls, marker_id):
        return cls.query.filter_by(id=marker_id, enable=True).first()

    # 类方法
    @classmethod
    def return_all_valid(cls):
        # 必须用户与标记都未被禁用
        result = []
        markers = cls.query.filter_by(enable=True).all()
        for marker in markers:
            if marker.user.enable:
                result.append(marker)
        return result

    # 实例方法
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    avatar = db.Column(db.Text, nullable=True)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    display_user = db.Column(db.Boolean, default=True, nullable=False)
    hide_other_users = db.Column(db.Boolean, default=True, nullable=False)
    locale = db.Column(db.String(120), default='CN', nullable=False)
    enable = db.Column(db.Boolean, default=True, nullable=False)

    # 在ORM层面绑定和`markers`表的关系
    markers = relationship("MarkerModel",
                           order_by=MarkerModel.id,
                           back_populates="user")

    # 类方法
    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def return_all(cls):
        return cls.query.all()

    @classmethod
    def delete_all(cls):
        try:
            num_rows_deleted = db.session.query(cls).delete()
            db.session.commit()
            return {'message': '{} row(s) deleted'.format(num_rows_deleted)}
        except:
            return {'message': 'Something went wrong'}

    # 静态方法（类和实例都能调用）

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)

    # 实例方法
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()


class RevokedTokenModel(db.Model):
    __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(120))

    def add(self):
        db.session.add(self)
        db.session.commit()

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti=jti).first()
        return bool(query)
