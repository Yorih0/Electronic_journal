// create_database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./college.db');

db.serialize(() => {
  db.run("PRAGMA foreign_keys = ON");

  // Groups
  db.run(`CREATE TABLE IF NOT EXISTS groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    year INTEGER NOT NULL,
    specialization TEXT NOT NULL
  )`);

  // Users
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('student', 'teacher')) NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    group_id INTEGER,
    is_active INTEGER DEFAULT 1,
    FOREIGN KEY (group_id) REFERENCES groups(id)
  )`);

  // Subjects
  db.run(`CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    teacher_id INTEGER NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES users(id)
  )`);

  // Schedule
  db.run(`CREATE TABLE IF NOT EXISTS schedule (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    group_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    teacher_id INTEGER NOT NULL,
    day_of_week TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    room TEXT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id),
    FOREIGN KEY (teacher_id) REFERENCES users(id)
  )`);

  // Grades
  db.run(`CREATE TABLE IF NOT EXISTS grades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    subject_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    grade INTEGER NOT NULL,
    type TEXT CHECK(type IN ('lecture', 'practice', 'lab', 'test')) NOT NULL,
    comment TEXT,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
  )`);

  // Attendance
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    schedule_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    status TEXT CHECK(status IN ('present', 'late', 'absent')) NOT NULL,
    reason TEXT,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (schedule_id) REFERENCES schedule(id)
  )`);

  // Lab Works
  db.run(`CREATE TABLE IF NOT EXISTS lab_works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    deadline TEXT NOT NULL,
    max_grade INTEGER NOT NULL,
    is_teamwork INTEGER DEFAULT 0,
    theoretical_materials TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
  )`);

  // Student Lab Works
  db.run(`CREATE TABLE IF NOT EXISTS student_lab_works (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lab_work_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    submission_date TEXT NOT NULL,
    file_path TEXT NOT NULL,
    grade INTEGER,
    comment TEXT,
    status TEXT CHECK(status IN ('submitted', 'checked')) NOT NULL,
    FOREIGN KEY (lab_work_id) REFERENCES lab_works(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
  )`);

  // Lab Work Teams
  db.run(`CREATE TABLE IF NOT EXISTS lab_work_teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lab_work_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (lab_work_id) REFERENCES lab_works(id)
  )`);

  // Team Members
  db.run(`CREATE TABLE IF NOT EXISTS team_members (
    team_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    PRIMARY KEY (team_id, student_id),
    FOREIGN KEY (team_id) REFERENCES lab_work_teams(id),
    FOREIGN KEY (student_id) REFERENCES users(id)
  )`);

  // Subject Program
  db.run(`CREATE TABLE IF NOT EXISTS subject_program (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id INTEGER NOT NULL,
    lesson_type TEXT CHECK(lesson_type IN ('lecture', 'practice', 'lab', 'control')) NOT NULL,
    topic TEXT NOT NULL,
    deadline TEXT,
    materials TEXT,
    FOREIGN KEY (subject_id) REFERENCES subjects(id)
  )`);

  console.log("База данных успешно создана!");
});

db.close();