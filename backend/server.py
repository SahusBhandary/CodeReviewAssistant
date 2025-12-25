from flask import Flask, request, jsonify
import json
from github import Github
from app import db, app
from models import UserModel
import bcrypt
from sqlalchemy.exc import IntegrityError

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
@app.route('/signup', methods=['POST'])
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
@app.route('/login', methods=['POST'])
def login():
    payload = request.json
    username = payload['username']
    password = payload['password']

    try:
        user = UserModel.query.filter_by(username=username).one()  
        user_hash = user.password
        password_bytes = password.encode('utf-8')

        if not bcrypt.checkpw(password_bytes, user_hash):
            return jsonify({"status": "error", "message": "Incorrect Username or Password!"}), 400

        return jsonify({"status": "received"}), 200
    except Exception as e:
        print(f"Login error: {e}")
        return jsonify({"status": "error", "message": "Incorrect Username or Password!"}), 400

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

@app.route('/repo/<owner>/<repo>', methods=['GET'])
def get_repo_info(owner, repo):
    try:
        repo = g.get_repo(f"{owner}/{repo}")
        return jsonify({
            'name': repo.name,
            'description': repo.description,
            'stars': repo.stargazers_count,
            'forks': repo.forks_count,
        })
    except Exception as e:
        return jsonify({"error" : str(e)}), 404

    
if __name__ == "__main__":
    # Create tables
    with app.app_context():
        db.create_all()  
    app.run(port=5001, debug=True)


