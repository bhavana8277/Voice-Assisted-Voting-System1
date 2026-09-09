# Voice Assisted Voting System

A local prototype for voice-guided voting workflows, officer authentication, encrypted ballot storage, and election result reporting.

## Project layout

- `frontend/`: React and Vite application
- `backend/`: Spring Boot API, SQLite development database, and Python face/speech utilities

## Prerequisites

- Node.js 20 or later
- Java 25
- Python 3.11 or later

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` by default.

## Backend

Install Python dependencies first:

```powershell
cd backend
python -m pip install -r requirements.txt
```

Set a `VOTE_ENCRYPTION_KEY` before starting the API. It must be a Base64-encoded 32-byte AES key and must remain stable for the lifetime of an election.

```powershell
./mvnw.cmd spring-boot:run
```

The API runs on `http://localhost:8080` by default.

## Local database

The `backend/database/` folder is intentionally not committed. It can contain voter records, ballot data, and other local development state. When the backend starts, SQLite creates a fresh local `backend/database/voting.db` as needed.

Do not commit a real database, biometric images, encryption keys, or production credentials. For a shared demo environment, use a separate sanitized seed script or an empty database template.

## Security note

This is a local prototype. Do not commit runtime databases, biometric images, encryption keys, or production credentials.
