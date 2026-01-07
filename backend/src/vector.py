from app import model, embedding_model
from langchain_core.documents import Document
from parser import FileParser
from github import Github
import os
from langchain_chroma import Chroma
from app import client

def vectorize_repo(repo):
    # Get necessary objects from repo object
    repo_owner, repo_name = repo.owner, repo.name
    contents = repo.get_contents('')

    # Initialize parser
    parser = FileParser()

    try:
        while contents:
            file_content = contents.pop(0)
            if file_content.type == 'dir':
                contents.extend(repo.get_contents(file_content.path))
            elif os.path.splitext(file_content.path)[1] in parser.language_map:
                # Chunk
                print("working")
    except Exception as e:
        raise Exception(f"Error parsing contents: {e}")

        # if content_file.type == 'file' and content_file.name == 'test_chunker.py':
        #     file_content = content_file.decoded_content.decode()

# Initialize Vector Store
# vector_store = Chroma(
#     client=client,
#     collection_name="repos_db",
#     embedding_function=embedding_model,
# )

# g = Github()

# # Temp, pull file content
# file_content = ""




# chunks = parser.parse_file(file_content, 'test_chunker.py', '.py', 'SahusBhandary-Student', 'test_repo')

# ids = []
# documents = []

# for i, chunk in enumerate(chunks):
#     document = Document(
#         page_content = chunk['content'],
#         metadata = chunk['metadata']
#     )
    
#     ids.append(str(i+1))
#     documents.append(document)

# vector_store.add_documents(documents=documents, ids=ids)

# retriever = vector_store.as_retriever(
#     search_kwargs = {'k': 5}
# )