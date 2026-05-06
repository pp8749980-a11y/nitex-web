import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Course, LevelStructure, Lesson } from '../../core/models/course.model';
import { SafePipe } from '../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-learning-classroom',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, SafePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-bg-main flex flex-col font-sans">
      
      <!-- 🏁 Classroom Header -->
      <header class="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0">
         <div class="flex items-center gap-6">
            <button routerLink="/courses" class="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-500 transition-all">
               <mat-icon>arrow_back</mat-icon>
            </button>
            <div class="h-8 w-px bg-slate-100"></div>
            <div>
               <h1 class="text-xl font-black text-text-title tracking-tighter uppercase italic leading-none">{{ course()?.title }}</h1>
               <p class="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-1">Aula Inmersiva Nitex</p>
            </div>
         </div>
         
         <div class="flex items-center gap-10">
            <div class="hidden lg:flex items-center gap-4 bg-slate-50 px-8 py-3 rounded-full border border-slate-100">
               <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tu Progreso</span>
               <div class="w-40 h-2 bg-white rounded-full overflow-hidden border border-slate-200">
                  <div [style.width.%]="progress()" class="h-full bg-primary-500 transition-all duration-1000"></div>
               </div>
               <span class="text-xs font-black text-text-title">{{ progress() }}%</span>
            </div>
            <button 
              [routerLink]="['/exam', course()?.id]"
              [disabled]="progress() < 100"
              class="btn-primary py-3 px-8 rounded-2xl text-[10px] uppercase tracking-widest disabled:opacity-20 flex items-center gap-3"
            >
               Examen Final <mat-icon class="scale-75">military_tech</mat-icon>
            </button>
         </div>
      </header>

      <div class="flex-grow flex overflow-hidden">
         
          <!-- 📚 Navigation Sidebar (Levels 1-4) -->
          <aside class="w-96 bg-white border-r border-slate-100 overflow-y-auto p-8 space-y-10 scrollbar-thin">
            <div class="space-y-6">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Hoja de Ruta</p>
              
              <!-- 🎬 Introduction -->
              <div class="space-y-3">
                 <button 
                   (click)="toggleLevel(0)"
                   class="w-full flex items-center justify-between p-6 rounded-[32px] transition-all bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                 >
                    <div class="flex items-center gap-4">
                       <mat-icon class="scale-75">waving_hand</mat-icon>
                       <span class="text-[11px] font-black uppercase tracking-widest">Introducción</span>
                    </div>
                 </button>
              </div>

              <!-- 📂 Levels -->
              @for (level of levels(); track level.id) {
                 <div class="space-y-3">
                    <button 
                      (click)="toggleLevel(level.id)"
                      class="w-full flex items-center justify-between p-6 rounded-[32px] transition-all group"
                      [class]="expandedLevel() === level.id ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20' : 'bg-slate-50 text-text-title hover:bg-slate-100'"
                    >
                       <div class="flex items-center gap-4">
                          <div class="w-10 h-10 rounded-2xl flex items-center justify-center transition-all" [class]="expandedLevel() === level.id ? 'bg-white/20' : 'bg-white text-primary-500 shadow-sm'">
                             <span class="text-xs font-black">{{ level.id }}</span>
                          </div>
                          <span class="text-[11px] font-black uppercase tracking-widest">{{ level.name }}</span>
                       </div>
                       <mat-icon class="transition-transform" [class.rotate-180]="expandedLevel() === level.id">expand_more</mat-icon>
                    </button>

                    <!-- Lessons List -->
                    @if (expandedLevel() === level.id) {
                       <div class="space-y-2 pl-4 animate-fade">
                          @for (lesson of level.lessons; track lesson.id) {
                             <button 
                               (click)="setCurrentLesson(lesson, level)"
                               class="w-full flex items-center justify-between p-5 rounded-2xl transition-all group"
                               [class]="currentLesson()?.id === lesson.id ? 'bg-primary-50 text-primary-700' : 'text-slate-400 hover:text-text-title'"
                             >
                                <div class="flex items-center gap-4 min-w-0">
                                   <mat-icon class="scale-75" [class.text-primary-500]="isLessonCompleted(lesson.id)">
                                      {{ isLessonCompleted(lesson.id) ? 'check_circle' : 'play_circle' }}
                                   </mat-icon>
                                   <span class="text-xs font-bold truncate tracking-tight">{{ lesson.title }}</span>
                                </div>
                             </button>
                          }
                       </div>
                    }
                 </div>
              }

              <!-- 🏆 Final Assessment -->
              <div class="pt-10 space-y-4">
                 <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Certificación</p>
                 <button 
                   [routerLink]="['/exam', course()?.id]"
                   [disabled]="progress() < 100"
                   class="w-full flex items-center justify-between p-8 rounded-[40px] bg-slate-900 text-white shadow-2xl transition-all group disabled:opacity-30"
                 >
                    <div class="flex items-center gap-4">
                       <mat-icon class="text-primary-500 group-hover:rotate-12 transition-transform">military_tech</mat-icon>
                       <span class="text-xs font-black uppercase tracking-widest">Examen Final</span>
                    </div>
                    <mat-icon class="scale-75 text-primary-500 group-hover:translate-x-1 transition-transform">east</mat-icon>
                 </button>
              </div>
            </div>
          </aside>

         <!-- 🎬 Main Learning View -->
         <main class="flex-grow overflow-y-auto bg-slate-50/50 p-12 scrollbar-thin">
            <div class="max-w-5xl mx-auto space-y-16">
               
               <!-- Video Player Bezel -->
                @if (currentLesson()?.videoUrl) {
                  <div class="video-container group relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl bg-slate-900 border-[12px] border-white">
                     <iframe 
                       [src]="(currentLesson()?.videoUrl ?? '') | safe:'resource'"
                       class="w-full h-full"
                       frameborder="0" 
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                       allowfullscreen
                     ></iframe>
                  </div>
                } @else {
                 <div class="aspect-video rounded-[3rem] bg-white border border-slate-100 shadow-sm flex flex-col items-center justify-center space-y-8 p-20 text-center">
                    <div class="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center text-primary-500">
                       <mat-icon class="scale-150">description</mat-icon>
                    </div>
                    <div class="space-y-4">
                       <h2 class="text-4xl font-black text-text-title tracking-tighter uppercase italic leading-none">Material Educativo</h2>
                       <p class="text-lg text-text-muted font-medium italic">Enfoque total en el contenido teórico y recursos del nivel.</p>
                    </div>
                 </div>
               }

               <!-- Content Area -->
               <div class="space-y-12 animate-fade">
                  <div class="flex flex-col md:flex-row justify-between items-start gap-10">
                     <div class="space-y-6 flex-grow">
                        <div class="flex items-center gap-4">
                           <span class="px-5 py-2 bg-primary-100 text-primary-700 rounded-xl text-[9px] font-black uppercase tracking-widest">{{ currentLevel()?.name }}</span>
                           <span class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Unidad Especializada</span>
                        </div>
                        <h2 class="text-5xl font-black text-text-title tracking-tighter uppercase italic leading-[0.9]">{{ currentLesson()?.title }}</h2>
                     </div>
                     <button 
                       (click)="toggleComplete()"
                       class="shrink-0 flex items-center gap-4 px-10 py-5 rounded-[28px] transition-all font-black uppercase text-[10px] tracking-widest shadow-xl shadow-primary-500/10"
                       [class]="isCurrentLessonCompleted() ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-primary-500 text-white hover:bg-primary-600'"
                     >
                        <mat-icon class="scale-90">{{ isCurrentLessonCompleted() ? 'verified' : 'check_circle' }}</mat-icon>
                        {{ isCurrentLessonCompleted() ? 'Completado' : 'Marcar como visto' }}
                     </button>
                  </div>

                  <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-10 border-t border-slate-100">
                     <div class="lg:col-span-2 prose prose-slate max-w-none">
                        <p class="text-xl text-text-muted font-medium italic leading-relaxed mb-10">
                           {{ currentLesson()?.description }}
                        </p>
                        <div class="p-12 bg-white rounded-[48px] border border-slate-100 shadow-sm space-y-6">
                           <p class="text-lg font-medium text-text-body leading-relaxed">
                              {{ currentLesson()?.content }}
                           </p>
                        </div>
                     </div>
                     
                     <div class="space-y-8">
                        <div class="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm space-y-8">
                           <h3 class="text-sm font-black text-text-title uppercase tracking-widest flex items-center gap-3">
                              <mat-icon class="text-primary-500">folder_zip</mat-icon> Recursos
                           </h3>
                           <div class="space-y-4">
                              <button class="w-full flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all text-[11px] font-bold">
                                 <mat-icon class="scale-75">download</mat-icon> Guía de Estudio PDF
                              </button>
                              <button class="w-full flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all text-[11px] font-bold">
                                 <mat-icon class="scale-75">link</mat-icon> Enlaces de Interés
                              </button>
                           </div>
                        </div>

                        <div class="p-10 bg-slate-900 rounded-[48px] text-white space-y-6">
                           <p class="text-[9px] font-black uppercase tracking-widest text-primary-400">Próximo Paso</p>
                           <button (click)="nextLesson()" class="w-full flex items-center justify-between group">
                              <span class="text-xl font-black italic uppercase tracking-tighter group-hover:text-primary-400 transition-colors">Siguiente Lección</span>
                              <mat-icon class="group-hover:translate-x-2 transition-transform">east</mat-icon>
                           </button>
                        </div>
                     </div>
                  </div>
               </div>

            </div>
         </main>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .scrollbar-thin::-webkit-scrollbar { width: 6px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
    .video-container {
      aspect-ratio: 16 / 9;
      border-radius: 3rem;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      background-color: black;
      border: 8px solid white;
    }
  `]
})
export class LearningClassroom {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private auth = inject(AuthService);

  course = signal<Course | null>(null);
  levels = signal<LevelStructure[]>([]);
  
  currentLesson = signal<Lesson | null>(null);
  currentLevel = signal<LevelStructure | null>(null);
  expandedLevel = signal<number>(1);

  user = computed(() => this.auth.currentUser());
  
  progress = computed(() => {
    const list = this.user()?.completedLessons || [];
    const total = this.levels().reduce((acc, level) => acc + level.lessons.length, 0);
    if (total === 0) return 0;
    const completed = this.levels().reduce((acc, level) => {
      return acc + level.lessons.filter(l => list.includes(l.id)).length;
    }, 0);
    return Math.round((completed / total) * 100);
  });

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const c = this.courseService.getCourseById(id);
      if (c) {
        this.course.set(c);
        const lvs = this.courseService.getCourseLevels(id);
        this.levels.set(lvs);
        this.currentLevel.set(lvs[0]);
        this.currentLesson.set(lvs[0].lessons[0]);
        this.expandedLevel.set(lvs[0].id);
      } else {
        this.router.navigate(['/courses']);
      }
    }
  }

  toggleLevel(id: number) {
    this.expandedLevel.set(this.expandedLevel() === id ? -1 : id);
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.user()?.completedLessons.includes(lessonId) || false;
  }

  isCurrentLessonCompleted() {
    return this.isLessonCompleted(this.currentLesson()?.id || '');
  }

  setCurrentLesson(lesson: Lesson, level: LevelStructure) {
    this.currentLesson.set(lesson);
    this.currentLevel.set(level);
  }

  toggleComplete() {
    const lessonId = this.currentLesson()?.id;
    const u = this.user();
    if (!lessonId || !u) return;

    const list = [...u.completedLessons];
    const idx = list.indexOf(lessonId);
    if (idx === -1) {
      list.push(lessonId);
    } else {
      list.splice(idx, 1);
    }

    this.auth.updateUser({ ...u, completedLessons: list });
  }

  nextLesson() {
    const currLvl = this.currentLevel();
    const currLsn = this.currentLesson();
    if (!currLvl || !currLsn) return;

    const lsnIdx = currLvl.lessons.findIndex(l => l.id === currLsn.id);
    if (lsnIdx < currLvl.lessons.length - 1) {
      this.currentLesson.set(currLvl.lessons[lsnIdx + 1]);
    } else {
      const lvlIdx = this.levels().findIndex(l => l.id === currLvl.id);
      if (lvlIdx < this.levels().length - 1) {
        const nextLvl = this.levels()[lvlIdx + 1];
        this.currentLevel.set(nextLvl);
        this.currentLesson.set(nextLvl.lessons[0]);
        this.expandedLevel.set(nextLvl.id);
      }
    }
  }
}
