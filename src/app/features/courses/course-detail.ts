import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Course, LevelStructure } from '../../core/models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (course()) {
      <div class="bg-[#f8fafc] min-h-screen text-text-muted">
        <!-- Hero Header -->
        <section class="bg-[#050A1F] text-white pt-24 pb-44 lg:pt-32 lg:pb-64 relative overflow-hidden px-6">
          <!-- Premium background effects -->
          <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/10 blur-[150px] rounded-full translate-x-1/2 -z-0"></div>
          <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full -translate-x-1/2 -z-0"></div>
          <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none"></div>
          
          <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
            <div class="lg:col-span-12 xl:col-span-7 space-y-8">
              <nav class="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-primary-400">
                <a routerLink="/courses" class="hover:text-white transition-all uppercase tracking-[0.5em]">NITEX ACADEMY</a>
                <div class="w-1 h-1 bg-primary-500 rounded-full"></div>
                <span class="text-slate-500 font-bold tracking-[0.2em]">{{ course()?.category }}</span>
              </nav>
              
              <h1 class="text-5xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
                {{ course()?.title }}
              </h1>
              
              <p class="text-xl lg:text-2xl text-slate-300 max-w-2xl leading-relaxed font-medium opacity-80 italic">
                {{ course()?.shortDescription }}
              </p>
              
              <div class="flex flex-wrap gap-12 items-center">
                <div class="flex items-center gap-4">
                  <div class="flex -space-x-4">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" class="w-12 h-12 rounded-full border-4 border-[#050A1F] shadow-xl" alt="Estudiante Felix">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=A" class="w-12 h-12 rounded-full border-4 border-[#050A1F] shadow-xl" alt="Estudiante A">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=B" class="w-12 h-12 rounded-full border-4 border-[#050A1F] shadow-xl" alt="Estudiante B">
                  </div>
                  <div class="flex flex-col">
                    <span class="text-white font-black text-xs uppercase tracking-widest italic">+14k Estudiantes</span>
                    <div class="flex items-center gap-1">
                      <mat-icon class="text-amber-400 scale-[0.6]">star</mat-icon>
                      <mat-icon class="text-amber-400 scale-[0.6]">star</mat-icon>
                      <mat-icon class="text-amber-400 scale-[0.6]">star</mat-icon>
                      <mat-icon class="text-amber-400 scale-[0.6]">star</mat-icon>
                      <mat-icon class="text-amber-400 scale-[0.6]">star_half</mat-icon>
                      <span class="text-primary-400 text-[10px] font-black ml-2">{{ course()?.rating }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="flex items-center gap-4 group cursor-pointer">
                  <div class="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-primary-500/20 transition-all">
                    <mat-icon class="text-primary-400 scale-90">verified</mat-icon>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">INSTRUCTOR MASTER</span>
                    <span class="text-sm font-black text-white italic tracking-tight">{{ course()?.instructor }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Overlapping Content Section -->
        <section class="px-6 -mt-32 lg:-mt-48 relative z-20">
          <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            <!-- Main Content Area -->
            <div class="lg:col-span-8 space-y-12">
              
              <!-- What you'll learn -->
              <div class="bg-white rounded-[48px] p-12 lg:p-20 shadow-2xl shadow-slate-200/50 border border-slate-100">
                <div class="flex items-center gap-6 mb-16">
                  <div class="w-1.5 h-12 bg-primary-500 rounded-full"></div>
                  <h2 class="text-4xl font-black text-text-title tracking-tighter uppercase italic">Objetivos <span class="text-primary-500">Clave</span></h2>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                  @for (item of learningPoints; track item) {
                    <div class="flex gap-6 group">
                      <div class="flex-shrink-0 w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                        <mat-icon class="scale-75">check_circle</mat-icon>
                      </div>
                      <p class="text-text-muted font-bold leading-relaxed text-sm group-hover:text-text-title transition-colors">
                        {{ item }}
                      </p>
                    </div>
                  }
                </div>
              </div>

              <!-- Syllabus -->
              <div class="space-y-10">
                <div class="flex items-center justify-between px-6">
                  <div class="flex items-center gap-6">
                    <div class="w-1.5 h-12 bg-primary-500 rounded-full"></div>
                    <h2 class="text-4xl font-black text-text-title tracking-tighter uppercase italic">Syllabus <span class="text-primary-500">Master</span></h2>
                  </div>
                  <div class="hidden sm:flex flex-col items-end">
                    <span class="text-[10px] font-black text-primary-500 uppercase tracking-widest">{{ levels().length }} NIVELES</span>
                    <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">{{ course()?.lessonsCount }} MASTERCLASSES</span>
                  </div>
                </div>

                <div class="space-y-6">
                  @for (level of levels(); track level.id) {
                    <div class="bg-white rounded-[40px] overflow-hidden border border-slate-100 group shadow-lg shadow-slate-200/20">
                      <!-- Level Header -->
                      <div class="flex items-center justify-between p-12 bg-white hover:bg-slate-50/50 cursor-pointer transition-all">
                        <div class="flex items-center gap-10">
                          <div class="relative">
                            <div class="w-16 h-16 bg-[#050A1F] text-white rounded-[24px] flex items-center justify-center font-black text-2xl shadow-2xl relative z-10 italic">
                              {{ level.id + 1 }}
                            </div>
                            <div class="absolute -bottom-2 -right-2 w-16 h-16 bg-primary-500/20 rounded-[24px] -z-0"></div>
                          </div>
                          <div>
                            <h4 class="font-black text-3xl text-text-title tracking-tighter group-hover:text-primary-500 transition-colors uppercase italic">{{ level.name }}</h4>
                            <div class="flex items-center gap-4 mt-2">
                               <span class="text-[9px] font-black text-slate-400 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100">{{ level.lessons.length }} CLASES</span>
                               <div class="w-1 h-1 bg-slate-200 rounded-full"></div>
                               <span class="text-[9px] font-black text-emerald-500 uppercase tracking-widest">EXAMEN DE NIVEL INCLUIDO</span>
                            </div>
                          </div>
                        </div>
                        <div class="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:text-primary-500 group-hover:bg-primary-50 transition-all border border-slate-100">
                          <mat-icon class="scale-125">keyboard_arrow_down</mat-icon>
                        </div>
                      </div>
                      
                      <!-- Lessons List (Assume Expanded for now) -->
                      <div class="px-12 pb-12 space-y-4">
                        @for (lesson of level.lessons; track lesson.id) {
                          <div class="flex items-center justify-between p-8 px-10 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-primary-500/5 transition-all rounded-[32px] group/lesson border border-transparent hover:border-primary-100">
                            <div class="flex items-center gap-8">
                              <div class="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover/lesson:text-primary-500 group-hover/lesson:rotate-12 transition-all shadow-sm">
                                <mat-icon class="scale-90">play_circle</mat-icon>
                              </div>
                              <div>
                                <span class="text-sm font-black text-text-muted group-hover/lesson:text-text-title transition-colors tracking-tight italic">{{ lesson.title }}</span>
                                <p class="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">LECCIÓN {{ $index + 1 }}</p>
                              </div>
                            </div>
                            <span class="text-[10px] text-slate-300 font-black group-hover/lesson:text-primary-500 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm uppercase tracking-widest italic">{{ lesson.duration }}</span>
                          </div>
                        }
                        
                        <!-- Workshop Card -->
                        <div class="mt-8 p-10 bg-gradient-to-r from-[#050A1F] to-[#1e293b] rounded-[40px] flex items-center justify-between group/workshop relative overflow-hidden shadow-2xl">
                          <div class="absolute inset-0 bg-primary-500/10 blur-[80px] rounded-full translate-x-1/2"></div>
                          <div class="flex items-center gap-10 relative z-10">
                            <div class="w-16 h-16 bg-primary-500 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-primary-500/30">
                              <mat-icon class="scale-110">stars</mat-icon>
                            </div>
                            <div>
                              <span class="text-xs font-black text-white uppercase tracking-[0.3em] block mb-2 italic">WORKSHOP FINAL: {{ level.name }}</span>
                              <div class="flex items-center gap-3">
                                 <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-lg shadow-emerald-500/50"></div>
                                 <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">PROYECTO DE ALTO IMPACTO PARA PORTAFOLIO</span>
                              </div>
                            </div>
                          </div>
                          <button class="bg-white/5 hover:bg-white/10 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all border border-white/10 group-hover/workshop:translate-x-2">
                             <mat-icon>arrow_forward</mat-icon>
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Price & Enrollment Sidebar -->
            <div class="lg:col-span-4 lg:sticky lg:top-10 h-fit space-y-10">
              <div class="bg-white rounded-[56px] p-6 shadow-2xl shadow-primary-900/10 border border-slate-100 relative overflow-hidden group/side">
                <!-- Top Badge -->
                <div class="absolute top-8 right-8 bg-amber-100 text-amber-700 px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-200 z-30 shadow-sm">
                   90% DCTO EXCLUSIVO
                </div>

                <div class="aspect-video w-full rounded-[40px] overflow-hidden relative mb-10 shadow-2xl group-hover/side:shadow-primary-500/20 transition-all duration-700">
                  <img [src]="course()?.image" class="w-full h-full object-cover transition-transform duration-1000 group-hover/side:scale-110" [alt]="course()?.title">
                  <div class="absolute inset-0 bg-[#050A1F]/40 flex items-center justify-center opacity-0 group-hover/side:opacity-100 transition-all duration-500 cursor-pointer backdrop-blur-[4px]">
                    <div class="w-24 h-24 bg-white text-primary-500 rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover/side:scale-100 transition-transform duration-700">
                      <mat-icon class="scale-150">play_circle_filled</mat-icon>
                    </div>
                  </div>
                  <div class="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md rounded-[24px] border border-white/20">
                     <p class="text-[10px] font-black text-white uppercase tracking-widest text-center">Incluye certificación oficial Nitex</p>
                  </div>
                </div>
                
                <div class="px-8 pb-10 space-y-12">
                  <div class="flex flex-col items-center">
                    <div class="flex items-baseline gap-4 mb-4">
                      <span class="text-7xl font-black tracking-tighter text-[#050A1F] italic">GRATIS</span>
                    </div>
                    <div class="flex items-center gap-4">
                       <span class="text-slate-300 line-through text-2xl font-bold italic">$249 USD</span>
                       <div class="w-1.5 h-1.5 bg-primary-500 rounded-full"></div>
                       <span class="text-primary-500 font-black text-xs uppercase tracking-widest italic">Oferta Limitada</span>
                    </div>
                  </div>
                  
                  <button (click)="enroll()" class="w-full bg-[#050A1F] text-white py-8 rounded-[32px] flex items-center justify-center gap-6 group/btn hover:bg-primary-600 transition-all shadow-2xl shadow-primary-900/20">
                    <mat-icon class="scale-125 group-hover/btn:translate-x-2 transition-transform">bolt</mat-icon>
                    <span class="text-xs font-black uppercase tracking-[0.2em]">{{ isEnrolled() ? 'IR AL PANEL DE ESTUDIO' : 'COMENZAR AHORA' }}</span>
                  </button>
                  
                  <div class="space-y-8">
                     <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 flex items-center gap-4">
                        EL CURSO INCLUYE
                        <div class="flex-grow h-px bg-slate-100"></div>
                     </h4>
                     <div class="grid grid-cols-1 gap-6">
                        <div class="flex items-center gap-6 group/item">
                          <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-500 group-hover/item:bg-[#050A1F] group-hover/item:text-white transition-all shadow-sm">
                            <mat-icon class="scale-75">all_inbox</mat-icon>
                          </div>
                          <div class="flex flex-col">
                             <span class="text-xs font-black text-text-title tracking-tight italic">{{ course()?.duration }} DE CONTENIDO</span>
                             <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">MASTERCLASSES HD</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-6 group/item">
                          <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-500 group-hover/item:bg-[#050A1F] group-hover/item:text-white transition-all shadow-sm">
                            <mat-icon class="scale-75">cloud_download</mat-icon>
                          </div>
                          <div class="flex flex-col">
                             <span class="text-xs font-black text-text-title tracking-tight italic">RECURSOS PREMIUM</span>
                             <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PDFS Y CÓDIGO FUENTE</span>
                          </div>
                        </div>
                        <div class="flex items-center gap-6 group/item">
                          <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-500 group-hover/item:bg-[#050A1F] group-hover/item:text-white transition-all shadow-sm">
                            <mat-icon class="scale-75">emoji_events</mat-icon>
                          </div>
                          <div class="flex flex-col">
                             <span class="text-xs font-black text-text-title tracking-tight italic">CERTIFICACIÓN MASTER</span>
                             <span class="text-[9px] font-bold text-slate-400 uppercase tracking-widest">VERIFICADO INTERNACIONAL</span>
                          </div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              <!-- Instructor mini bio -->
              <div class="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
                 <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">MASTER INSTRUCTOR</h3>
                 <div class="flex items-center gap-6">
                    <div class="w-20 h-20 rounded-3xl overflow-hidden shadow-2xl relative group/avatar">
                       <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + course()?.instructor" class="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform" [alt]="course()?.instructor">
                       <div class="absolute inset-0 bg-primary-500/20 opacity-0 group-hover/avatar:opacity-100 transition-opacity"></div>
                    </div>
                    <div>
                       <h4 class="font-black text-xl text-text-title tracking-tight italic leading-none">{{ course()?.instructor }}</h4>
                       <span class="text-primary-500 text-[10px] font-black uppercase tracking-widest mt-2 block">Nitex Elite Expert</span>
                    </div>
                 </div>
                 <p class="text-[11px] text-text-muted leading-relaxed font-bold italic opacity-70 italic">Experto en tecnología con amplia trayectoria liderando proyectos de transformación digital a escala global.</p>
              </div>
            </div>

          </div>
        </section>

        <!-- Final Call to Action -->
        <section class="py-44 overflow-hidden relative">
           <div class="absolute inset-0 bg-[#050A1F] -z-10"></div>
           <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-primary-900/50 -z-10"></div>
           
           <div class="max-w-4xl mx-auto text-center px-6 relative z-10 space-y-10">
              <div class="inline-flex items-center gap-4 bg-white/5 border border-white/10 px-8 py-4 rounded-full backdrop-blur-sm">
                 <div class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                 <span class="text-[10px] font-black text-white uppercase tracking-[0.5em]">ÚLTIMOS CUPOS DISPONIBLES</span>
              </div>
              <h2 class="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-none italic uppercase">Empieza hoy tu <br> <span class="text-primary-400">Transformación</span></h2>
              <p class="text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">Únete a una comunidad global de profesionales y domina las herramientas que definen el futuro de la industria.</p>
              <div class="flex flex-col sm:flex-row gap-6 justify-center pt-10">
                 <button (click)="enroll()" class="px-20 py-8 bg-white text-[#050A1F] rounded-[32px] font-black text-xs uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-2xl shadow-primary-500/20 scale-110 active:scale-95">Inscribirse Ahora</button>
                 <button routerLink="/courses" class="px-14 py-8 bg-white/5 text-white border border-white/10 rounded-[32px] font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Explorar Otros</button>
              </div>
           </div>
           
           <!-- Decorative letters -->
           <div class="absolute left-[-5%] top-1/2 -translate-y-1/2 text-white/5 font-black text-[30rem] pointer-events-none select-none tracking-tighter">N</div>
           <div class="absolute right-[-5%] top-1/2 -translate-y-1/2 text-white/5 font-black text-[30rem] pointer-events-none select-none tracking-tighter">X</div>
        </section>
      </div>
    } @else {
      <div class="min-h-screen bg-[#050A1F] flex items-center justify-center relative overflow-hidden">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 blur-[150px] rounded-full translate-x-1/2"></div>
        <div class="relative z-10 flex flex-col items-center">
           <div class="w-24 h-24 bg-white/5 border border-white/10 rounded-[32px] mb-8 animate-pulse flex items-center justify-center">
              <mat-icon class="text-white/20 scale-150">hourglass_empty</mat-icon>
           </div>
           <p class="text-white/20 font-black text-[10px] uppercase tracking-[0.8em] animate-pulse">PREPARANDO EXPERIENCIA...</p>
        </div>
      </div>
    }
  `
})
export class CourseDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private auth = inject(AuthService);

  course = signal<Course | null>(null);
  levels = signal<LevelStructure[]>([]);
  isEnrolled = signal(false);

  learningPoints = [
    'Conceptos fundamentales y arquitectura profesional',
    'Integración de servicios avanzados y State Management',
    'Despliegue y optimización para producción',
    'Buenas prácticas de diseño UX/UI en el entorno actual',
    'Proyectos reales para fortalecer tu portafolio profesional',
    'Dominio de herramientas de vanguardia'
  ];

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const c = this.courseService.getCourseById(id);
      if (c) {
        this.course.set(c);
        this.levels.set(this.courseService.getCourseLevels(id));
        this.checkEnrollment();
      } else {
        this.router.navigate(['/courses']);
      }
    }
  }

  checkEnrollment() {
    const user = this.auth.currentUser();
    if (user && this.course()) {
      this.isEnrolled.set(user.enrolledCourses.includes(this.course()!.id));
    }
  }

  enroll() {
    const user = this.auth.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.isEnrolled()) {
      this.router.navigate(['/learning', this.course()!.id]);
      return;
    }

    // Process enrollment
    const updatedUser = { ...user };
    updatedUser.enrolledCourses = [...user.enrolledCourses, this.course()!.id];
    this.auth.updateUser(updatedUser);
    this.isEnrolled.set(true);
    this.router.navigate(['/learning', this.course()!.id]);
  }
}
