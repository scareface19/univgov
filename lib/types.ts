import { ObjectId } from 'mongodb';

export type UserRole = 'student' | 'professor' | 'staff' | 'admin';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  digitalId: string;
  avatar?: string;
  phone?: string;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
  permissions: string[];
  isActive: boolean;
}

export interface Student extends User {
  studentId: string;
  academicYear: number;
  faculty: string;
  major: string;
  enrollmentDate: Date;
  gpa: number;
  status: 'active' | 'suspended' | 'graduated';
}

export interface Professor extends User {
  professorId: string;
  faculty: string;
  specialization: string;
  courses: string[];
  officeHours?: string;
}

export interface Staff extends User {
  staffId: string;
  position: string;
  department: string;
}

export interface Course {
  _id?: ObjectId;
  courseCode: string;
  courseName: string;
  courseNameAr: string;
  credits: number;
  faculty: string;
  department: string;
  semester: string;
  professorId: string;
  capacity: number;
  enrolled: number;
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
    room: string;
  }[];
  description: string;
  prerequisites?: string[];
  createdAt: Date;
}

export interface Enrollment {
  _id?: ObjectId;
  studentId: string;
  courseId: string;
  enrollmentDate: Date;
  status: 'enrolled' | 'completed' | 'dropped' | 'failed';
  grade?: number;
  attendance: number;
}

export interface Payment {
  _id?: ObjectId;
  userId: string;
  amount: number;
  type: 'tuition' | 'registration' | 'dormitory' | 'cafeteria' | 'library' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId?: string;
  description: string;
  createdAt: Date;
}

