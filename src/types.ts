export interface LearningOutcome {
  level: string; // Bloom's Taxonomy level
  outcome: string;
}

export interface Lesson {
  title: string;
  description: string;
  duration: string;
  videoGuide?: string;
  quizGuide?: string;
}

export interface Module {
  title: string;
  lessons: Lesson[];
  assignment?: string;
}

export interface Curriculum {
  id?: string;
  userId: string;
  topic: string;
  audience: string;
  duration: string;
  goals: string;
  learningOutcomes: LearningOutcome[];
  modules: Module[];
  syllabus: string;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "user" | "admin";
}
