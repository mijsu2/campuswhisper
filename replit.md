# Anonymous Complaint Website

## Overview

This is a full-stack anonymous complaint and feedback system built for educational institutions. The platform allows students, faculty, and staff to submit complaints and suggestions anonymously while providing administrators with tools to monitor, categorize, and resolve issues. The system features a React frontend with Tailwind CSS for styling, an Express.js backend, and PostgreSQL database with Drizzle ORM for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Charts**: Chart.js for data visualization

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with JSON responses
- **Middleware**: Custom logging, error handling, and CORS support
- **Validation**: Zod schemas for request/response validation
- **Storage Layer**: Abstracted storage interface with in-memory implementation

### Database Schema
The system uses PostgreSQL with Drizzle ORM and includes three main entities:
- **Users**: Admin authentication with username/password
- **Complaints**: Anonymous complaint submissions with categories, priorities, and status tracking
- **Suggestions**: Positive feedback and improvement suggestions

Key features include:
- UUID primary keys for security
- Reference ID system for anonymous complaint tracking
- Status workflow (pending → under_review → resolved)
- Category-based organization
- Timestamped records with audit trails

### Component Architecture
- **Layout Components**: Sidebar navigation, security banner, responsive design
- **Form Components**: Floating label inputs, category selectors, multi-step forms
- **Data Components**: Issue cards, stats cards, collapsible content
- **Chart Components**: Category distribution and trends visualization
- **UI Components**: Complete design system with consistent theming

### Security & Privacy Design
- Anonymous submission system with optional contact information
- Reference ID tracking without user identification
- Secure admin panel with role-based access
- Input validation and sanitization at all levels

## External Dependencies

### Core Framework Dependencies
- **React & React DOM**: Frontend framework and rendering
- **Express.js**: Backend web framework
- **TypeScript**: Type safety across the entire stack

### Database & ORM
- **@neondatabase/serverless**: PostgreSQL database connection
- **Drizzle ORM**: Type-safe database queries and migrations
- **Drizzle Kit**: Database migration and schema management tools

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives
- **Shadcn/ui**: Pre-built component library
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### State Management & Data Fetching
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form state and validation
- **Zod**: Schema validation and type inference

### Routing & Navigation
- **Wouter**: Lightweight client-side routing

### Data Visualization
- **Chart.js**: Interactive charts and graphs for admin dashboard

### Development & Build Tools
- **Vite**: Fast development server and build tool
- **ESBuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing and optimization
- **Autoprefixer**: CSS vendor prefix automation

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Date & Time Utilities
- **date-fns**: Date manipulation and formatting library

### Firebase Integration
- **Firebase Project**: campuswhispers-9edfe
- **Configuration Applied**: Client-side API key and project settings configured
- **Firestore Database**: Ready for connection pending service account credentials
- **Current Storage**: In-memory (temporary) until Firestore credentials are provided