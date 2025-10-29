# AI Learning Assistant

AI Learning Assistant is a full-stack MERN application that allows users to upload documents, ask questions about their content, and generate quizzes using AI (OpenAI/OpenRouter).  
The project is split into two parts:

- **Backend**: Node.js, Express, MongoDB, OpenAI/OpenRouter API
- **Frontend**: React, Vite, TailwindCSS

---

## Features

- 📄 Upload documents (PDF, DOCX, TXT)
- 🤖 Ask questions about uploaded documents (AI-powered)
- 📝 Generate multiple-choice quizzes from documents (AI-powered)
- 🗑️ Manage and delete documents
- 🎨 Modern, responsive UI

---

## Project Structure

```
ai-learning-backend/
  controllers/
  models/
  routes/
  .env
  package.json
  server.js

ai-learning-frontend/
  src/
    components/
    pages/
    api.js
    App.jsx
    main.jsx
  public/
  package.json
  vite.config.js
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or remote)
- [OpenRouter API Key](https://openrouter.ai/) (or OpenAI key if you adapt the backend)

---

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/ai-learning-app.git
cd ai-learning-app
```

---

### 2. Backend Setup

```sh
cd ai-learning-backend
npm install
```

- Create a `.env` file (see `.env.example`):

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/learning_db
OPENROUTER_API_KEY=your_openrouter_api_key
```

- Start MongoDB if running locally.
- Start the backend server:

```sh
npm run dev
```

The backend will run on [http://localhost:5000](http://localhost:5000).

---

### 3. Frontend Setup

```sh
cd ../ai-learning-frontend
npm install
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173) (default Vite port).

---

## Usage

1. **Upload a document** (PDF, DOCX, or TXT).
2. **Select a document** from the list.
3. **Ask questions** about the document or **generate a quiz**.
4. **Take the quiz** and view your score.
5. **Delete documents** as needed.

---

## Technologies

- **Frontend**: React, Vite, TailwindCSS, Axios, React Router
- **Backend**: Node.js, Express, MongoDB, Mongoose, Multer, pdf-parse, mammoth, OpenAI/OpenRouter API

---

## Environment Variables

### Backend (`ai-learning-backend/.env`)

| Variable            | Description                        |
|---------------------|------------------------------------|
| PORT                | Server port (default: 5000)        |
| MONGO_URI           | MongoDB connection string          |
| OPENROUTER_API_KEY  | Your OpenRouter API key            |




---

## License

MIT

---

## Authors

- [yasmin jammeli](https://github.com/yasminjammeli)

---

## Acknowledgements

- [OpenRouter](https://openrouter.ai/)
- [OpenAI](https://openai.com/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
