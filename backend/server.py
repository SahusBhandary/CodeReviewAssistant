from flask import Flask, request, jsonify, make_response
import json
from github import Github
from app import db, app
from models import UserModel, RepoModel
import bcrypt
from sqlalchemy.exc import IntegrityError
import jwt
from datetime import datetime, timezone, timedelta

g = Github()

"""
Route to sign up a user

Args: 
    - Username 
    - Password

Expected Outcome:
    - User attempts to sign up
    - If the username is already taken, send an error message
    - Uploads the username and password to the db

Returns: 
    - 200 on success
    - 400 on failure  
"""
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    payload = request.json
    username = payload['username']
    password = payload['password']
    
    # Password Hashing

    # Encode the password to an array of bytes
    bytes = password.encode('utf-8')

    # generating the salt
    salt = bcrypt.gensalt()

    # Hashing the password
    password_hash = bcrypt.hashpw(bytes, salt)

    try:
        # Upload data to the db
        new_user = UserModel(
            username=username,
            password=password_hash,
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"status": "received"}), 200
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": "Username already exists!"}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 400
    
"""
Route to log in a user

Args: 
    - Username 
    - Password

Expected Outcome:
    - User attempts to login
    - If the username does not exist, return error
    - If the password does not match, return error
    - Generate session token and send to frontend

Returns: 
    - 200 on success and returns a session token to the frontend
    - 400 on failure  
"""
@app.route('/login', methods=['GET', 'POST'])
def login():
    payload = request.json
    username = payload['username']
    password = payload['password']

    try:
        user = UserModel.query.filter_by(username=username).one()  
        user_hash = user.password
        password_bytes = password.encode('utf-8')

        # Check if the password entered was correct
        if not bcrypt.checkpw(password_bytes, user_hash):
            return jsonify({"status": "error", "message": "Incorrect Username or Password!"}), 400
        
        # Generate token
        token = jwt.encode({'username': user.username, 'exp': datetime.now(timezone.utc) + timedelta(hours=1)}, 
                           app.config['SECRET_KEY'], algorithm="HS256")

        # Create Response
        response = make_response(jsonify({"status": "received", "token": token}), 200)

        response.set_cookie(
            'auth_token',
            token,
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=(24 * 3600),
        )

        return response
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"status": "error", "message": "Incorrect Username or Password!"}), 400
    
# Route to get user data from cookie
@app.route('/get_user_data', methods=['GET'])
def get_user_data():
    # Get token from request data
    token = request.cookies.get('auth_token')
    if not token:
        return jsonify({"status": "error", "message": "User not found!"}), 401
    
    # Extract data from token
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        user = UserModel.query.filter_by(username=data['username']).first()

        repos_list = [
            {
                'id': repo.id,
                'owner': repo.owner,
                'repo_name': repo.repo_name,
                'description': repo.description
            }
            for repo in user.repos
        ]
        return jsonify({
            "username": user.username, 
            "repos": repos_list,
        }), 200
    
    except Exception as e:
        return jsonify({"status": "error", "message": "User not found!"}), 401

# Logout User
@app.route('/logout', methods=['GET', 'POST'])
def logout():
    response = make_response(jsonify({"status": "success", "message": "Logged out successfully"}), 200)

    # Clear the auth_token cookie by setting it to expire immediately
    response.set_cookie(
        'auth_token',
        '',
        httponly=True,
        secure=False,
        samesite='Lax',
        max_age=0 
    )
    
    return response

# Get Repo Info and associate it with a user
@app.route('/add_repo/<owner>/<repo>', methods=['GET', 'POST'])
def add_repo(owner, repo):
    data = request.json
    username = data['username']

    try:
        repo = g.get_repo(f"{owner}/{repo}")
        
        # Send to db
        new_repo = RepoModel(
            owner = owner,
            repo_name = repo.name,
            description = repo.description,
        )
        
        user = UserModel.query.filter_by(username=username).first()
        
        user.repos.append(new_repo)
        db.session.commit()

        return jsonify({
            'owner': owner,
            'name': repo.name,
            'description': repo.description,
        })
    except Exception as e:
        return jsonify({"error" : str(e)}), 404

@app.route('/get_repo_content/<owner>/<repo>', methods=['GET', 'POST'])
def get_repo_files(owner, repo):
    data = request.json
    username = data['username']
    path = '/'.join(data.get('content', []))

    try:
        # Check if user has this repo added
        existing_repo = RepoModel.query.filter_by(
            owner=owner,
            repo_name=repo
        ).join(RepoModel.UserModel).filter(
            UserModel.username == username
        ).first()

        if not existing_repo:
            return jsonify({"status": "error", "message": "User does not have repo added!"})

        repo = g.get_repo(f"{owner}/{repo}")
        contents = repo.get_contents(path)
        root_content = []
        for content_file in contents:
            print(content_file)
            root_content.append({
                'name': content_file.name,
                'path': content_file.path,
                'type': content_file.type, 
                'size': content_file.size,
                'sha': content_file.sha,
                'url': content_file.html_url,
                'download_url': content_file.download_url if content_file.type == 'file' else None
            })

        return jsonify({"status": "received", "contents": root_content}), 200
    except Exception as e:
        return jsonify({"error" : str(e)}), 404

@app.route('/webhook', methods=['POST'])
def webhook():
    # Get the payload and headers from the request
    payload = request.json

    payload_data = json.loads(payload['payload'])
    repo_name = payload_data['repository']['name']
    owner_name = payload_data['repository']['owner']['login']

    print(repo_name)
    print(owner_name)

    # If successful push, then we get the new file contents and feed it to the Chatbot

    return jsonify({"status": "received"}), 200 # *** Send Owner and Repo name to Frontend

    
if __name__ == "__main__":
    # Create tables
    with app.app_context():
        db.create_all()  
    app.run(port=5001, debug=True)


