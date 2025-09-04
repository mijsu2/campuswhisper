import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertComplaintSchema, insertSuggestionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all complaints
  app.get("/api/complaints", async (req, res) => {
    try {
      const complaints = await storage.getComplaints();
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints" });
    }
  });

  // Get complaint by reference ID
  app.get("/api/complaints/:referenceId", async (req, res) => {
    try {
      const complaint = await storage.getComplaintByReference(req.params.referenceId);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaint" });
    }
  });

  // Create new complaint
  app.post("/api/complaints", async (req, res) => {
    try {
      const validatedData = insertComplaintSchema.parse(req.body);
      const complaint = await storage.createComplaint(validatedData);
      res.status(201).json(complaint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid complaint data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create complaint" });
      }
    }
  });

  // Update complaint status
  app.patch("/api/complaints/:id/status", async (req, res) => {
    try {
      const { status, resolution } = req.body;
      const complaint = await storage.updateComplaintStatus(req.params.id, status, resolution);
      if (!complaint) {
        return res.status(404).json({ message: "Complaint not found" });
      }
      res.json(complaint);
    } catch (error) {
      res.status(500).json({ message: "Failed to update complaint status" });
    }
  });

  // Get complaints by status
  app.get("/api/complaints/status/:status", async (req, res) => {
    try {
      const complaints = await storage.getComplaintsByStatus(req.params.status);
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints by status" });
    }
  });

  // Get complaints by category
  app.get("/api/complaints/category/:category", async (req, res) => {
    try {
      const complaints = await storage.getComplaintsByCategory(req.params.category);
      res.json(complaints);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch complaints by category" });
    }
  });

  // Get all suggestions
  app.get("/api/suggestions", async (req, res) => {
    try {
      const suggestions = await storage.getSuggestions();
      res.json(suggestions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch suggestions" });
    }
  });

  // Create new suggestion
  app.post("/api/suggestions", async (req, res) => {
    try {
      const validatedData = insertSuggestionSchema.parse(req.body);
      const suggestion = await storage.createSuggestion(validatedData);
      res.status(201).json(suggestion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid suggestion data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create suggestion" });
      }
    }
  });

  // Update suggestion status
  app.patch("/api/suggestions/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      const suggestion = await storage.updateSuggestionStatus(req.params.id, status);
      if (!suggestion) {
        return res.status(404).json({ message: "Suggestion not found" });
      }
      res.json(suggestion);
    } catch (error) {
      res.status(500).json({ message: "Failed to update suggestion status" });
    }
  });

  // Get complaint statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getComplaintStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
