from langchain_ollama.llms import OllamaLLM
from langchain_ollama.embeddings import OllamaEmbeddings
from langchain_core.prompts import ChatPromptTemplate

# Initialize the models
model = OllamaLLM(model="qwen2.5-coder:7b")
embedding_model = OllamaEmbeddings(model="mxbai-embed-large:latest")

# template = """
#     You are a code review assistant tasked with helping users improve their code. You will be given a series of changes a user has made and to one or multiple files in their codebase. You will then be given relevant files related to that change if they exist. Your task will be to find any potential bugs in the code, security threats with the current change and other components, and any architectural improvements that can be made to the code. 

#     Here are relevant files you can use: {files}

#     Here are the changes made: {diff}
# """

# prompt = ChatPromptTemplate.from_template(template)
# chain = prompt | model
# result = chain.invoke({"files": [], "diff": "print('hello world')"})


# Ollama Test
# import requests

# url = "http://localhost:11434/api/chat"

# data = {
#     "model": "qwen2.5-coder:7b",
#     "stream": False,
#     "messages": [
#         {"role": "system", "content": "You are a code review assistant."},
#         {"role": "user", "content": "Write me the code for the fibonacci sequence."},
#     ],
# }

# response = requests.post(url, json=data)
# response.raise_for_status()

# print(response.json()["message"]["content"])