import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db('hidab-university');
}

// Collections
export const Collections = {
  USERS: 'users',
  STUDENTS: 'students',
  PROFESSORS: 'professors',
  STAFF: 'staff',
  COURSES: 'courses',
  ENROLLMENTS: 'enrollments',
  GRADES: 'grades',
  DOCUMENTS: 'documents',
  PAYMENTS: 'payments',
  APPOINTMENTS: 'appointments',
  ANNOUNCEMENTS: 'announcements',
  FINANCIAL_RECORDS: 'financial_records',
  PARTNERSHIPS: 'partnerships',
  INTERNSHIPS: 'internships',
  COMMUNITY_POSTS: 'community_posts',
  ANALYTICS: 'analytics',
  // Communication
  MESSAGES: 'messages',
  CONVERSATIONS: 'conversations',
  SUGGESTIONS: 'suggestions',
  FORUMS: 'forums',
  FORUM_POSTS: 'forum_posts',
  VOTES: 'votes',
  VOTE_RECORDS: 'vote_records',
  COMPLAINTS: 'complaints',
  // Ressources
  BUDGETS: 'budgets',
  SCHOLARSHIPS: 'scholarships',
  INVENTORY: 'inventory',
  ENERGY_LOGS: 'energy_logs',
  // Gamification
  GAMIFICATION_POINTS: 'gamification_points',
  BADGES: 'badges',
  ACHIEVEMENTS: 'achievements',
  REWARDS: 'rewards',
};
