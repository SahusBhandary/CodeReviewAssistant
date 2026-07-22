# CodeReviewAssistant

An AI-powered code review assistant that connects to your GitHub repositories and automatically reviews every push. It combines a local LLM (via [Ollama](https://ollama.com)) with a vector store of your codebase (via [ChromaDB](https://www.trychroma.com)) so that reviews are grounded in the actual context of your project — not just the raw diff.

## What it does

1. You sign up, log in, and connect a GitHub repository.
2. On first connect, the entire repo is parsed and embedded into a vector store, giving the assistant full context of your codebase.
3. You configure a GitHub webhook pointing at the backend.
4. Every time you push a commit, the backend fetches the diff, retrieves the most relevant chunks of your codebase from the vector store, and asks the LLM to review the change (performance, syntax, structure, etc).
5. The review is streamed back to the browser in real time over WebSockets — no polling or manual refresh required.

## Features

- **AI-powered reviews** — Uses `qwen2.5-coder` (via Ollama) to analyze commit diffs and suggest concrete improvements.
- **Codebase-aware retrieval (RAG)** — Repos are parsed with `tree-sitter` and chunked by function/class definitions, then embedded with `mxbai-embed-large` and stored in ChromaDB, so the LLM's suggestions consider the wider codebase, not just the changed lines.
- **Real-time review delivery** — A Flask-SocketIO server emits reviews to the browser the moment a GitHub webhook fires; the frontend listens on a per-repo "room" and shows a live banner + rendered Markdown review.
- **GitHub integration** — Browse a connected repo's file tree, switch branches, and view file/folder metadata directly in the app (via PyGithub).
- **Authentication** — Username/password signup and login with bcrypt password hashing and JWT-based session cookies.
- **Repo management** — Add/remove GitHub repos per user; repos are shared across users (vectorized once, reused) and cleaned up automatically when the last user removes them.
- **Markdown rendering** — LLM review output is rendered as formatted Markdown (`react-markdown`) in the UI.

## Tech stack

**Backend**
- Flask, Flask-SocketIO, Flask-SQLAlchemy, Flask-CORS
- PostgreSQL (via SQLAlchemy / `psycopg2`)
- LangChain + `langchain-ollama` + `langchain-chroma`
- ChromaDB (vector store), Ollama (local LLM + embedding model)
- `tree-sitter` / `tree-sitter-python` for code parsing
- PyGithub for GitHub API access
- bcrypt + PyJWT for auth

**Frontend**
- Next.js 16 (React 19), Tailwind CSS
- `axios`, `socket.io-client`, `react-markdown`

## Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL running and reachable
- [Ollama](https://ollama.com) installed locally, with the following models pulled:
  ```bash
  ollama pull qwen2.5-coder:7b
  ollama pull mxbai-embed-large:latest
  ```
- A GitHub [personal access token](https://github.com/settings/tokens) (for repo browsing/webhook handling)

## Setup

### 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```
DATABASE_URI=postgresql://<user>:<password>@localhost:5432/<db_name>
SECRET_KEY=<a random secret string for JWT signing>
GITHUB_TOKEN=<your GitHub personal access token>
```

Make sure Ollama is running (`ollama serve`), then start the backend from `backend/src`:

```bash
cd src
python app.py
```

This creates the database tables (if they don't exist) and starts the Flask-SocketIO server on `http://localhost:5001`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### 3. Connect a repo and enable live reviews

1. Sign up / log in at `http://localhost:3000`.
2. Go to **Repos** and add a GitHub repo by owner + name (the first add triggers vectorization of the whole repo).
3. In the GitHub repo's settings, add a webhook pointing at your backend's `/webhook` endpoint (e.g. `http://<your-host>:5001/webhook`), configured for `push` events. Note: your backend must be reachable from GitHub (e.g. via a tunnel like `ngrok` for local development).
4. Push a commit — the assistant will vectorize/retrieve relevant context, generate a review, and push it live to anyone viewing that repo in the app.

## Notes

- Reviews and embeddings run entirely against locally hosted models (Ollama) — no code is sent to a third-party LLM API.
- The Chroma vector store is persisted to `backend/code_review_client/`.
