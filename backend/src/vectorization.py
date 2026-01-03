from app import model, embedding_model, vector_store
from langchain_core.documents import Document
from parser import FileParser
from github import Github
import os

db_location = '../code_review_db'
exists = os.path.exists(db_location)

g = Github()

# Temp, pull file content
file_content = ""

repo = g.get_repo(f"SahusBhandary-Student/test_repo")
contents = repo.get_contents('')
root_content = []
for content_file in contents:
    if content_file.type == 'file' and content_file.name == 'test_chunker.py':
        file_content = content_file.decoded_content.decode()

parser = FileParser()
chunks = parser.parse_file(file_content, 'test_chunker.py', '.py', 'SahusBhandary-Student', 'test_repo')

ids = []
documents = []

for i, chunk in enumerate(chunks):
    document = Document(
        page_content = chunk['content'],
        metadata = chunk['metadata']
    )
    
    ids.append(str(i+1))
    documents.append(document)

if exists:
    vector_store.add_documents(documents=documents, ids=ids)

retriever = vector_store.as_retriever(
    search_kwargs = {'k': 5}
)