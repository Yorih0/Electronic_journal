// seed_database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./college.db');

db.serialize(() => {
  // Очистка таблиц (опционально)
  db.run("DELETE FROM schedule");
  db.run("DELETE FROM users");
  db.run("DELETE FROM groups");

  // Группы
  db.run(`INSERT INTO groups (name, year, specialization) VALUES
    ('ИТ-201', 2020, 'Информационные технологии'),
    ('ИТ-202', 2020, 'Информационные технологии'),
    ('МТ-191', 2019, 'Машиностроение')`);

  // Преподаватели
  db.run(`INSERT INTO users (email, password_hash, role, first_name, last_name, group_id) VALUES
    ('ivanov@college.edu', 'hashed123', 'teacher', 'Иван', 'Иванов', NULL),
    ('petrova@college.edu', 'hashed456', 'teacher', 'Мария', 'Петрова', NULL),
    ('sidorov@college.edu', 'hashed789', 'teacher', 'Алексей', 'Сидоров', NULL)`);

  // Студенты
  db.run(`INSERT INTO users (email, password_hash, role, first_name, last_name, group_id) VALUES
    ('student1@college.edu', 'pass1', 'student', 'Андрей', 'Кузнецов', 1),
    ('student2@college.edu', 'pass2', 'student', 'Ольга', 'Смирнова', 1),
    ('student3@college.edu', 'pass3', 'student', 'Дмитрий', 'Новиков', 2),
    ('student4@college.edu', 'pass4', 'student', 'Елена', 'Козлова', 2)`);

  // Предметы (нужны для расписания)
  db.run(`INSERT INTO subjects (name, description, teacher_id) VALUES
    ('Математика', 'Высшая математика', 1),
    ('Программирование', 'Основы программирования', 2),
    ('Физика', 'Общая физика', 3),
    ('Алгоритмы', 'Алгоритмы и структуры данных', 1)`);

  // Расписание для группы ИТ-201 (id=1)
  db.run(`INSERT INTO schedule (group_id, subject_id, teacher_id, day_of_week, start_time, end_time, room) VALUES
    (1, 1, 1, 'Monday', '09:00', '10:30', '101'),
    (1, 2, 2, 'Monday', '10:40', '12:10', '205'),
    (1, 3, 3, 'Tuesday', '09:00', '10:30', '102'),
    (1, 4, 1, 'Wednesday', '13:00', '14:30', '301')`);

  // Расписание для группы ИТ-202 (id=2)
  db.run(`INSERT INTO schedule (group_id, subject_id, teacher_id, day_of_week, start_time, end_time, room) VALUES
    (2, 1, 1, 'Monday', '13:00', '14:30', '103'),
    (2, 2, 2, 'Tuesday', '10:40', '12:10', '206'),
    (2, 4, 1, 'Thursday', '09:00', '10:30', '302')`);

  console.log("Данные успешно добавлены!");
});

db.close();