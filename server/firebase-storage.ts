import { db } from './firebase-config';
import { type User, type InsertUser, type Complaint, type InsertComplaint, type Suggestion, type InsertSuggestion } from "@shared/schema";
import { randomUUID } from "crypto";
import { IStorage } from './storage';

export class FirebaseStorage implements IStorage {
  private complaintCounter: number = 1;

  constructor() {
    this.initializeCounter();
  }

  private async initializeCounter() {
    // Get the highest reference ID to continue counter
    try {
      const snapshot = await db.collection('complaints').orderBy('referenceId', 'desc').limit(1).get();
      if (!snapshot.empty) {
        const lastRef = snapshot.docs[0].data().referenceId;
        const match = lastRef.match(/REF-\d{4}-(\d{4})/);
        if (match) {
          this.complaintCounter = parseInt(match[1]) + 1;
        }
      }
    } catch (error) {
      console.error('Error initializing counter:', error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    try {
      const doc = await db.collection('users').doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } as User : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const snapshot = await db.collection('users').where('username', '==', username).limit(1).get();
      return snapshot.empty ? undefined : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User;
    } catch (error) {
      console.error('Error getting user by username:', error);
      return undefined;
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      const id = randomUUID();
      const user: User = { ...insertUser, id };
      await db.collection('users').doc(id).set(user);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async createComplaint(insertComplaint: InsertComplaint): Promise<Complaint> {
    try {
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
      
      await db.collection('complaints').doc(id).set(complaint);
      return complaint;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  }

  async getComplaints(): Promise<Complaint[]> {
    try {
      const snapshot = await db.collection('complaints').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
    } catch (error) {
      console.error('Error getting complaints:', error);
      return [];
    }
  }

  async getComplaintByReference(referenceId: string): Promise<Complaint | undefined> {
    try {
      const snapshot = await db.collection('complaints').where('referenceId', '==', referenceId).limit(1).get();
      return snapshot.empty ? undefined : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Complaint;
    } catch (error) {
      console.error('Error getting complaint by reference:', error);
      return undefined;
    }
  }

  async updateComplaintStatus(id: string, status: string, resolution?: string): Promise<Complaint | undefined> {
    try {
      const docRef = db.collection('complaints').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) return undefined;

      const updateData: any = {
        status,
        updatedAt: new Date(),
      };

      if (resolution) {
        updateData.resolution = resolution;
      }

      if (status === "resolved") {
        updateData.resolvedAt = new Date();
      }

      await docRef.update(updateData);
      
      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Complaint;
    } catch (error) {
      console.error('Error updating complaint status:', error);
      return undefined;
    }
  }

  async getComplaintsByStatus(status: string): Promise<Complaint[]> {
    try {
      const snapshot = await db.collection('complaints').where('status', '==', status).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
    } catch (error) {
      console.error('Error getting complaints by status:', error);
      return [];
    }
  }

  async getComplaintsByCategory(category: string): Promise<Complaint[]> {
    try {
      const snapshot = await db.collection('complaints').where('category', '==', category).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
    } catch (error) {
      console.error('Error getting complaints by category:', error);
      return [];
    }
  }

  async createSuggestion(insertSuggestion: InsertSuggestion): Promise<Suggestion> {
    try {
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
      
      await db.collection('suggestions').doc(id).set(suggestion);
      return suggestion;
    } catch (error) {
      console.error('Error creating suggestion:', error);
      throw error;
    }
  }

  async getSuggestions(): Promise<Suggestion[]> {
    try {
      const snapshot = await db.collection('suggestions').orderBy('createdAt', 'desc').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Suggestion));
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  async updateSuggestionStatus(id: string, status: string): Promise<Suggestion | undefined> {
    try {
      const docRef = db.collection('suggestions').doc(id);
      const doc = await docRef.get();
      
      if (!doc.exists) return undefined;

      await docRef.update({
        status,
        updatedAt: new Date(),
      });
      
      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() } as Suggestion;
    } catch (error) {
      console.error('Error updating suggestion status:', error);
      return undefined;
    }
  }

  async getComplaintStats(): Promise<{
    total: number;
    pending: number;
    underReview: number;
    resolved: number;
    byCategory: Record<string, number>;
  }> {
    try {
      const snapshot = await db.collection('complaints').get();
      const complaints = snapshot.docs.map(doc => doc.data());
      
      const stats = {
        total: complaints.length,
        pending: complaints.filter((c: any) => c.status === "pending").length,
        underReview: complaints.filter((c: any) => c.status === "under_review").length,
        resolved: complaints.filter((c: any) => c.status === "resolved").length,
        byCategory: {} as Record<string, number>,
      };

      // Count by category
      complaints.forEach((complaint: any) => {
        stats.byCategory[complaint.category] = (stats.byCategory[complaint.category] || 0) + 1;
      });

      return stats;
    } catch (error) {
      console.error('Error getting complaint stats:', error);
      return {
        total: 0,
        pending: 0,
        underReview: 0,
        resolved: 0,
        byCategory: {},
      };
    }
  }
}