export const CATEGORIES = [
  {
    id: "academics",
    name: "Academics",
    icon: "book",
    color: "bg-blue-500",
    description: "Academic concerns, curriculum, and teaching quality"
  },
  {
    id: "facilities",
    name: "Facilities",
    icon: "building",
    color: "bg-green-500",
    description: "Campus buildings, equipment, and infrastructure"
  },
  {
    id: "student-discipline",
    name: "Student Discipline",
    icon: "users",
    color: "bg-purple-500",
    description: "Student behavior and disciplinary issues"
  },
  {
    id: "teachers-staff",
    name: "Teachers & Staff",
    icon: "chalkboard-teacher",
    color: "bg-orange-500",
    description: "Faculty and staff related concerns"
  },
  {
    id: "clubs-activities",
    name: "Clubs & Activities",
    icon: "futbol",
    color: "bg-red-500",
    description: "Extracurricular activities and clubs"
  }
] as const;

export const PRIORITY_LEVELS = [
  { id: "low", name: "Low", color: "bg-gray-500" },
  { id: "medium", name: "Medium", color: "bg-yellow-500" },
  { id: "high", name: "High", color: "bg-orange-500" },
  { id: "urgent", name: "Urgent", color: "bg-red-500" }
] as const;

export const STATUS_OPTIONS = [
  { id: "pending", name: "Pending Review", color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800" },
  { id: "under_review", name: "Under Review", color: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800" },
  { id: "resolved", name: "Resolved", color: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800" },
];

export const SUGGESTION_TYPES = [
  { id: "improvement", name: "Campus Improvement" },
  { id: "service", name: "New Service" },
  { id: "policy", name: "Policy Change" },
  { id: "event", name: "Event/Activity" },
  { id: "technology", name: "Technology Enhancement" },
  { id: "other", name: "Other" }
] as const;