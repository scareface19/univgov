import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(process.cwd(), 'university.db');

declare global {
  // eslint-disable-next-line no-var
  var _sqDb: Database.Database | undefined;
}

let _prodDb: Database.Database | undefined;

export function getDb(): Database.Database {
  if (process.env.NODE_ENV === 'development') {
    if (!global._sqDb) {
      global._sqDb = openDatabase();
    }
    return global._sqDb;
  }
  if (!_prodDb) {
    _prodDb = openDatabase();
  }
  return _prodDb;
}

function openDatabase(): Database.Database {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
  createSchema(db);
  return db;
}

function createSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      digitalId TEXT UNIQUE NOT NULL,
      department TEXT,
      avatar TEXT,
      permissions TEXT NOT NULL DEFAULT '[]',
      isActive INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseCode TEXT NOT NULL,
      courseName TEXT NOT NULL,
      courseNameAr TEXT,
      credits INTEGER NOT NULL DEFAULT 3,
      faculty TEXT,
      department TEXT,
      semester TEXT,
      professorId INTEGER,
      capacity INTEGER NOT NULL DEFAULT 30,
      enrolled INTEGER NOT NULL DEFAULT 0,
      schedule TEXT NOT NULL DEFAULT '[]',
      description TEXT,
      prerequisites TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      courseId INTEGER NOT NULL,
      enrollmentDate TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'enrolled',
      attendance INTEGER NOT NULL DEFAULT 0,
      grade TEXT,
      updatedAt TEXT,
      UNIQUE(studentId, courseId)
    );
    CREATE TABLE IF NOT EXISTS grades (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      courseId INTEGER NOT NULL,
      courseCode TEXT,
      courseName TEXT,
      semester TEXT NOT NULL,
      academicYear TEXT,
      grade REAL,
      letterGrade TEXT,
      credits INTEGER,
      professorId INTEGER,
      professorName TEXT,
      examDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      documentId TEXT UNIQUE NOT NULL,
      userId INTEGER NOT NULL,
      userName TEXT,
      type TEXT NOT NULL,
      typeAr TEXT,
      title TEXT NOT NULL,
      titleAr TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      requestedDate TEXT NOT NULL,
      processedDate TEXT,
      expiryDate TEXT,
      fileUrl TEXT,
      metadata TEXT NOT NULL DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      paymentMethod TEXT,
      transactionId TEXT,
      description TEXT,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      staffId INTEGER NOT NULL,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      titleAr TEXT,
      content TEXT NOT NULL,
      contentAr TEXT,
      authorId INTEGER NOT NULL,
      targetRoles TEXT NOT NULL DEFAULT '[]',
      priority INTEGER NOT NULL DEFAULT 0,
      publishedAt TEXT NOT NULL,
      expiresAt TEXT,
      attachments TEXT NOT NULL DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS partnerships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      companyName TEXT NOT NULL,
      companyNameAr TEXT,
      sector TEXT,
      description TEXT,
      descriptionAr TEXT,
      contactPerson TEXT,
      email TEXT,
      phone TEXT,
      website TEXT,
      status TEXT NOT NULL DEFAULT 'active',
      startDate TEXT NOT NULL,
      endDate TEXT,
      opportunitiesCount INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS internships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partnershipId INTEGER,
      title TEXT NOT NULL,
      titleAr TEXT,
      description TEXT,
      descriptionAr TEXT,
      requirements TEXT NOT NULL DEFAULT '[]',
      duration TEXT,
      positions INTEGER NOT NULL DEFAULT 1,
      applicationsCount INTEGER NOT NULL DEFAULT 0,
      location TEXT,
      type TEXT,
      status TEXT NOT NULL DEFAULT 'open',
      postedAt TEXT NOT NULL,
      deadline TEXT
    );
    CREATE TABLE IF NOT EXISTS community_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      authorId INTEGER NOT NULL,
      content TEXT NOT NULL,
      contentAr TEXT,
      type TEXT,
      tags TEXT NOT NULL DEFAULT '[]',
      attachments TEXT NOT NULL DEFAULT '[]',
      likes INTEGER NOT NULL DEFAULT 0,
      comments TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      participants TEXT NOT NULL,
      lastMessage TEXT,
      lastMessageAt TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS conversation_unread (
      conversationId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (conversationId, userId)
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversationId INTEGER NOT NULL,
      senderId INTEGER NOT NULL,
      senderName TEXT,
      recipientId INTEGER NOT NULL,
      recipientName TEXT,
      content TEXT NOT NULL,
      read INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS suggestions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      titleAr TEXT,
      description TEXT,
      category TEXT,
      authorId INTEGER NOT NULL,
      authorName TEXT,
      status TEXT NOT NULL DEFAULT 'recue',
      votes INTEGER NOT NULL DEFAULT 0,
      voters TEXT NOT NULL DEFAULT '[]',
      impact TEXT NOT NULL DEFAULT 'medium',
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS forums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      titleAr TEXT,
      description TEXT,
      category TEXT,
      authorId INTEGER NOT NULL,
      authorName TEXT,
      participants TEXT NOT NULL DEFAULT '[]',
      postsCount INTEGER NOT NULL DEFAULT 0,
      lastActivity TEXT NOT NULL,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS forum_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      forumId INTEGER NOT NULL,
      authorId INTEGER NOT NULL,
      authorName TEXT,
      content TEXT NOT NULL,
      contentAr TEXT,
      likes INTEGER NOT NULL DEFAULT 0,
      likedBy TEXT NOT NULL DEFAULT '[]',
      replies TEXT NOT NULL DEFAULT '[]',
      parentPostId INTEGER,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      titleAr TEXT,
      description TEXT,
      options TEXT NOT NULL DEFAULT '[]',
      totalVotes INTEGER NOT NULL DEFAULT 0,
      deadline TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      category TEXT,
      createdAt TEXT NOT NULL,
      createdBy INTEGER
    );
    CREATE TABLE IF NOT EXISTS vote_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      voteId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      optionId TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      UNIQUE(voteId, userId)
    );
    CREATE TABLE IF NOT EXISTS complaints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      complaintId TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      titleAr TEXT,
      description TEXT,
      category TEXT,
      priority TEXT,
      status TEXT NOT NULL DEFAULT 'en_attente',
      submittedBy INTEGER NOT NULL,
      submittedByName TEXT,
      submittedDate TEXT NOT NULL,
      lastUpdate TEXT NOT NULL,
      assignedTo INTEGER,
      assignedToName TEXT,
      resolution TEXT,
      timeline TEXT NOT NULL DEFAULT '[]'
    );
    CREATE TABLE IF NOT EXISTS scholarships (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      studentId INTEGER NOT NULL,
      studentName TEXT,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      typeAr TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      semester TEXT,
      academicYear TEXT,
      criteria TEXT,
      disbursedAmount REAL NOT NULL DEFAULT 0,
      startDate TEXT,
      endDate TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );
  `);
}

export function parseJson<T = any>(value: string | null | undefined, fallback: T): T {
  if (value === null || value === undefined || value === '') return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

export function toJson(value: any): string {
  return JSON.stringify(value ?? []);
}
