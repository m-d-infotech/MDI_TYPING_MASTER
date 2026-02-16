# MDI Typing Tutor - Production Setup Guide

A complete Typing Tutor Web Application with Admin/Student roles, Exam modes, and Certificate generation.

## Prerequisites

- **Node.js**: v16 or higher.
- **MySQL Server**: v8.0 or higher (make sure it's running).
- **Git** (optional).

## 1. Database Setup

1. Open your MySQL Client (Workbench, Command Line, etc.).
2. Create the database:
   ```sql
   CREATE DATABASE mdi_typing_tutor;
   ```
3. (Optional) You can run the `schema.sql` file to manually create tables, but the application attempts to sync automatically.

## 2. Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   - The `.env` file is already created.
   - Update `DB_PASS` in `.env` if your local MySQL root user has a password.
   - Default Database Config: User: `root`, Pass: ``(empty), Host:`localhost`.

4. Start the Server:
   ```bash
   npm start
   ```

   - The server runs on Port **5000**.
   - It will automatically create an **Admin** account:
     - **Username**: `admin`
     - **Password**: `admin123`

## 3. Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Development Server:
   ```bash
   npm run dev
   ```

   - The application will be running at `http://localhost:5173` (or similar).

## 4. LAN Deployment (Lab Setup)

To allow other computers in the lab to access the application:

1. **Host Server IP**:
   - Open Command Prompt on the server PC.
   - Run `ipconfig`.
   - Note the **IPv4 Address** (e.g., `192.168.1.105`).

2. **Backend Context**:
   - The backend is configured to listen on `0.0.0.0`, so it is accessible externally.
   - Ensure Windows Firewall allows traffic on Port **5000** (Node.js).

3. **Frontend Context**:
   - The frontend needs to point to the correct Backend IP.
   - Edit `client/vite.config.js` or `client/src/utils/api.js`:
     - Change `baseURL: 'http://localhost:5000/api'` to `baseURL: 'http://YOUR_SERVER_IP:5000/api'`.
     - **Rebuild/Restart** the frontend.
   - To serve the frontend to LAN, run Vite with `--host`:
     ```bash
     npm run dev -- --host
     ```
   - OR Build for production and serve statically:
     ```bash
     npm run build
     npm preview -- --host
     ```

4. **Accessing from Student PC**:
   - Open browser on student PC.
   - Go to `http://192.168.1.105:5173` (Frontend Port).

## Features

- **Admin Panel**: Manage students, create lessons, create exams.
- **Student Dashboard**: Practice typing, take exams, download certificates.
- **Exam Mode**: Fullscreen enforced, copy-paste disabled.
- **Reports**: Detailed WPM and Accuracy tracking.

## Troubleshooting

- **Database Connection Error**: Check if MySQL service is running and credentials in `server/.env` are correct.
- **Login Failed**: Ensure you created the database so the Admin account could be seeded.
- **CORS Error**: If accessing from LAN, ensure `cors` is enabled in backend (it is by default).
