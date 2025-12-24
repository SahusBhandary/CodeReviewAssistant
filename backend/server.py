from flask import Flask, request, jsonify
import json
from github import Github
from app import db, app
from models import UserModel

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
    - 200 on success and returns a session token to the frontend
    - 404 on failure  
"""
@app.route('/signup', methods=['GET'])
def signup():
    payload = request.json
    print(payload)

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


