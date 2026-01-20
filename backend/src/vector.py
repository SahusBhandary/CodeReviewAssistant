from app import model, embedding_model
from langchain_core.documents import Document
from parser import FileParser
from github import Github
import os
from langchain_chroma import Chroma
from app import client
import string

def vectorize_repo(repo):
    # Get necessary objects from repo object
    repo_owner, repo_name = repo.owner.login, repo.name
    contents = repo.get_contents('')

    # Initialize parser
    parser = FileParser()

    translation_table = str.maketrans('', '', string.punctuation)
    repo_name_stripped = repo_name.translate(translation_table)
    repo_owner_stripped = repo_owner.translate(translation_table)
    collection_name = repo_owner_stripped + "_" + repo_name_stripped

    # Initialize Vector Store
    vector_store = Chroma(
        client=client,
        collection_name=collection_name,
        embedding_function=embedding_model,
    )

    try:
        while contents:
            file_content = contents.pop(0)
            if file_content.type == 'dir':
                contents.extend(repo.get_contents(file_content.path))
            elif file_content.type == 'file' and os.path.splitext(file_content.path)[1] in parser.language_map:
                # Chunk
                chunks = parser.parse_file(file_content)
                
                if chunks:
                    # Add to vector store
                    ids = []
                    documents = []

                    for i, chunk in enumerate(chunks):
                        document = Document(
                            page_content = chunk['content'],
                            metadata = chunk['metadata']
                        )
                        
                        ids.append(str(i+1))
                        documents.append(document)

                    vector_store.add_documents(documents=documents, ids=ids)
        
        return vector_store.as_retriever(search_kwargs={"k": 5})
                
    except Exception as e:
        raise Exception(f"Error parsing contents: {e}")





