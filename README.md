# Warehouse Management System - 3-Tier Architecture

## Stack
- **Frontend**: React (port 3000)
- **Backend**: Node.js + Express (port 5000)
- **Database**: PostgreSQL (port 5432)

## Setup

### 1. Database
```bash
# Create DB and run init script
psql -U postgres -c "CREATE DATABASE warehouse;"
psql -U postgres -d warehouse -f database/init.sql
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
```

## API Endpoints
| Method | Endpoint            | Description        |
|--------|---------------------|--------------------|
| GET    | /api/products       | List all products  |
| GET    | /api/products/:id   | Get one product    |
| POST   | /api/products       | Create product     |
| PUT    | /api/products/:id   | Update product     |
| DELETE | /api/products/:id   | Delete product     |
| GET    | /health             | Health check       |
