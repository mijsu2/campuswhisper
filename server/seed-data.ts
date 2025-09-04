
import { FirebaseStorage } from './firebase-storage.js';

const storage = new FirebaseStorage();

const complaints = [
  {
    subject: "Broken air conditioning in Library",
    description: "The AC has been broken for 3 days in the main library study area. It's too hot to concentrate on studying.",
    category: "facilities",
    priority: "high"
  },
  {
    subject: "Professor consistently late to class",
    description: "Prof. Johnson is 15-20 minutes late to every lecture, cutting into our learning time.",
    category: "academics",
    priority: "medium"
  },
  {
    subject: "Cafeteria food quality concerns",
    description: "Multiple students got food poisoning from the cafeteria last week. Food safety needs immediate attention.",
    category: "facilities",
    priority: "high"
  },
  {
    subject: "Discriminatory behavior in dormitory",
    description: "Resident advisor making inappropriate comments about international students.",
    category: "student-discipline",
    priority: "high"
  },
  {
    subject: "Outdated course materials",
    description: "Computer Science textbooks are from 2015, technology has changed significantly since then.",
    category: "academics",
    priority: "medium"
  },
  {
    subject: "Parking shortage on campus",
    description: "Not enough parking spaces for commuter students, often have to park off-campus and walk.",
    category: "facilities",
    priority: "medium"
  },
  {
    subject: "Inappropriate conduct by teaching assistant",
    description: "TA making students uncomfortable with personal questions during office hours.",
    category: "teachers-staff",
    priority: "high"
  },
  {
    subject: "Chemistry lab equipment malfunction",
    description: "Several microscopes and centrifuges in the chemistry lab are not working properly.",
    category: "facilities",
    priority: "medium"
  },
  {
    subject: "Unfair grading practices",
    description: "Professor giving different grades for identical work based on student background.",
    category: "academics",
    priority: "high"
  },
  {
    subject: "Club funding distribution issues",
    description: "Student government not transparently distributing funds to registered clubs.",
    category: "clubs-activities",
    priority: "low"
  }
];

const suggestions = [
  {
    title: "24/7 Study Spaces",
    type: "facilities",
    description: "Create dedicated 24/7 study spaces for students during exam periods.",
    benefits: "Students would have quiet spaces to study at any time, improving academic performance."
  },
  {
    title: "Mobile Campus App",
    type: "services",
    description: "Develop a mobile app for campus services, class schedules, and announcements.",
    benefits: "Easier access to campus information and improved communication between students and administration."
  },
  {
    title: "Mental Health Support Expansion",
    type: "services",
    description: "Add more counselors and mental health resources for students.",
    benefits: "Better student wellbeing and mental health support during stressful academic periods."
  },
  {
    title: "Green Campus Initiative",
    type: "policy",
    description: "Implement recycling programs and solar panels to make campus more environmentally friendly.",
    benefits: "Reduced environmental impact and lower energy costs for the university."
  },
  {
    title: "Career Services Enhancement",
    type: "services",
    description: "Expand career counseling services and industry partnerships for internships.",
    benefits: "Better job placement rates and career preparation for graduating students."
  }
];

async function seedData() {
  console.log('Starting to seed test data...');
  
  try {
    // Add complaints
    console.log('Adding complaints...');
    for (const complaint of complaints) {
      await storage.createComplaint(complaint);
      console.log(`Added complaint: ${complaint.subject}`);
    }
    
    // Add suggestions
    console.log('Adding suggestions...');
    for (const suggestion of suggestions) {
      await storage.createSuggestion(suggestion);
      console.log(`Added suggestion: ${suggestion.title}`);
    }
    
    console.log('✅ Test data seeded successfully!');
    console.log(`Added ${complaints.length} complaints and ${suggestions.length} suggestions`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
}

// Run the seed function
seedData().then(() => {
  process.exit(0);
}).catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
