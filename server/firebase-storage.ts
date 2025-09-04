import { db } from './firebase-config';
import { type User, type InsertUser, type Complaint, type InsertComplaint, type Suggestion, type InsertSuggestion } from "@shared/schema";
import { randomUUID } from "crypto";
import { IStorage } from './storage';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';

export class FirebaseStorage implements IStorage {
  private complaintCounter: number = 1;

  constructor() {
    this.initializeCounter();
  }

  private async initializeCounter() {
    // Get the highest reference ID to continue counter
    try {
      const complaintsRef = collection(db, 'complaints');
      const q = query(complaintsRef, orderBy('referenceId', 'desc'), limit(1));
      const snapshot = await getDocs(q);
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
      const docRef = doc(db, 'users', id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as User : undefined;
    } catch (error) {
      console.error('Error getting user:', error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username), limit(1));
      const snapshot = await getDocs(q);
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
      const docRef = doc(db, 'users', id);
      await setDoc(docRef, user);
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
      
      const docRef = doc(db, 'complaints', id);
      await setDoc(docRef, complaint);
      return complaint;
    } catch (error) {
      console.error('Error creating complaint:', error);
      throw error;
    }
  }

  async getComplaints(): Promise<Complaint[]> {
    try {
      const complaintsRef = collection(db, 'complaints');
      const q = query(complaintsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
    } catch (error) {
      console.error('Error getting complaints:', error);
      return [];
    }
  }

  async getComplaintByReference(referenceId: string): Promise<Complaint | undefined> {
    try {
      const complaintsRef = collection(db, 'complaints');
      const q = query(complaintsRef, where('referenceId', '==', referenceId), limit(1));
      const snapshot = await getDocs(q);
      return snapshot.empty ? undefined : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Complaint;
    } catch (error) {
      console.error('Error getting complaint by reference:', error);
      return undefined;
    }
  }

  async updateComplaintStatus(id: string, status: string, resolution?: string): Promise<Complaint | undefined> {
    try {
      const docRef = doc(db, 'complaints', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;

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

      await updateDoc(docRef, updateData);
      
      const updatedDoc = await getDoc(docRef);
      return { id: updatedDoc.id, ...updatedDoc.data() } as Complaint;
    } catch (error) {
      console.error('Error updating complaint status:', error);
      return undefined;
    }
  }

  async getComplaintsByStatus(status: string): Promise<Complaint[]> {
    try {
      const complaintsRef = collection(db, 'complaints');
      const q = query(complaintsRef, where('status', '==', status));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
    } catch (error) {
      console.error('Error getting complaints by status:', error);
      return [];
    }
  }

  async getComplaintsByCategory(category: string): Promise<Complaint[]> {
    try {
      const complaintsRef = collection(db, 'complaints');
      const q = query(complaintsRef, where('category', '==', category));
      const snapshot = await getDocs(q);
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
      
      const docRef = doc(db, 'suggestions', id);
      await setDoc(docRef, suggestion);
      return suggestion;
    } catch (error) {
      console.error('Error creating suggestion:', error);
      throw error;
    }
  }

  async getSuggestions(): Promise<Suggestion[]> {
    try {
      const suggestionsRef = collection(db, 'suggestions');
      const q = query(suggestionsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Suggestion));
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  async updateSuggestionStatus(id: string, status: string): Promise<Suggestion | undefined> {
    try {
      const docRef = doc(db, 'suggestions', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) return undefined;

      await updateDoc(docRef, {
        status,
        updatedAt: new Date(),
      });
      
      const updatedDoc = await getDoc(docRef);
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
      const complaintsRef = collection(db, 'complaints');
      const snapshot = await getDocs(complaintsRef);
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