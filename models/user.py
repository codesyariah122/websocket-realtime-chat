from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(50), unique=True, nullable=False)
