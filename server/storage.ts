import { type User, type InsertUser, type Complaint, type InsertComplaint, type Suggestion, type InsertSuggestion } from "@shared/schema";
import { randomUUID } from "crypto";
import { FirebaseStorage } from './firebase-storage';

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  verifyPassword(username: string, password: string): Promise<User | null>;
  updateUserPassword(id: string, newPassword: string): Promise<boolean>;
  initializeDefaultAdmin(): Promise<void>;
  
  // Complaints
  createComplaint(complaint: InsertComplaint): Promise<Complaint>;
  getComplaints(): Promise<Complaint[]>;
  getComplaintByReference(referenceId: string): Promise<Complaint | undefined>;
  updateComplaintStatus(id: string, status: string, resolution?: string): Promise<Complaint | undefined>;
  getComplaintsByStatus(status: string): Promise<Complaint[]>;
  getComplaintsByCategory(category: string): Promise<Complaint[]>;
  
  // Suggestions
  createSuggestion(suggestion: InsertSuggestion): Promise<Suggestion>;
  getSuggestions(): Promise<Suggestion[]>;
  updateSuggestionStatus(id: string, status: string): Promise<Suggestion | undefined>;
  
  // Analytics
  getComplaintStats(): Promise<{
    total: number;
    pending: number;
    underReview: number;
    resolved: number;
    byCategory: Record<string, number>;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private complaints: Map<string, Complaint>;
  private suggestions: Map<string, Suggestion>;
  private complaintCounter: number = 1;

  constructor() {
    this.users = new Map();
    this.complaints = new Map();
    this.suggestions = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async verifyPassword(username: string, password: string): Promise<User | null> {
    const user = await this.getUserByUsername(username);
    if (!user) return null;
    return user.password === password ? user : null;
  }

  async updateUserPassword(id: string, newPassword: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;
    const updatedUser = { ...user, password: newPassword };
    this.users.set(id, updatedUser);
    return true;
  }

  async initializeDefaultAdmin(): Promise<void> {
    const existingAdmin = await this.getUserByUsername('admin');
    if (!existingAdmin) {
      await this.createUser({
        username: 'admin',
        password: 'admin123'
      });
    }
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    const id = randomUUID();
    const referenceId = `REF-2024-${String(this.complaintCounter++).padStart(4, '0')}`;
    const now = new Date();
    
    const complaint: Complaint = {
      ...insertComplaint,
      id,
      referenceId,
      status: "pending",
      assignedTo: null,
      resolution: null,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
      priority: insertComplaint.priority || "medium",
      contactEmail: insertComplaint.contactEmail || null,
    };
    
    this.complaints.set(id, complaint);
    return complaint;
  }

  async getComplaints(): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getComplaintByReference(referenceId: string): Promise<Complaint | undefined> {
    return Array.from(this.complaints.values()).find(
      (complaint) => complaint.referenceId === referenceId
    );
  }

  async updateComplaintStatus(id: string, status: string, resolution?: string): Promise<Complaint | undefined> {
    const complaint = this.complaints.get(id);
    if (!complaint) return undefined;

    const updatedComplaint: Complaint = {
      ...complaint,
      status,
      resolution: resolution || complaint.resolution,
      updatedAt: new Date(),
      resolvedAt: status === "resolved" ? new Date() : complaint.resolvedAt,
    };

    this.complaints.set(id, updatedComplaint);
    return updatedComplaint;
  }

  async getComplaintsByStatus(status: string): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).filter(
      (complaint) => complaint.status === status
    );
  }

  async getComplaintsByCategory(category: string): Promise<Complaint[]> {
    return Array.from(this.complaints.values()).filter(
      (complaint) => complaint.category === category
    );
  }

  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    const id = randomUUID();
    const now = new Date();
    
    const suggestion: Suggestion = {
      ...insertSuggestion,
      id,
      status: "pending",
      createdAt: now,
      updatedAt: now,
      benefits: insertSuggestion.benefits || null,
    };
    
    this.suggestions.set(id, suggestion);
    return suggestion;
  }

  async getSuggestions(): Promise<Suggestion[]> {
    return Array.from(this.suggestions.values()).sort(
      (a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async updateSuggestionStatus(id: string, status: string): Promise<Suggestion | undefined> {
    const suggestion = this.suggestions.get(id);
    if (!suggestion) return undefined;

    const updatedSuggestion: Suggestion = {
      ...suggestion,
      status,
      updatedAt: new Date(),
    };

    this.suggestions.set(id, updatedSuggestion);
    return updatedSuggestion;
  }

  async getComplaintStats(): Promise<{
    total: number;
    pending: number;
    underReview: number;
    resolved: number;
    byCategory: Record<string, number>;
  }> {
    const complaints = Array.from(this.complaints.values());
    const stats = {
      total: complaints.length,
      pending: complaints.filter(c => c.status === "pending").length,
      underReview: complaints.filter(c => c.status === "under_review").length,
      resolved: complaints.filter(c => c.status === "resolved").length,
      byCategory: {} as Record<string, number>,
    };

    // Count by category
    complaints.forEach(complaint => {
      stats.byCategory[complaint.category] = (stats.byCategory[complaint.category] || 0) + 1;
    });

    return stats;
  }
}

// Initialize Firestore storage
let storage: IStorage;

try {
  // Use Firestore with client-side Firebase SDK
  storage = new FirebaseStorage();
  console.log('Using Firestore database for campuswhispers-9edfe');
} catch (error) {
  console.error('Error initializing Firestore, falling back to in-memory:', error);
  storage = new MemStorage();
  console.log('Using in-memory storage (Firestore initialization failed)');
}

export { storage };
