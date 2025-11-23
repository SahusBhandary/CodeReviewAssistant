from flask import Flask, request, jsonify, render_template, redirect
import json
from flask_sqlalchemy import SQLAlchemy
from github import Github
from dotenv import load_dotenv
from models import db
import os

load_dotenv()

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Init db with app
db.init_app(app)

g = Github()

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


