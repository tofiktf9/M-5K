'use strict';
/*
 * M5K storage layer.
 *  - MySQL  : used when reachable (database + tables are created automatically).
 *  - File   : data/m5k-data.json fallback, so accounts and the leaderboard are
 *             ALWAYS saved, even when MySQL is not installed or not running.
 * Both back-ends expose exactly the same async API.
 */
const fs = require('fs');
const path = require('path');

const USER_FIELDS = 'id,username,email,best_score,games_played,total_points,correct_answers,created_at,preferences';

function dupError() { const e = new Error('duplicate'); e.code = 'DUPLICATE'; return e; }

function pickUser(u) {
  if (!u) return null;
  return {
    id: u.id, username: u.username, email: u.email,
    best_score: u.best_score || 0, games_played: u.games_played || 0,
    total_points: u.total_points || 0, correct_answers: u.correct_answers || 0,
    created_at: u.created_at, preferences: (typeof u.preferences === 'string' ? (() => { try { return JSON.parse(u.preferences); } catch { return {}; } })() : (u.preferences || { theme: 'dark', language: 'ar' }))
  };
}

/* ------------------------------------------------------------------ MySQL */
async function createMysqlStore(cfg) {
  const mysql = require('mysql2/promise');
  if (!/^[A-Za-z0-9_]+$/.test(cfg.database)) throw new Error('DB_NAME غير صالح.');

  const boot = await mysql.createConnection({
    host: cfg.host, port: cfg.port, user: cfg.user, password: cfg.password,
    charset: 'utf8mb4', connectTimeout: 4000
  });
  await boot.query(`CREATE DATABASE IF NOT EXISTS \`${cfg.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await boot.end();

  const pool = mysql.createPool({
    host: cfg.host, port: cfg.port, user: cfg.user, password: cfg.password,
    database: cfg.database, waitForConnections: true, connectionLimit: 10, charset: 'utf8mb4'
  });

  await pool.query(`CREATE TABLE IF NOT EXISTS users (
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
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query(`CREATE TABLE IF NOT EXISTS game_results (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    mode VARCHAR(40) NOT NULL,
    score INT NOT NULL DEFAULT 0,
    correct_answers INT NOT NULL DEFAULT 0,
    total_questions INT NOT NULL DEFAULT 0,
    played_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_results_user (user_id),
    INDEX idx_results_score (score),
    INDEX idx_results_mode (mode)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  await pool.query('ALTER TABLE users ADD COLUMN preferences JSON NULL').catch(() => {});
  // Older databases may lack the mode index – ignore the error if it already exists.
  await pool.query('CREATE INDEX idx_results_mode ON game_results(mode)').catch(() => {});

  return {
    kind: 'mysql',
    async ping() { await pool.query('SELECT 1'); },
    async findForLogin(login) {
      const [rows] = await pool.query(
        'SELECT id,username,email,password_hash FROM users WHERE email=? OR username=? LIMIT 1',
        [login.toLowerCase(), login]);
      return rows[0] || null;
    },
    async isTaken(username, email) {
      const [rows] = await pool.query('SELECT id FROM users WHERE email=? OR username=? LIMIT 1', [email, username]);
      return rows.length > 0;
    },
    async createUser({ username, email, passwordHash }) {
      try {
        const [r] = await pool.query('INSERT INTO users(username,email,password_hash) VALUES(?,?,?)', [username, email, passwordHash]);
        return r.insertId;
      } catch (e) {
        if (e && e.code === 'ER_DUP_ENTRY') throw dupError();
        throw e;
      }
    },
    async getUser(id) {
      const [rows] = await pool.query(`SELECT ${USER_FIELDS} FROM users WHERE id=?`, [id]);
      return rows[0] || null;
    },
    async getUserByEmail(email) { const [rows] = await pool.query('SELECT id,email FROM users WHERE email=? LIMIT 1',[String(email).toLowerCase()]); return rows[0] || null; },
    async updatePassword(userId, passwordHash) { await pool.query('UPDATE users SET password_hash=? WHERE id=?',[passwordHash,userId]); },
    async getUserByName(username) {
      const [rows] = await pool.query(`SELECT ${USER_FIELDS} FROM users WHERE username=? LIMIT 1`, [username]);
      return rows[0] || null;
    },
    async updatePreferences(userId, patch) {
      const current = await this.getUser(userId);
      if (!current) return null;
      let prefs = current.preferences || {};
      if (typeof prefs === 'string') { try { prefs = JSON.parse(prefs); } catch { prefs = {}; } }
      if (patch.theme) prefs.theme = patch.theme;
      if (patch.language) prefs.language = patch.language;
      if (typeof patch.avatar === 'string') prefs.avatar = patch.avatar;
      await pool.query('UPDATE users SET preferences=? WHERE id=?', [JSON.stringify(prefs), userId]);
      return this.getUser(userId);
    },
    async addResult(userId, mode, score, correct, total) {
      const conn = await pool.getConnection();
      try {
        await conn.beginTransaction();
        await conn.query('INSERT INTO game_results(user_id,mode,score,correct_answers,total_questions) VALUES(?,?,?,?,?)',
          [userId, mode, score, correct, total]);
        await conn.query(
          'UPDATE users SET best_score=GREATEST(best_score,?),games_played=games_played+1,total_points=total_points+?,correct_answers=correct_answers+? WHERE id=?',
          [score, score, correct, userId]);
        await conn.commit();
      } catch (e) {
        await conn.rollback().catch(() => {});
        if (e && (e.code === 'ER_NO_REFERENCED_ROW_2' || e.code === 'ER_NO_REFERENCED_ROW')) return null;
        throw e;
      } finally { conn.release(); }
      return this.getUser(userId);
    },
    async leaderboard(limit, mode) {
      if (mode) {
        const [rows] = await pool.query(
          `SELECT u.username, MAX(r.score) AS best_score, COUNT(*) AS games_played
             FROM game_results r JOIN users u ON u.id=r.user_id
            WHERE r.mode=? GROUP BY u.id, u.username
            ORDER BY best_score DESC, u.id ASC LIMIT ?`, [mode, limit]);
        return rows;
      }
      const [rows] = await pool.query(
        'SELECT username,best_score,games_played FROM users WHERE games_played>0 ORDER BY best_score DESC, total_points DESC, id ASC LIMIT ?', [limit]);
      return rows;
    },
    async rankOf(user) {
      if (!user || !user.games_played) return null;
      const [rows] = await pool.query(
        `SELECT COUNT(*)+1 AS pos FROM users WHERE games_played>0 AND
           (best_score>? OR (best_score=? AND (total_points>? OR (total_points=? AND id<?))))`,
        [user.best_score, user.best_score, user.total_points, user.total_points, user.id]);
      return Number(rows[0].pos);
    },
    async close() { await pool.end().catch(() => {}); }
  };
}

/* ------------------------------------------------------------- JSON file */
async function createFileStore(dir) {
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, 'm5k-data.json');
  let db = { users: [], results: [], nextUserId: 1, nextResultId: 1 };

  if (fs.existsSync(file)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (parsed && Array.isArray(parsed.users)) {
        db = Object.assign(db, parsed);
        if (!Array.isArray(db.results)) db.results = [];
      }
    } catch (e) {
      const bad = file + '.corrupt-' + Date.now();
      try { fs.renameSync(file, bad); } catch (_) {}
      console.error('[store] ملف البيانات تالف، تم حفظ نسخة منه في', bad);
    }
  }

  let chain = Promise.resolve();
  function persist() {
    chain = chain.then(() => {
      const tmp = file + '.tmp';
      fs.writeFileSync(tmp, JSON.stringify(db));
      if (fs.existsSync(file)) { try { fs.copyFileSync(file, file + '.bak'); } catch (_) {} }
      fs.renameSync(tmp, file);
    }).catch(e => console.error('[store] فشل حفظ الملف:', e));
    return chain;
  }
  const lower = s => String(s).toLowerCase();
  const byId = id => db.users.find(u => u.id === Number(id)) || null;
  const order = (a, b) => b.best_score - a.best_score || b.total_points - a.total_points || a.id - b.id;

  return {
    kind: 'file',
    async ping() {},
    async findForLogin(login) {
      const l = lower(login);
      const u = db.users.find(x => lower(x.email) === l || lower(x.username) === l);
      return u ? { id: u.id, username: u.username, email: u.email, password_hash: u.password_hash } : null;
    },
    async isTaken(username, email) {
      return db.users.some(u => lower(u.username) === lower(username) || lower(u.email) === lower(email));
    },
    async createUser({ username, email, passwordHash }) {
      if (await this.isTaken(username, email)) throw dupError();
      const id = db.nextUserId++;
      db.users.push({
        id, username, email, password_hash: passwordHash, created_at: new Date().toISOString(),
        best_score: 0, games_played: 0, total_points: 0, correct_answers: 0
      });
      await persist();
      return id;
    },
    async getUser(id) { return pickUser(byId(id)); },
    async getUserByEmail(email) { const u=db.users.find(x=>lower(x.email)===lower(email)); return u ? {id:u.id,email:u.email} : null; },
    async updatePassword(userId,passwordHash) { const u=byId(userId); if(!u) return; u.password_hash=passwordHash; await persist(); },
    async updatePreferences(userId, patch) {
      const u = byId(userId); if (!u) return null;
      u.preferences = Object.assign({ theme: 'dark', language: 'ar' }, u.preferences || {});
      if (patch.theme) u.preferences.theme = patch.theme;
      if (patch.language) u.preferences.language = patch.language;
      if (typeof patch.avatar === 'string') u.preferences.avatar = patch.avatar;
      await persist(); return pickUser(u);
    },
    async getUserByName(username) {
      return pickUser(db.users.find(u => lower(u.username) === lower(username)));
    },
    async addResult(userId, mode, score, correct, total) {
      const u = byId(userId);
      if (!u) return null;
      db.results.push({ id: db.nextResultId++, user_id: u.id, mode, score, correct_answers: correct, total_questions: total, played_at: new Date().toISOString() });
      if (db.results.length > 20000) db.results.splice(0, db.results.length - 20000);
      u.best_score = Math.max(u.best_score, score);
      u.games_played += 1;
      u.total_points += score;
      u.correct_answers += correct;
      await persist();
      return pickUser(u);
    },
    async leaderboard(limit, mode) {
      if (mode) {
        const best = new Map();
        for (const r of db.results) {
          if (r.mode !== mode) continue;
          const b = best.get(r.user_id) || { score: 0, games: 0 };
          b.score = Math.max(b.score, r.score); b.games++;
          best.set(r.user_id, b);
        }
        return [...best.entries()]
          .map(([id, b]) => ({ id, username: (byId(id) || {}).username, best_score: b.score, games_played: b.games }))
          .filter(r => r.username)
          .sort((a, b) => b.best_score - a.best_score || a.id - b.id)
          .slice(0, limit)
          .map(({ username, best_score, games_played }) => ({ username, best_score, games_played }));
      }
      return db.users.filter(u => u.games_played > 0).sort(order).slice(0, limit)
        .map(u => ({ username: u.username, best_score: u.best_score, games_played: u.games_played }));
    },
    async rankOf(user) {
      if (!user || !user.games_played) return null;
      const list = db.users.filter(u => u.games_played > 0).sort(order);
      const i = list.findIndex(u => u.id === user.id);
      return i < 0 ? null : i + 1;
    },
    async close() { await chain; }
  };
}

/* ------------------------------------------------------------------ init */
async function initStore(env, dataDir) {
  const wanted = String(env.STORAGE || 'auto').toLowerCase();
  if (wanted !== 'file') {
    try {
      const store = await createMysqlStore({
        host: env.DB_HOST || 'localhost',
        port: Number(env.DB_PORT || 3306),
        user: env.DB_USER || 'root',
        password: env.DB_PASSWORD || '',
        database: env.DB_NAME || 'm5k'
      });
      await store.ping();
      return store;
    } catch (e) {
      if (wanted === 'mysql') throw e;
      console.warn('[store] تعذر الاتصال بـ MySQL (' + (e.code || e.message) + ') — سيتم حفظ الحسابات في ملف داخل: ' + dataDir);
    }
  }
  return createFileStore(dataDir);
}

module.exports = { initStore, createFileStore };
