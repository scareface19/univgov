import { MongoClient, Db } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let _clientPromise: Promise<MongoClient> | null = null;

function createClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
  }
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(uri).connect();
    }
    return global._mongoClientPromise;
  }
  return new MongoClient(uri).connect();
}

// Lazy proxy so the module can be imported at build time without MONGODB_URI
const clientPromise = new Proxy({} as Promise<MongoClient>, {
  get(_target, prop) {
    const promise = _clientPromise ?? (_clientPromise = createClientPromise());
    return (promise as any)[prop];
  },
});

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
