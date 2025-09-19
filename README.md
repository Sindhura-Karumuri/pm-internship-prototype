# PM Internship Prototype

## Setup Instructions

### Backend
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

### Frontend
cd frontend
npm install
npm run dev

### Mobile
cd mobile
npm install
npx expo start

### Docker Compose
docker-compose up --build