export interface Appointment {
  _id?: ObjectId;
  studentId: string;
  staffId: string;
  type: 'document' | 'certificate' | 'meeting' | 'consultation';
  date: Date;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

export interface Announcement {
  _id?: ObjectId;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  authorId: string;
  targetRoles: UserRole[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  publishedAt: Date;
  expiresAt?: Date;
  attachments?: string[];
}

export interface FinancialRecord {
  _id?: ObjectId;
  departmentId: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdBy: string;
  approvedBy?: string;
}

export interface Partnership {
  _id?: ObjectId;
  companyName: string;
  companyNameAr: string;
  sector: string;
  description: string;
  descriptionAr: string;
  contactPerson: string;
  email: string;
  phone: string;
  website?: string;
  status: 'active' | 'inactive' | 'pending';
  startDate: Date;
  endDate?: Date;
  opportunitiesCount: number;
}

export interface Internship {
  _id?: ObjectId;
  partnershipId: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  requirements: string[];
  duration: string;
  positions: number;
  applicationsCount: number;
  location: string;
  type: 'internship' | 'job' | 'project';
  status: 'open' | 'closed';
  postedAt: Date;
  deadline: Date;
}

export interface CommunityPost {
  _id?: ObjectId;
  authorId: string;
  content: string;
  contentAr: string;
  type: 'announcement' | 'discussion' | 'question' | 'idea';
  tags: string[];
  likes: number;
  comments: {
    userId: string;
    content: string;
    createdAt: Date;
  }[];
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  _id?: ObjectId;
  type: 'academic' | 'financial' | 'engagement' | 'performance';
  metrics: Record<string, any>;
  period: {
    start: Date;
    end: Date;
  };
  generatedAt: Date;
}

// Communication types
export interface Suggestion {
  _id?: ObjectId;
  title: string;
  titleAr: string;
  description: string;
  authorId: string;
  authorName: string;
  category: 'Infrastructure' | 'Pédagogie' | 'Digital' | 'Innovation';
  status: 'recue' | 'en_cours' | 'validee' | 'rejetee';
  votes: number;
  voters: string[]; // Array of user IDs who voted
  impact: 'high' | 'medium' | 'low';
  createdAt: Date;
  updatedAt: Date;
}

export interface Vote {
  _id?: ObjectId;
  title: string;
  titleAr: string;
  description: string;
  options: {
    id: number;
    label: string;
    labelAr?: string;
    votes: number;
  }[];
  totalVotes: number;
  deadline: Date;
  status: 'active' | 'closed';
  category: string;
  createdAt: Date;
  createdBy: string;
}

export interface VoteRecord {
  _id?: ObjectId;
  voteId: string;
  userId: string;
  optionId: number;
  createdAt: Date;
}

export interface Message {
  _id?: ObjectId;
  conversationId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  _id?: ObjectId;
  participants: string[]; // Array of user IDs
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: Record<string, number>; // userId -> count
  createdAt: Date;
  updatedAt: Date;
}

export interface Forum {
  _id?: ObjectId;
  title: string;
  titleAr: string;
  description: string;
  category: string;
  authorId: string;
  authorName: string;
  participants: string[];
  postsCount: number;
  lastActivity: Date;
  createdAt: Date;
}

export interface ForumPost {
  _id?: ObjectId;
  forumId: string;
  parentPostId?: string; // For replies
  authorId: string;
  authorName: string;
  content: string;
  contentAr?: string;
  likes: number;
  likedBy: string[];
  replies?: ForumPost[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  _id?: ObjectId;
  documentId: string; // DOC-2025-001 format
  userId: string;
  userName: string;
  type: 'certificate' | 'transcript' | 'attestation' | 'other';
  typeAr: string;
  title: string;
  titleAr: string;
  status: 'pending' | 'processing' | 'available' | 'expired';
  requestedDate: Date;
  processedDate?: Date;
  expiryDate?: Date;
  fileUrl?: string;
  metadata?: Record<string, any>;
}

export interface Grade {
  _id?: ObjectId;
  studentId: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  semester: string;
  academicYear: string;
  grade: number; // 0-100
  letterGrade: string; // A, B, C, D, F
  credits: number;
  professorId: string;
  professorName: string;
  examDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentGradeSummary {
  studentId: string;
  totalCredits: number;
  earnedCredits: number;
  gpa: number;
  semesters: {
    semester: string;
    courses: Grade[];
    semesterGPA: number;
    credits: number;
  }[];
}

export interface Complaint {
  _id?: ObjectId;
  complaintId: string; // REC-2025-001 format
  title: string;
  titleAr: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'en_attente' | 'en_cours' | 'resolue' | 'rejetee';
  submittedBy: string;
  submittedByName: string;
  submittedDate: Date;
  lastUpdate: Date;
  assignedTo?: string;
  assignedToName?: string;
  timeline: {
    date: Date;
    action: string;
    status: 'done' | 'current' | 'pending';
  }[];
  resolution?: string;
}

// Resources types
export interface Budget {
  _id?: ObjectId;
  year: number;
  facultyId?: string;
  facultyName: string;
  facultyNameAr?: string;
  departmentId?: string;
  departmentName?: string;
  allocated: number;
  spent: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Scholarship {
  _id?: ObjectId;
  studentId: string;
  studentName: string;
  amount: number;
  type: 'Excellence' | 'Mérite' | 'Sociale';
  typeAr: string;
  status: 'active' | 'pending' | 'expired' | 'suspended';
  semester: string;
  academicYear: string;
  criteria: {
    gpa?: number;
    attendance?: number;
    socialNeed?: boolean;
    [key: string]: any;
  };
  disbursedAmount: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  _id?: ObjectId;
  itemName: string;
  itemNameAr: string;
  category: string;
  quantity: number;
  available: number;
  inUse: number;
  maintenance: number;
  status: 'good' | 'maintenance' | 'out_of_service';
  location: string;
  building?: string;
  purchaseDate?: Date;
  warranty?: Date;
  value?: number;
  supplier?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnergyLog {
  _id?: ObjectId;
  month: number;
  year: number;
  electricity: number; // kWh
  water: number; // m³
  gas: number; // m³
  carbonFootprint: number; // T CO₂
  buildingId?: string;
  buildingName?: string;
  createdAt: Date;
}