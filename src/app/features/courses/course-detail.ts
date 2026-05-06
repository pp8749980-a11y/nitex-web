import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, SafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-white min-h-screen">
      
      <!-- 🌿 Hero Section (Professional Detail) -->
      <section class="pt-12 pb-8 px-6 lg:px-12 bg-slate-50 relative overflow-hidden">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-100/50 rounded-full blur-[120px]"></div>
        
        <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <div class="lg:col-span-7 space-y-8 animate-fade-up">
            <div class="flex items-center gap-6">
               <span class="px-5 py-2 bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20">Acceso Libre</span>
               <div class="flex items-center gap-2 text-primary-600">
                  <mat-icon class="scale-50">verified</mat-icon>
                  <span class="text-[9px] font-black uppercase tracking-widest">{{ course()?.instructor }}</span>
               </div>
            </div>
            
            <h1 class="text-4xl lg:text-6xl font-black text-text-title tracking-tighter uppercase italic leading-[0.9]">{{ course()?.title }}</h1>
            <p class="text-lg text-text-muted font-medium italic leading-relaxed max-w-xl">
               {{ course()?.shortDescription }}
            </p>

            <div class="flex flex-wrap gap-8 pt-2">
               @for (stat of [
                 {v: course()?.duration, t: 'Intensidad', i: 'schedule'},
                 {v: '4 Niveles', t: 'Estructura', i: 'layers'},
                 {v: 'Certificado', t: 'Logro', i: 'military_tech'}
               ]; track stat.t) {
                 <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary-500 shadow-sm border border-slate-100">
                       <mat-icon class="scale-75">{{ stat.i }}</mat-icon>
                    </div>
                    <div>
                       <p class="text-base font-black text-text-title italic leading-none">{{ stat.v }}</p>
                       <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">{{ stat.t }}</p>
                    </div>
                 </div>
               }
            </div>

            <div class="pt-6 flex flex-col sm:flex-row gap-4">
               <button (click)="enroll()" [disabled]="isEnrolled()" class="btn-primary py-5 px-12 rounded-[28px] text-base shadow-2xl shadow-primary-500/30">
                  {{ isEnrolled() ? 'Ya estás inscrito' : 'Inscribirme ahora' }}
               </button>
               <button routerLink="/courses" class="btn-secondary py-5 px-12 rounded-[28px] text-base">Explorar Otros</button>
            </div>
          </div>

          <!-- Cover Visual (Video) -->
          <div class="lg:col-span-5 relative animate-fade group">
             <div class="aspect-video rounded-[40px] overflow-hidden shadow-[0_48px_80px_-16px_rgba(0,0,0,0.12)] border-[10px] border-white relative z-10 bg-slate-900">
                <iframe 
                  *ngIf="course()?.video"
                  [src]="course()?.video | safe:'resource'" 
                  class="w-full h-full" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen
                ></iframe>
             </div>
             <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-500/10 rounded-[40px] blur-3xl -z-10 animate-pulse"></div>
          </div>
        </div>
      </section>

      <!-- 📖 Detail Content -->
      <section class="py-12 px-6 lg:px-12 bg-white">
         <div class="max-w-7xl mx-auto space-y-24">
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-20">
               <div class="space-y-8 animate-fade-up">
                  <h2 class="text-4xl font-black text-text-title tracking-tighter uppercase italic leading-none">Sobre este <span class="text-primary-500">Programa</span></h2>
                  <p class="text-xl text-text-muted font-medium italic leading-relaxed">
                     {{ course()?.fullDescription }}
                  </p>
                  
                  <div class="pt-10 space-y-8">
                     <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Estructura del Programa</h3>
                     <div class="flex flex-col gap-6">
                        @for (step of [
                          {t: 'Introducción', d: 'Fundamentos y bienvenida al curso.', i: 'waving_hand'},
                          {t: 'Niveles de Aprendizaje', d: 'Módulos técnicos especializados de básico a experto.', i: 'layers'},
                          {t: 'Examen Final', d: 'Validación de conocimientos adquiridos.', i: 'quiz'},
                          {t: 'Certificación', d: 'Emisión de diploma con QR funcional.', i: 'workspace_premium'}
                        ]; track step.t) {
                          <div class="flex items-center gap-6 p-6 bg-slate-50/50 rounded-[32px] border border-slate-50">
                             <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary-500 shadow-sm">
                                <mat-icon class="scale-75">{{ step.i }}</mat-icon>
                             </div>
                             <div>
                                <p class="text-sm font-black text-text-title uppercase italic">{{ step.t }}</p>
                                <p class="text-[11px] font-medium text-text-muted">{{ step.d }}</p>
                             </div>
                          </div>
                        }
                     </div>
                  </div>
               </div>

               <div class="space-y-10">
                  <h3 class="text-sm font-black text-slate-400 uppercase tracking-[0.4em]">¿Qué aprenderás?</h3>
                  <div class="grid grid-cols-1 gap-6">
                     @for (point of [
                       'Dominio técnico especializado de nivel máster',
                       'Resolución de conflictos y pensamiento crítico',
                       'Uso de herramientas digitales de vanguardia',
                       'Protocolos internacionales de la industria'
                     ]; track point) {
                       <div class="flex items-start gap-6 p-8 bg-slate-50/50 rounded-[40px] border border-slate-50 group hover:bg-white hover:shadow-xl transition-all">
                          <div class="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-primary-500 shadow-sm border border-slate-100 group-hover:bg-primary-500 group-hover:text-white transition-all">
                             <mat-icon class="scale-75">check</mat-icon>
                          </div>
                          <span class="text-lg font-bold text-text-body tracking-tight leading-relaxed italic">{{ point }}</span>
                       </div>
                     }
                  </div>
               </div>
            </div>

         </div>
      </section>

    </div>
  `,
})
export class CourseDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private auth = inject(AuthService);

  course = signal<Course | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const c = this.courseService.getCourseById(id);
      if (c) {
        this.course.set(c);
      } else {
        this.router.navigate(['/courses']);
      }
    }
  }

  enroll() {
    const course = this.course();
    if (!course) return;

    if (!this.auth.currentUser()) {
      this.router.navigate(['/auth/login']);
      return;
    }

    if (this.isEnrolled()) {
      this.router.navigate(['/classroom', course.id]);
      return;
    }

    if (this.courseService.enrollInCourse(course.id)) {
      this.router.navigate(['/classroom', course.id]);
    }
  }

  isEnrolled(): boolean {
    const c = this.course();
    const user = this.auth.currentUser();
    return (c && user?.enrolledCourses.includes(c.id)) || false;
  }
}
