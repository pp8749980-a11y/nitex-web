import { Injectable, signal } from '@angular/core';
import { Course, LevelStructure } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private courses = signal<Course[]>([
    {
      id: 'src',
      title: 'Secretaría Recepcionista y Servicio al Cliente',
      shortDescription: 'Domina la gestión administrativa y la excelencia en atención.',
      fullDescription: 'Formación integral para profesionales de oficina, cubriendo desde protocolo y etiqueta hasta herramientas digitales modernas y resolución de conflictos.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000',
      category: 'Administración',
      level: 'Básico',
      duration: '40h',
      lessonsCount: 40,
      rating: 4.9,
      instructor: 'Dra. Elena Ramos',
      featured: true
    },
    {
      id: 'eb',
      title: 'Estilista en Belleza',
      shortDescription: 'Conviértete en un experto de la imagen y el cuidado personal.',
      fullDescription: 'Un recorrido completo por técnicas de corte, colorimetría avanzada y tratamientos capilares de tendencia profesional.',
      image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000',
      category: 'Belleza',
      level: 'Intermedio',
      duration: '60h',
      lessonsCount: 40,
      rating: 4.8,
      instructor: 'Marco Polo',
      featured: true
    },
    {
      id: 'cbc',
      title: 'Cajero Bancario Computarizado',
      shortDescription: 'Operaciones financieras de alta precisión y seguridad.',
      fullDescription: 'Capacitación técnica en manejo de efectivo, detección de moneda, software bancario y normativas financieras internacionales.',
      image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=1000',
      category: 'Finanzas',
      level: 'Avanzado',
      duration: '50h',
      lessonsCount: 40,
      rating: 4.7,
      instructor: 'Lic. Ricardo Mendoza',
      featured: true
    },
    {
      id: 'ua',
      title: 'Uñas Acrílicas',
      shortDescription: 'Arte y técnica profesional en diseño de uñas.',
      fullDescription: 'Desde la anatomía de la uña hasta diseños en 3D, encapsulado y tendencias vanguardistas del Nail Art.',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1000',
      category: 'Belleza',
      level: 'Básico',
      duration: '35h',
      lessonsCount: 40,
      rating: 4.9,
      instructor: 'Samy Nails',
      featured: false
    },
    {
      id: 'af',
      title: 'Auxiliar en Farmacia',
      shortDescription: 'Gestión farmacéutica y dispensación especializada.',
      fullDescription: 'Conocimientos sólidos en farmacología, control de inventarios, recetas médicas y atención farmacéutica de primer nivel.',
      image: 'https://images.unsplash.com/photo-1587854685352-25d82032960f?q=80&w=1000',
      category: 'Salud',
      level: 'Intermedio',
      duration: '55h',
      lessonsCount: 40,
      rating: 4.8,
      instructor: 'Dr. Luis Castillos',
      featured: true
    },
    {
      id: 'bp',
      title: 'Barbería Profesional',
      shortDescription: 'Cortes clásicos y modernos con acabado de autor.',
      fullDescription: 'Domina el manejo de navaja, degrade (fades), arreglo de barba y rituales de spa para caballeros.',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000',
      category: 'Belleza',
      level: 'Básico',
      duration: '45h',
      lessonsCount: 40,
      rating: 5.0,
      instructor: 'Tony Barber',
      featured: false
    },
    {
      id: 'ae',
      title: 'Auxiliar de Enfermería',
      shortDescription: 'Cuidado humano y asistencia técnica en salud.',
      fullDescription: 'Primeros auxilios, enfermería básica, signos vitales y cuidados paliativos bajo estándares hospitalarios.',
      image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=1000',
      category: 'Salud',
      level: 'Avanzado',
      duration: '80h',
      lessonsCount: 40,
      rating: 4.9,
      instructor: 'Lic. Maria Lopez',
      featured: true
    },
    {
      id: 'ib',
      title: 'Informática Básica',
      shortDescription: 'Herramientas esenciales para la era digital.',
      fullDescription: 'Dominio de Office (Word, Excel, PowerPoint), navegación segura y gestión de archivos en la nube.',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1000',
      category: 'Tecnología',
      level: 'Básico',
      duration: '30h',
      lessonsCount: 40,
      rating: 4.6,
      instructor: 'Ing. Carlos Soto',
      featured: false
    },
    {
      id: 'ecp',
      title: 'Estilismo en Cejas y Pestañas',
      shortDescription: 'Lifting, diseño y extensiones de impacto.',
      fullDescription: 'Técnicas de visajismo, microblading, extensiones pelo a pelo y laminado de cejas profesional.',
      image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?q=80&w=1000',
      category: 'Belleza',
      level: 'Básico',
      duration: '25h',
      lessonsCount: 40,
      rating: 4.8,
      instructor: 'Bella Brows',
      featured: false
    },
    {
      id: 'fm',
      title: 'Facial y Maquillaje',
      shortDescription: 'Skin care y arte cosmético avanzado.',
      fullDescription: 'Tratamientos faciales profesionales y técnicas de maquillaje para eventos, novias y social media.',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1000',
      category: 'Belleza',
      level: 'Intermedio',
      duration: '40h',
      lessonsCount: 40,
      rating: 4.7,
      instructor: 'Carla Beauty',
      featured: false
    },
    {
      id: 'en',
      title: 'Inglés Básico',
      shortDescription: 'Comunicación efectiva desde el primer día.',
      fullDescription: 'Método comunicativo para dominar el inglés necesario en viajes, trabajo y entornos sociales básicos.',
      image: 'https://images.unsplash.com/photo-1543167601-52193b2a2491?q=80&w=1000',
      category: 'Idiomas',
      level: 'Básico',
      duration: '40h',
      lessonsCount: 40,
      rating: 4.8,
      instructor: 'Teacher John',
      featured: true
    },
    {
      id: 'rmc',
      title: 'Reparación y Mantenimiento de Celulares',
      shortDescription: 'Técnico experto en dispositivos móviles.',
      fullDescription: 'Hardware y software: micro-soldadura, cambio de pantallas, flasheo de sistemas y diagnóstico electrónico.',
      image: 'https://images.unsplash.com/photo-1512428559083-a401c33e2b52?q=80&w=1000',
      category: 'Tecnología',
      level: 'Intermedio',
      duration: '50h',
      lessonsCount: 40,
      rating: 4.9,
      instructor: 'Tech Master Gio',
      featured: true
    }
  ]);

  // Dynamic path generation for all courses
  private coursePaths: Record<string, LevelStructure[]> = {
    'src': this.generateLevels('src'),
    'eb': this.generateLevels('eb'),
    'cbc': this.generateLevels('cbc'),
    'ua': this.generateLevels('ua'),
    'af': this.generateLevels('af'),
    'bp': this.generateLevels('bp'),
    'ae': this.generateLevels('ae'),
    'ib': this.generateLevels('ib'),
    'ecp': this.generateLevels('ecp'),
    'fm': this.generateLevels('fm'),
    'en': this.generateLevels('en'),
    'rmc': this.generateLevels('rmc')
  };

  getAllCourses() {
    return this.courses;
  }

  getCourseById(id: string) {
    return this.courses().find(c => c.id === id);
  }

  getCourseLevels(courseId: string): LevelStructure[] {
    return this.coursePaths[courseId] || [];
  }

  private generateLevels(courseId: string): LevelStructure[] {
    const levelNames: ('Básico' | 'Intermedio' | 'Avanzado' | 'Experto')[] = ['Básico', 'Intermedio', 'Avanzado', 'Experto'];
    return levelNames.map((name, i) => ({
      id: i,
      name,
      lessons: Array.from({ length: 10 }, (_, j) => ({
        id: `${courseId}_l${i}_${j}`,
        title: `Lección ${j + 1}: ${name} - Conceptos ${j + 1}`,
        description: `En esta lección aprenderemos los fundamentos de ${name} enfocados en la unidad ${j + 1}.`,
        content: `Contenido extenso de la lección ${j + 1} del nivel ${name}...`,
        videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        duration: '10:00'
      })),
      exam: {
        id: `${courseId}_exam_${i}`,
        questions: Array.from({ length: 10 }, (_, q) => ({
          id: `${courseId}_q_${i}_${q}`,
          text: `Pregunta de examen ${q + 1} para el nivel ${name}?`,
          options: ['Opción A relevante', 'Opción B correcta', 'Opción C distractora', 'Opción D técnica'],
          correctIndex: 1
        }))
      }
    }));
  }
}
