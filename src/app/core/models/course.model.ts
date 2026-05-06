export type CourseLevel = 'Básico' | 'Intermedio' | 'Avanzado' | 'Experto' | string;

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  category: string;
  level: CourseLevel;
  duration: string;
  lessonsCount: number;
  rating: number;
  instructor: string;
  video: string;
  featured?: boolean;
}

export interface CoursePath {
  courseId: string;
  levels: LevelStructure[];
}

export interface LevelStructure {
  id: number;
  name: string;
  lessons: Lesson[];
  exam?: Exam;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  videoUrl?: string;
  duration: string;
}

export interface Exam {
  id: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
}
