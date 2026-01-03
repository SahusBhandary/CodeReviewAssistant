from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO
from langchain_ollama.llms import OllamaLLM
from langchain_ollama.embeddings import OllamaEmbeddings
from langchain_chroma import Chroma

# Load env file
load_dotenv()

# Set up db connection (thru postgres)
app = Flask(__name__)
CORS(app,
     origins=["http://localhost:3000"],
     supports_credentials=True,
     allow_headers=["Content-Type", "Authorization"],
     expose_headers=["Set-Cookie"],
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Initialize SocketIO
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize vector store, model, and embedding model

# Initialize the models
model = OllamaLLM(model="qwen2.5-coder:7b")
embedding_model = OllamaEmbeddings(model="mxbai-embed-large:latest")

# Initialize Vector Store
vector_store = Chroma(
    collection_name="repos_db",
    embedding_function=embedding_model,
    persist_directory="../code_review_db",
)

