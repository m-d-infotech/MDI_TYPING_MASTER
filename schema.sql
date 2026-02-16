-- MDI Typing Tutor Schema

CREATE DATABASE IF NOT EXISTS mdi_typing_tutor;
USE mdi_typing_tutor;

CREATE TABLE IF NOT EXISTS Users (
    id CHAR(36) BINARY PRIMARY KEY, -- UUID
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student') DEFAULT 'student',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Lessons (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    language VARCHAR(255) DEFAULT 'english',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Exams (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    duration_seconds INTEGER DEFAULT 60,
    min_wpm INTEGER DEFAULT 0,
    min_accuracy FLOAT DEFAULT 0.0,
    is_active BOOLEAN DEFAULT TRUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Results (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    user_id CHAR(36) BINARY NOT NULL,
    wpm FLOAT NOT NULL,
    raw_wpm FLOAT,
    accuracy FLOAT NOT NULL,
    mistakes INTEGER DEFAULT 0,
    backspaces INTEGER DEFAULT 0,
    duration INTEGER NOT NULL,
    mode ENUM('practice', 'exam') NOT NULL,
    exam_id INTEGER,
    lesson_id INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES Exams(id) ON DELETE SET NULL,
    FOREIGN KEY (lesson_id) REFERENCES Lessons(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Certificates (
    id CHAR(36) BINARY PRIMARY KEY,
    user_id CHAR(36) BINARY NOT NULL,
    exam_id INTEGER,
    issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    wpm_recorded FLOAT,
    accuracy_recorded FLOAT,
    certificate_code VARCHAR(255) UNIQUE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (exam_id) REFERENCES Exams(id) ON DELETE SET NULL
);

-- Initial Admin (Password: admin123 - hashed version below is placeholder, app will generate correct hash on startup if generic)
-- The app logic handles seeding admin. This SQL is structure only.
