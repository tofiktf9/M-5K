-- إنشاء قاعدة البيانات إن لم تكن موجودة
CREATE DATABASE IF NOT EXISTS m5k CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE m5k;

-- جدول المستخدمين (لحفظ الحسابات، الأسماء الفريدة، وكلمات المرور المشفرة وإحصائيات اللعب)
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(30) NOT NULL UNIQUE,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  best_score INT NOT NULL DEFAULT 0,
  games_played INT NOT NULL DEFAULT 0,
  total_points INT NOT NULL DEFAULT 0,
  correct_answers INT NOT NULL DEFAULT 0,
  INDEX idx_best_score (best_score)
) ENGINE=InnoDB;

-- جدول نتائج الألعاب (لحفظ نتائج كل جولة، الغرف الجماعية، وترتيب المتصدرين بدقة)
CREATE TABLE IF NOT EXISTS game_results (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  mode VARCHAR(40) NOT NULL,
  score INT NOT NULL DEFAULT 0,
  correct_answers INT NOT NULL DEFAULT 0,
  total_questions INT NOT NULL DEFAULT 0,
  played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_results_user (user_id),
  INDEX idx_results_score (score)
) ENGINE=InnoDB;
