import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { debounceTime, startWith } from 'rxjs';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-main min-h-screen pb-32">
      
      <!-- 🌿 SaaS Premium Header (Matched to Home) -->
      <header class="pt-32 pb-20 px-6 lg:px-12 relative overflow-hidden bg-white">
        <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-100/50 rounded-full blur-[120px]"></div>
        
        <div class="max-w-7xl mx-auto relative z-10 text-center lg:text-left">
            <div class="flex items-center justify-center lg:justify-start gap-4 mb-8 animate-fade">
              <div class="w-12 h-1 bg-primary-500 rounded-full"></div>
              <span class="text-[11px] font-black uppercase tracking-[0.5em] text-primary-600">Formación Técnica Superior</span>
            </div>
            <h1 class="text-6xl lg:text-8xl font-black text-text-title tracking-tighter uppercase italic leading-[0.9] mb-8 animate-fade-up">
              Catálogo <span class="text-primary-500 underline decoration-primary-100 italic">Elite</span>.
            </h1>
            <p class="text-xl text-text-muted font-medium max-w-2xl leading-relaxed mb-12 animate-fade-up mx-auto lg:mx-0">
               Explora nuestra selección de especialidades diseñadas para el mercado laboral actual.
            </p>
            
            <div class="relative max-w-2xl animate-fade-up mx-auto lg:mx-0">
              <mat-icon class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300">search</mat-icon>
              <input 
                [formControl]="searchControl"
                type="text" 
                placeholder="¿Qué habilidad deseas dominar hoy?" 
                class="w-full bg-slate-50 border border-slate-100 rounded-[32px] py-7 pl-16 pr-8 text-sm font-bold shadow-2xl shadow-slate-200/20 focus:bg-white focus:border-primary-500 transition-all outline-none"
              >
            </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-6 lg:px-12 pt-16">
        <div class="space-y-16">
          
          <!-- 📂 Category Selector -->
          <div class="flex items-center gap-4 overflow-x-auto pb-6 no-scrollbar">
            @for (cat of categories; track cat) {
              <button 
                (click)="selectedCategory.set(cat)"
                class="shrink-0 px-8 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all border flex items-center gap-3"
                [class]="selectedCategory() === cat ? 'bg-primary-500 border-primary-500 text-white shadow-xl shadow-primary-500/20' : 'bg-white border-slate-100 text-slate-400 hover:border-primary-200'"
              >
                <mat-icon class="scale-75">{{ getCategoryIcon(cat) }}</mat-icon>
                {{ cat }}
              </button>
            }
          </div>

          <!-- 🖼️ Course Grid (Images only) -->
          <main class="animate-fade animate-fade-up">
            @if (filteredCourses().length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                @for (course of filteredCourses(); track course.id) {
                  <div class="group bg-white rounded-[64px] overflow-hidden border border-slate-100 hover:shadow-[0_64px_120px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col p-8 lg:p-10 cursor-pointer" [routerLink]="['/courses', course.id]">
                    
                    <!-- 🖼️ Imagen del Curso -->
                    <div class="aspect-[4/3] relative overflow-hidden rounded-[40px] mb-8 group-hover:shadow-xl transition-all duration-700">
                      <img [src]="course.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]">
                      <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      <div class="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-xl rounded-2xl text-[8px] font-black text-primary-600 uppercase tracking-widest border border-white">
                        {{ course.category }}
                      </div>
                    </div>

                    <!-- 📝 Nombre del Curso -->
                    <h3 class="text-2xl lg:text-3xl font-black text-text-title leading-tight mb-8 italic uppercase tracking-tighter group-hover:text-primary-500 transition-colors">
                      {{ course.title }}
                    </h3>

                    <div class="flex items-center gap-6 mb-8 opacity-60">
                      <div class="flex items-center gap-2 text-primary-600">
                        <mat-icon class="scale-50">school</mat-icon>
                        <span class="text-[9px] font-black uppercase tracking-widest">{{ course.level }}</span>
                      </div>
                      <div class="flex items-center gap-2 text-slate-400">
                        <mat-icon class="scale-50">schedule</mat-icon>
                        <span class="text-[9px] font-black uppercase tracking-widest">{{ course.duration }}</span>
                      </div>
                    </div>

                    <!-- 📊 Barra de Progreso (Solo si está inscrito) -->
                    @if (isEnrolled(course.id)) {
                      <div class="mb-8 space-y-3 animate-fade">
                        <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                           <span class="text-slate-400">Progreso</span>
                           <span class="text-primary-500">{{ getProgress(course.id) }}%</span>
                        </div>
                        <div class="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                           <div [style.width.%]="getProgress(course.id)" class="h-full bg-primary-500 transition-all duration-1000"></div>
                        </div>
                      </div>
                    }
                    
                    <div class="pt-6 border-t border-slate-50 mt-auto">
                      <button 
                        (click)="$event.stopPropagation(); goToCourse(course.id)" 
                        class="w-full py-5 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 group shadow-lg"
                        [class]="isEnrolled(course.id) ? 'bg-primary-100 text-primary-600 shadow-primary-500/10' : 'bg-primary-500 text-white hover:bg-primary-600 shadow-primary-500/20'"
                      >
                        <div class="icon-text flex-center">
                          <span>{{ isEnrolled(course.id) ? 'Entrar al curso' : 'Acceder' }}</span>
                          <mat-icon class="scale-75 group-hover:translate-x-1 transition-transform">
                            {{ isEnrolled(course.id) ? 'play_circle' : 'visibility' }}
                          </mat-icon>
                        </div>
                      </button>
                    </div>
                  </div>
                }
              </div>
            } @else {
              <div class="flex flex-col items-center justify-center py-40 bg-white rounded-[80px] border border-slate-50 shadow-sm text-center px-10">
                <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-10">
                  <mat-icon class="scale-150">search_off</mat-icon>
                </div>
                <h3 class="text-3xl font-black text-text-title tracking-tighter mb-4 italic uppercase">Sin Resultados</h3>
                <p class="text-text-muted font-medium mb-12 max-w-md">No hemos encontrado cursos que coincidan con tu criterio actual.</p>
                <button (click)="resetFilters()" class="btn-primary">Ver Todos los Cursos</button>
              </div>
            }
          </main>
        </div>
      </div>
    </div>
  `,
})
export class CourseList {
  private courseService = inject(CourseService);
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  searchControl = new FormControl('');
  selectedCategory = signal('Todos');
  categories = ['Todos', 'Belleza y estética', 'Tecnología', 'Idiomas', 'Educación'];

  private courses = this.courseService.getAllCourses();
  private searchTerm = signal('');
  user = computed(() => this.auth.currentUser());

  goToCourse(courseId: string) {
    if (this.isEnrolled(courseId)) {
      this.router.navigate(['/classroom', courseId]);
    } else {
      this.router.navigate(['/courses', courseId]);
    }
  }

  isEnrolled(courseId: string): boolean {
    return this.user()?.enrolledCourses.includes(courseId) || false;
  }

  getProgress(courseId: string): number {
    return this.courseService.getCourseProgress(courseId);
  }

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith('')
    ).subscribe(val => this.searchTerm.set(val || ''));

    this.route.queryParams.subscribe(params => {
      if (params['category']) this.selectedCategory.set(params['category']);
      if (params['q']) this.searchControl.setValue(params['q']);
    });
  }

  filteredCourses = computed(() => {
    return this.courses().filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesCat = this.selectedCategory() === 'Todos' || c.category === this.selectedCategory();
      return matchesSearch && matchesCat;
    });
  });

  getCategoryIcon(category: string): string {
    const icons: any = {
      'Todos': 'grid_view',
      'Belleza y estética': 'face',
      'Tecnología': 'terminal',
      'Idiomas': 'translate',
      'Educación': 'school'
    };
    return icons[category] || 'folder';
  }

  resetFilters() {
    this.searchControl.setValue('');
    this.selectedCategory.set('Todos');
  }
}
