from langchain_core.prompts import ChatPromptTemplate
from vectorization import retriever
from app import model

template = """
    You are a code review chat bot, that is responsible for informing users about their code bases

    Here is some relevant files based off the question: {files}

    Here is the question: {question}
"""

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model

question = input("Ask a question about the repo: ")
print("\n")
files = retriever.invoke(question)
result = chain.invoke({"files": files, "question": question})
print(result)


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