from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from createDB import Base, User, Group, GroupInvitation, GroupUsers
from alchemyEncoder import new_alchemy_encoder

from flask import Flask, jsonify, abort, request, g, url_for
from flask_httpauth import HTTPBasicAuth
import json
from passlib.apps import custom_app_context as pwd_context

#flask app
app = Flask(__name__)
app.secret_key = "super secret key"

#database SQLAlchemy
engine = create_engine('sqlite:///order_food.db')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
session = DBSession()

#auth
auth = HTTPBasicAuth()
    
@app.route('/register', methods = ['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400) # missing arguments
    if session.query(User).filter(User.username==username).first() is not None:
        abort(400) # existing user
    user = User(username = username)
    user.hash_password(password)
    session.add(user)
    session.commit()
    return jsonify({ 'id': user.id, 'username': user.username }), 201, {'Location': url_for('get_user', id = user.id, _external = True)}

@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token, app.secret_key, session)
    if not user:
        # try to authenticate with username/password
        user = session.query(User).filter(User.username==username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.user = user
    return True
     
@app.route('/login')
@auth.login_required
def get_auth_token():
    token = g.user.generate_auth_token(app.secret_key, 600)
    return jsonify({'token': token.decode('ascii'), 'duration': 600})
    
@app.route('/users/<int:id>')
@auth.login_required
def get_user(id):
    user = session.query(User).filter(User.id==id)
    if not user:
        abort(400)
    return jsonify({ 'id': user.id, 'username': user.username })
    
@app.route('/users', methods=['GET'])
@auth.login_required
def get_users():
    list = [{ 'id': x.id, 'username': x.username } for x in session.query(User).all()]
    return jsonify({'users': list})

@app.route('/groupUsers/<int:id>', methods=['GET'])
@auth.login_required
def get_group_users(group_id):
    groupUsers = [json.dumps(gu.user, cls=new_alchemy_encoder(), check_circular=False) for gu in session.query(GroupUsers).filter(GroupUsers.group_id==group_id).all()]
    return jsonify({'users': groupUsers})

@app.route('/groups', methods=['GET'])
@auth.login_required
def get_groups():
    groups = [json.dumps(x, cls=new_alchemy_encoder(), check_circular=False) for x in session.query(Group).all()]
    return jsonify({'groups': groups})
    
if __name__ == '__main__':
    app.run(debug=True)