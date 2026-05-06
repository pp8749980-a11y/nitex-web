import { Injectable, signal, inject } from '@angular/core';
import { Course } from '../models/course.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses = signal<Course[]>([
    {
      id: '1',
      title: "Secretaría Recepcionista y Servicio al Cliente",
      category: "Administración",
      shortDescription: "Domina las habilidades de atención y gestión de oficina.",
      fullDescription: "Formación integral para profesionales de recepción y servicio al cliente.",
      image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800",
      video: "https://www.youtube.com/embed/jfKfPfyJRdk",
      level: "Básico",
      duration: "40h",
      lessonsCount: 3,
      rating: 4.8,
      instructor: "Claudia Mendez",
      featured: true
    },
    {
      id: '2',
      title: "Estilista en Belleza",
      category: "Belleza",
      shortDescription: "Aprende las técnicas más avanzadas de estilismo.",
      fullDescription: "Curso completo de peluquería, colorimetría y tendencias.",
      image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=800",
      video: "https://www.youtube.com/embed/QzZk1YwF0xA",
      level: "Intermedio",
      duration: "60h",
      lessonsCount: 3,
      rating: 4.9,
      instructor: "Marco Antonio",
      featured: true
    },
    {
      id: '3',
      title: "Cajero Bancario Computarizado",
      category: "Finanzas",
      shortDescription: "Capacitación técnica para el sector bancario.",
      fullDescription: "Manejo de sistemas bancarios, conteo de dinero y atención al público.",
      image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=800",
      video: "https://www.youtube.com/embed/3xVQx0W9z5Q",
      level: "Básico",
      duration: "30h",
      lessonsCount: 3,
      rating: 4.7,
      instructor: "Roberto Silva",
      featured: true
    },
    {
      id: '4',
      title: "Uñas Acrílicas",
      category: "Estética",
      shortDescription: "Diseño y aplicación profesional de uñas.",
      fullDescription: "Técnicas de esculpido, mantenimiento y arte en uñas.",
      image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800",
      video: "https://www.youtube.com/embed/Y8v7k5kzF0g",
      level: "Básico",
      duration: "25h",
      lessonsCount: 3,
      rating: 4.9,
      instructor: "Laura Nails"
    },
    {
      id: '5',
      title: "Auxiliar en Farmacia",
      category: "Salud",
      shortDescription: "Gestión y dispensación de medicamentos.",
      fullDescription: "Conocimientos farmacéuticos, recetas y atención en farmacia.",
      image: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=800",
      video: "https://www.youtube.com/embed/Z6Kk7d2mP0A",
      level: "Intermedio",
      duration: "45h",
      lessonsCount: 3,
      rating: 4.8,
      instructor: "Dr. Sergio Peña"
    },
    {
      id: '6',
      title: "Barbería Profesional",
      category: "Belleza",
      shortDescription: "Cortes clásicos y modernos para caballeros.",
      fullDescription: "Técnicas de afeitado, diseño de barba y desvanecidos.",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800",
      video: "https://www.youtube.com/embed/9xWl3lFz3x8",
      level: "Básico",
      duration: "35h",
      lessonsCount: 3,
      rating: 5.0,
      instructor: "Victor Barber"
    },
    {
      id: '7',
      title: "Auxiliar de Enfermería",
      category: "Salud",
      shortDescription: "Cuidado básico y apoyo al paciente.",
      fullDescription: "Primeros auxilios, signos vitales y cuidados generales.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800",
      video: "https://www.youtube.com/embed/O5nskjZ_GoI",
      level: "Intermedio",
      duration: "80h",
      lessonsCount: 3,
      rating: 4.9,
      instructor: "Lic. Marta Lopez"
    },
    {
      id: '8',
      title: "Informática Básica",
      category: "Tecnología",
      shortDescription: "Domina Windows, Office e Internet.",
      fullDescription: "Uso eficiente de herramientas digitales para el día a día.",
      image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
      video: "https://www.youtube.com/embed/Y2fXvQ0kq5A",
      level: "Básico",
      duration: "20h",
      lessonsCount: 3,
      rating: 4.6,
      instructor: "Ing. Luis Castro"
    },
    {
      id: '9',
      title: "Estilismo en Cejas y Pestañas",
      category: "Belleza",
      shortDescription: "Perfecciona la mirada con técnicas modernas.",
      fullDescription: "Lifting, diseño de cejas y extensiones de pestañas.",
      image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800",
      video: "https://www.youtube.com/embed/J8l9s2FfP0Q",
      level: "Básico",
      duration: "15h",
      lessonsCount: 3,
      rating: 4.8,
      instructor: "Ana Beauty"
    },
    {
      id: '10',
      title: "Facial y Maquillaje",
      category: "Belleza",
      shortDescription: "Cuidado de la piel y arte del maquillaje.",
      fullDescription: "Tratamientos faciales y maquillaje para toda ocasión.",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800",
      video: "https://www.youtube.com/embed/1hHMwLxN6EM",
      level: "Básico",
      duration: "30h",
      lessonsCount: 3,
      rating: 4.9,
      instructor: "Elena Makeup"
    },
    {
      id: '11',
      title: "Inglés Básico",
      category: "Idiomas",
      shortDescription: "Primeros pasos para hablar inglés.",
      fullDescription: "Gramática, vocabulario y conversación fundamental.",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=800",
      video: "https://www.youtube.com/embed/2Xz7m3YpQ0M",
      level: "Básico",
      duration: "50h",
      lessonsCount: 3,
      rating: 4.7,
      instructor: "James Wilson"
    },
    {
      id: '12',
      title: "Reparación y Mantenimiento de Celulares",
      category: "Tecnología",
      shortDescription: "Arregla dispositivos móviles profesionalmente.",
      fullDescription: "Hardware, software y diagnóstico de fallas en celulares.",
      image: "https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?q=80&w=800",
      video: "https://www.youtube.com/embed/jfKfPfyJRdk",
      level: "Intermedio",
      duration: "40h",
      lessonsCount: 3,
      rating: 4.9,
      instructor: "Kevin Tech"
    }
  ]);

  getAllCourses() {
    return this.courses;
  }

  getCourseById(id: string) {
    return this.courses().find(c => c.id === id);
  }

  addCourse(course: Course) {
    this.courses.update(prev => [...prev, course]);
  }

  updateCourse(updated: Course) {
    this.courses.update(prev => prev.map(c => c.id === updated.id ? updated : c));
  }

  deleteCourse(id: string) {
    this.courses.update(prev => prev.filter(c => c.id !== id));
  }

  getCourseProgress(courseId: string): number {
    const auth = inject(AuthService);
    const user = auth.currentUser();
    if (!user) return 0;
    
    const levels = this.getCourseLevels(courseId);
    const totalLessons = levels.reduce((acc, lvl) => acc + lvl.lessons.length, 0);
    if (totalLessons === 0) return 0;
    
    const completedCount = levels.reduce((acc, lvl) => {
      return acc + lvl.lessons.filter((l: any) => user.completedLessons.includes(l.id)).length;
    }, 0);
    
    return Math.round((completedCount / totalLessons) * 100);
  }

  getCourseLevels(courseId: string): any[] {
    return [
      {
        id: 0,
        name: 'Introducción',
        lessons: [
          { id: courseId + '-intro', title: 'Bienvenida al curso', videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', description: 'Conoce los objetivos y metodología del programa.', content: 'En este curso aprenderás las bases fundamentales...' }
        ]
      },
      {
        id: 1,
        name: 'Nivel 1: Fundamentos Técnicos',
        lessons: [
          { id: courseId + '-n1-l1', title: 'Conceptos clave de la industria', videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', description: 'Primeros pasos en la especialidad.', content: 'Los fundamentos son la base de todo profesional...' }
        ]
      },
      {
        id: 2,
        name: 'Nivel 2: Aplicación Práctica',
        lessons: [
          { id: courseId + '-n2-l1', title: 'Técnicas avanzadas', videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', description: 'Profundizando en el conocimiento.', content: 'La práctica constante es lo que define al experto...' }
        ]
      },
      {
        id: 3,
        name: 'Nivel 3: Perfeccionamiento',
        lessons: [
          { id: courseId + '-n3-l1', title: 'Casos de éxito y resolución', videoUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk', description: 'Preparación para el mundo real.', content: 'Dominar la resolución de problemas es clave...' }
        ]
      }
    ];
  }

  getFinalExam(courseId: string): any {
    return {
      id: 'exam-' + courseId,
      questions: [
        { id: 'q1', text: '¿Cuál es el objetivo principal de este curso?', options: ['Aprender técnicas nuevas', 'Ganar dinero', 'Dormir', 'Ninguna'], correctIndex: 0 },
        { id: 'q2', text: '¿Qué herramienta es fundamental?', options: ['Computadora', 'Pincel', 'Teléfono', 'Todas'], correctIndex: 3 }
      ]
    };
  }

  enrollInCourse(courseId: string) {
    const auth = inject(AuthService);
    const user = auth.currentUser();
    if (user && !user.enrolledCourses.includes(courseId)) {
      const updatedUser = {
        ...user,
        enrolledCourses: [...user.enrolledCourses, courseId]
      };
      auth.updateUser(updatedUser);
      return true;
    }
    return false;
  }
}
