# 🎓 StudyMind — AI-Powered Multi-Agent Study Assistant

> A university project built for the **Generative AI** module at **TEK-UP | ING-3**  
> Academic Year: 2025–2026

StudyMind is a full-stack AI application that uses a **multi-agent workflow** to help students study smarter. Upload any document or paste text, and four specialized AI agents collaborate to summarize it, generate a quiz, evaluate quality, and answer your questions.

---

## 📸 Screenshots

### 🏠 Home — Upload your study material
![Home Page](./docs/screenshots/screenshot1_home.png)

### 📄 Summary & Key Points
![Summary](./docs/screenshots/screenshot2_summary.png)

### ❓ Interactive Quiz
![Quiz](./docs/screenshots/screenshot3_quiz.png)

### 💬 Ask the Explainer
![Chat](./docs/screenshots/screenshot4_chat.png)

### 🕐 Session History
![History](./docs/screenshots/screenshot5_history.png)

---

## 🤖 How the Agent Workflow Works

```
User Input (PDF / DOCX / TXT / Text)
              ↓
     [Orchestrator — LangGraph]
       ↓              ↓
[Summarizer]    [Quiz Maker]
       ↓              ↓
         [Reviewer Agent]
              ↓
        Final Output
              +
    [Explainer Agent] ← on-demand chat
```

| Agent | Role |
|---|---|
| 📄 **Summarizer** | Reads the content and extracts a summary + 5-7 key points |
| ❓ **Quiz Maker** | Generates 5 multiple choice questions from the content |
| ✅ **Reviewer** | Evaluates the quality of all outputs and gives a score out of 10 |
| 💬 **Explainer** | Answers follow-up questions strictly about the study material |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React + TypeScript + Vite |
| **Backend** | Python + FastAPI |
| **Agent Framework** | LangGraph + LangChain |
| **LLM** | Groq API (`llama-3.3-70b-versatile`) — free tier |
| **Database** | PostgreSQL |
| **File Parsing** | PyMuPDF (PDF), python-docx (DOCX) |

---

## 📁 Project Structure

```
smart-study-assistant/
│
├── frontend/                      # React + TypeScript UI
│   └── src/
│       ├── components/            # AgentProgress, QuizCard, ChatBox, etc.
│       ├── services/api.ts        # Axios API calls
│       ├── types/index.ts         # TypeScript interfaces
│       └── App.tsx                # Main app component
│
├── backend/                       # Python + FastAPI
│   └── app/
│       ├── agents/                # summarizer, quiz_maker, explainer, reviewer
│       ├── graph/workflow.py      # LangGraph pipeline
│       ├── routes/                # study, chat, sessions endpoints
│       ├── services/              # db.py, file_parser.py
│       └── utils/prompt_templates.py
│
├── database/
│   └── init.sql                   # PostgreSQL schema
│
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 17
- A free [Groq API key](https://console.groq.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-study-assistant.git
cd smart-study-assistant
```

---

### 2. Set up the database

```sql
-- In psql or pgAdmin:
CREATE DATABASE studydb;
```

```bash
psql -U postgres -d studydb -f database/init.sql
```

---

### 3. Set up the backend

```bash
cd backend
python -m venv venv

# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install fastapi uvicorn langgraph langchain-groq langchain-core pymupdf sqlalchemy psycopg2-binary python-dotenv pydantic python-multipart python-docx
```

Create `backend/.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/studydb
```

Run the backend:
```bash
uvicorn app.main:app --reload
```

API available at: `http://localhost:8000`  
API docs at: `http://localhost:8000/docs`

---

### 4. Set up the frontend

```bash
cd frontend
npm install
npm run dev
```

App available at: `http://localhost:5173`

---

## 🚀 Usage

1. Open `http://localhost:5173`
2. Upload a **PDF**, **DOCX**, or **TXT** file — or paste text directly
3. Click **⚡ Run Study Pipeline**
4. Four agents will process your content and return:
   - A concise **summary** with key points
   - An interactive **quiz** with instant feedback
   - A **quality score** from the reviewer agent
5. Use the **chat box** to ask follow-up questions about the material
6. Click **🕐 History** to revisit past study sessions

---

## 🔒 Security Notes

- The `.env` file is listed in `.gitignore` and is **never pushed to GitHub**
- The Groq API key is stored only in the local `.env` file
- Never commit API keys or database passwords to version control

---

## 📦 Features

- ✅ Multi-agent AI pipeline (LangGraph)
- ✅ Supports PDF, DOCX, and TXT file uploads
- ✅ Interactive MCQ quiz with green/red feedback
- ✅ Focused explainer chatbot (only answers about your material)
- ✅ Session history with delete functionality
- ✅ PostgreSQL persistence
- ✅ Responsive design (mobile + desktop)
- ✅ Dark mode UI

---

## 👨‍💻 Author

Built as part of the **Generative AI** module — TEK-UP University, ING-3, 2025–2026.