export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'admin';
  enrolledCourses: string[]; // Course IDs
  completedLessons: string[]; // Lesson IDs
  examResults: Record<string, number>; // score percentage
  certificates: Certificate[];
  lastActiveCourseId?: string;
  phone?: string;
  createdAt: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseName: string;
  date: number;
  qrCode: string;
}
