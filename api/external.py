from flask_sqlalchemy import SQLAlchemy

# 防止循环引用
db = SQLAlchemy()  # 数据库实例化

SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = 'MISS_STELLA_MISS_YOU'