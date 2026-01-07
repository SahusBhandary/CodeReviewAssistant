from app import db, app
from flask_login import UserMixin

# Junction table between users and repos
user_repos = db.Table('user_repos',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('repo_id', db.Integer, db.ForeignKey('repos.id'), primary_key=True)
)


class UserModel(db.Model, UserMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), nullable=False, unique=True)
    password = db.Column(db.LargeBinary, nullable=False)

    repos = db.relationship('RepoModel', secondary=user_repos, backref='users')

class RepoModel(db.Model):
    __tablename__ = 'repos'

    id = db.Column(db.Integer, primary_key=True)
    owner = db.Column(db.String(100), nullable=False)
    repo_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, default='')


