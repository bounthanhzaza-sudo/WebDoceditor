# DocEditor Backend Server

Node.js, Express, and MongoDB (Mongoose) backend for **DocEditor**.

## Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://localhost:27017/doceditor` (or update `server.env` with your MongoDB Atlas connection string).

## Installation & Setup

1. Install backend dependencies:
   ```bash
   npm install
   ```

2. Start the server (with auto-reload):
   ```bash
   npm run dev
   ```
   Or standard start:
   ```bash
   npm start
   ```

## API Endpoints
- `GET /api/store` - Retrieves all categories, site title, and documents.
- `POST /api/store` - Syncs and saves the entire workspace to MongoDB.
- `POST /api/reset` - Resets documents and settings to default seed data.
- `GET /api/health` - Server health check endpoint.
