# Backend

Spring Boot backend for the Voice Assisted Voting System.

## Prerequisites

- Java 25
- Python 3.11 or later
- A Python environment with the dependencies in `requirements.txt`

## Configuration

The application requires `VOTE_ENCRYPTION_KEY`: a Base64-encoded 32-byte AES key used to encrypt ballots. Keep the same value for the life of an election and never commit it.

```powershell
$env:VOTE_ENCRYPTION_KEY = "your-base64-encoded-32-byte-key"
```

## Run

```powershell
./mvnw.cmd spring-boot:run
```

The default API address is `http://localhost:8080`.
