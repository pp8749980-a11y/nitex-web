import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Course, LevelStructure, Lesson } from '../../core/models/course.model';

@Component({
  selector: 'app-learning-classroom',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col lg:flex-row h-screen overflow-hidden bg-[#fafafa] select-none text-text-body">
      
      <!-- Left Sidebar: Curriculum -->
      <aside class="w-full lg:w-80 bg-white flex flex-col border-r border-slate-100 z-30 shadow-sm">
        <div class="p-8 border-b border-slate-50 flex items-center gap-4">
           <button (click)="router.navigate(['/courses'])" class="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary-50 hover:text-primary-500 transition-all">
              <mat-icon class="scale-90">arrow_back</mat-icon>
           </button>
           <div>
              <span class="text-[9px] font-black text-primary-500 uppercase tracking-widest block mb-0.5">Contenido del curso</span>
              <h2 class="text-xs font-black text-text-title uppercase tracking-wider truncate w-40">{{ course()?.title }}</h2>
           </div>
        </div>

        <div class="flex-grow overflow-y-auto scrollbar-hide py-6">
          @for (level of levels(); track level.id) {
            <div class="mb-4">
               <button 
                 (click)="toggleLevel(level.id)"
                 class="w-full flex items-center justify-between px-8 py-4 group hover:bg-slate-50 transition-all"
               >
                 <div class="flex items-center gap-4">
                    <span class="text-[10px] font-black text-slate-300 uppercase tracking-widest group-hover:text-text-title">MOD {{ level.id + 1 }}</span>
                    <h4 class="text-[11px] font-black text-text-title uppercase tracking-wider truncate w-32 text-left">{{ level.name }}</h4>
                 </div>
                 <mat-icon class="scale-75 text-slate-200 transition-transform" [class.rotate-180]="expandedLevel() === level.id">expand_more</mat-icon>
               </button>

               @if (expandedLevel() === level.id) {
                 <div class="mt-2 space-y-1">
                    @for (lesson of level.lessons; track lesson.id) {
                      <button 
                        (click)="setCurrentLesson(lesson, level)"
                        class="w-full text-left px-10 py-5 flex items-center gap-4 transition-all group/lsn relative"
                        [class.bg-primary-50]="currentLesson()?.id === lesson.id"
                      >
                         @if (currentLesson()?.id === lesson.id) {
                            <div class="absolute left-0 top-0 bottom-0 w-1 bg-primary-500"></div>
                         }
                         <div class="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                              [class.bg-emerald-500]="isLessonCompleted(lesson.id)"
                              [class.bg-primary-500]="currentLesson()?.id === lesson.id && !isLessonCompleted(lesson.id)"
                              [class.bg-slate-100]="!isLessonCompleted(lesson.id) && currentLesson()?.id !== lesson.id">
                            <mat-icon class="scale-50 text-white">
                               {{ isLessonCompleted(lesson.id) ? 'check' : (currentLesson()?.id === lesson.id ? 'play_arrow' : 'play_arrow') }}
                            </mat-icon>
                         </div>
                         <div class="flex flex-col overflow-hidden">
                            <span class="text-[11px] font-bold text-text-title truncate w-48 leading-tight" [class.text-primary-600]="currentLesson()?.id === lesson.id">{{ lesson.title }}</span>
                            <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">{{ lesson.duration }}</span>
                         </div>
                      </button>
                    }
                 </div>
               }
            </div>
          }
        </div>

        <div class="p-8 bg-slate-50">
           <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">
              <span>Tu Progreso</span>
              <span class="text-primary-500">{{ progress() }}%</span>
           </div>
           <div class="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-primary-500 transition-all duration-1000" [style.width.%]="progress()"></div>
           </div>
        </div>
      </aside>

      <!-- Main Classroom Area -->
      <main class="flex-grow flex flex-col h-full bg-white overflow-y-auto">
        <!-- Top Title Bar -->
        <div class="p-8 pb-4 flex items-center justify-between">
           <div>
              <h1 class="text-2xl font-black text-text-title tracking-tighter uppercase italic leading-none">{{ currentLesson()?.title }}</h1>
              <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mt-3">NITEX CLASSROOM // HD TRANSMISSION</p>
           </div>
           <div class="flex items-center gap-3">
              <button class="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary-500 transition-colors"><mat-icon class="scale-75">bookmark_border</mat-icon></button>
              <button class="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary-500 transition-colors"><mat-icon class="scale-75">share</mat-icon></button>
           </div>
        </div>

        <!-- Video Player -->
        <div class="p-8 pt-4">
           <div class="aspect-video w-full bg-[#050A1F] rounded-[48px] shadow-2xl relative overflow-hidden group/player border-8 border-white ring-1 ring-slate-100">
              <img [src]="course()?.image" class="absolute inset-0 w-full h-full object-cover opacity-20 blur-md scale-110">
              <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-[2px]">
                 <div class="w-24 h-24 bg-white/10 backdrop-blur-3xl border border-white/20 text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-primary-500/80 transition-all shadow-2xl group/play">
                    <mat-icon class="scale-[2.5] group-hover/play:scale-[2.8] transition-transform">play_arrow</mat-icon>
                 </div>
              </div>
              
              <!-- Custom Controls Overlay (Simplified for UI reference) -->
              <div class="absolute bottom-8 left-8 right-8 p-6 bg-black/40 backdrop-blur-xl rounded-[32px] border border-white/10 opacity-0 group-hover/player:opacity-100 transition-opacity">
                 <div class="flex items-center gap-6 text-white font-black text-[10px] uppercase tracking-widest">
                    <mat-icon class="scale-75">pause</mat-icon>
                    <div class="flex-grow h-1.5 bg-white/20 rounded-full overflow-hidden">
                       <div class="h-full bg-primary-500 w-[65%]"></div>
                    </div>
                    <span>{{ currentLesson()?.duration }}</span>
                    <mat-icon class="scale-75">volume_up</mat-icon>
                    <mat-icon class="scale-75">fullscreen</mat-icon>
                 </div>
              </div>
           </div>
        </div>

        <!-- Tabs Content -->
        <div class="px-12 py-8 flex-grow">
           <div class="flex border-b border-slate-100 mb-10 overflow-x-auto scrollbar-hide">
              @for (tab of ['Descripción', 'Recursos', 'Preguntas', 'Favoritos']; track tab) {
                <button 
                  class="px-8 py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap"
                  [class]="activeTab === tab ? 'border-primary-500 text-primary-500' : 'border-transparent text-slate-300 hover:text-text-title'"
                  (click)="activeTab = tab"
                >
                  {{ tab }}
                </button>
              }
           </div>

           <div class="space-y-8 animate-fade-up">
              @if (activeTab === 'Descripción') {
                <div class="p-10 bg-slate-50 rounded-[40px] border border-slate-100">
                   <h3 class="text-xl font-black text-text-title mb-6 tracking-tight uppercase italic">Sobre esta lección</h3>
                   <p class="text-text-muted leading-relaxed font-medium text-lg italic opacity-80 mb-10">{{ currentLesson()?.description }}</p>
                   <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div class="flex gap-4 items-start">
                         <div class="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0"><mat-icon class="scale-75">verified</mat-icon></div>
                         <p class="text-[11px] font-bold text-text-title italic uppercase tracking-wider mt-2">Certificable tras completar el examen final</p>
                      </div>
                      <div class="flex gap-4 items-start">
                         <div class="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-500 shrink-0"><mat-icon class="scale-75">cloud_done</mat-icon></div>
                         <p class="text-[11px] font-bold text-text-title italic uppercase tracking-wider mt-2">Acceso de por vida a los recursos digitales</p>
                      </div>
                   </div>
                </div>
              }
              @if (activeTab === 'Recursos') {
                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    @for (res of ['Guía PDF de la lección', 'Código fuente (GitHub)', 'Activos de diseño', 'Lecturas recomendadas']; track res) {
                       <div class="p-6 bg-white border border-slate-100 rounded-3xl flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer">
                          <div class="flex items-center gap-5">
                             <div class="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-[#050A1F] group-hover:text-white transition-all">
                                <mat-icon class="scale-75">file_present</mat-icon>
                             </div>
                             <span class="text-xs font-black uppercase tracking-wider text-text-title">{{ res }}</span>
                          </div>
                          <mat-icon class="text-slate-200 group-hover:text-primary-500 transition-colors">download</mat-icon>
                       </div>
                    }
                 </div>
              }
           </div>
        </div>
      </main>

      <!-- Right Panel: Instructor & Actions -->
      <aside class="hidden xl:flex w-80 bg-[#fcfcfc] flex-col border-l border-slate-100">
        <div class="p-10 space-y-10">
           <div class="bg-white p-8 rounded-[40px] shadow-xl shadow-slate-200/40 border border-slate-100 text-center space-y-6">
              <div class="w-24 h-24 rounded-3xl overflow-hidden mx-auto shadow-2xl relative group">
                 <img [src]="'https://api.dicebear.com/7.x/avataaars/svg?seed=' + course()?.instructor" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                 <div class="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div>
                 <h4 class="font-black text-lg text-text-title tracking-tight leading-none italic">{{ course()?.instructor }}</h4>
                 <span class="text-[9px] font-black text-primary-500 uppercase tracking-widest mt-2 block">Instructor NITEX ELITE</span>
              </div>
              <button class="w-full py-4 bg-slate-50 rounded-2xl text-[10px] font-black text-text-muted uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-sm">Seguir Instructor</button>
           </div>

           <div class="space-y-6">
              <h5 class="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] px-4">Acciones directas</h5>
              <button (click)="toggleComplete()" class="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 transition-all shadow-lg shadow-slate-200/30"
                      [class]="isCurrentLessonCompleted() ? 'bg-emerald-500 text-white' : 'bg-white text-text-muted hover:bg-slate-50 border border-slate-100'">
                  <mat-icon class="scale-75">{{ isCurrentLessonCompleted() ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
                  {{ isCurrentLessonCompleted() ? 'He terminado' : 'Marcar como visto' }}
              </button>
              <button (click)="nextLesson()" class="w-full py-5 rounded-2xl bg-[#050A1F] text-white font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-4 transition-all hover:bg-primary-500 shadow-xl shadow-primary-900/20">
                  Próxima clase
                  <mat-icon class="scale-75">arrow_forward</mat-icon>
              </button>
           </div>

           <div class="p-8 bg-gradient-to-br from-primary-600 to-primary-800 rounded-[40px] text-white space-y-4 shadow-2xl relative overflow-hidden group">
              <mat-icon class="absolute -right-4 -bottom-4 scale-[5] text-white/5 rotate-12 group-hover:rotate-0 transition-transform">stars</mat-icon>
              <span class="text-[9px] font-black uppercase tracking-widest text-primary-200 opacity-80">Premio NITEX</span>
              <h5 class="text-lg font-black tracking-tight leading-none uppercase">Completa el Módulo para el Bonus</h5>
              <button class="px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/20">Ver detalles</button>
           </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    :host { display: block; position: relative; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
  `]
})
export class LearningClassroom {
  private route = inject(ActivatedRoute);
  public router = inject(Router);
  private courseService = inject(CourseService);
  private auth = inject(AuthService);

  course = signal<Course | null>(null);
  levels = signal<LevelStructure[]>([]);
  activeTab = 'Descripción';
  
  currentLesson = signal<Lesson | null>(null);
  currentLevel = signal<LevelStructure | null>(null);
  expandedLevel = signal<number>(0);

  isLevelUnlocked(levelId: number): boolean {
    if (levelId === 0) return true;
    const user = this.user();
    if (!user) return false;
    
    // In this simulation, levels are unlocked as you progress
    // We check if the previous level has been completed (mock logic)
    return true; 
  }

  // Exam state
  showingExam = signal(false);
  currentQuestionIndex = signal(0);
  selectedOption = signal<number | null>(null);
  userAnswers: number[] = [];
  examFinished = signal(false);
  examScore = signal(0);

  currentQuestion = computed(() => {
    const questions = this.currentLevel()?.exam?.questions || [];
    return questions[this.currentQuestionIndex()] || null;
  });

  user = computed(() => this.auth.currentUser());
  totalLessons = computed(() => this.levels().reduce((acc, level) => acc + level.lessons.length, 0));
  completedCount = computed(() => {
    const list = this.user()?.completedLessons || [];
    return this.levels().reduce((acc, level) => {
      return acc + level.lessons.filter(l => list.includes(l.id)).length;
    }, 0);
  });
  progress = computed(() => {
    if (this.totalLessons() === 0) return 0;
    return Math.round((this.completedCount() / this.totalLessons()) * 100);
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
      } else {
        this.router.navigate(['/courses']);
      }
    }
  }

  toggleLevel(id: number) {
    if (this.isLevelLocked(id)) return;
    this.expandedLevel.set(this.expandedLevel() === id ? -1 : id);
  }

  isLevelLocked(levelId: number): boolean {
    if (levelId === 0) return false;
    const prevKey = `${this.course()?.id}_${levelId - 1}`;
    const results = this.user()?.examResults || {};
    return !(results[prevKey] >= 70);
  }

  isLevelFinished(levelId: number): boolean {
    const key = `${this.course()?.id}_${levelId}`;
    const results = this.user()?.examResults || {};
    return results[key] >= 70;
  }

  canTakeExam(level: LevelStructure): boolean {
    const completedList = this.user()?.completedLessons || [];
    return level.lessons.every(l => completedList.includes(l.id));
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.user()?.completedLessons.includes(lessonId) || false;
  }

  isCurrentLessonCompleted() {
    return this.isLessonCompleted(this.currentLesson()?.id || '');
  }

  setCurrentLesson(lesson: Lesson, level: LevelStructure) {
    this.showingExam.set(false);
    this.currentLesson.set(lesson);
    this.currentLevel.set(level);
    
    // Sync last active course
    const u = this.user();
    const c = this.course();
    if (u && c && u.lastActiveCourseId !== c.id) {
      this.auth.updateUser({ ...u, lastActiveCourseId: c.id });
    }
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
      // End of level
      if (this.canTakeExam(currLvl)) {
        this.startExam(currLvl);
      } else {
        alert('Debes completar todas las lecciones del nivel para el examen.');
      }
    }
  }

  // Exam logic
  startExam(level: LevelStructure) {
    if (!this.canTakeExam(level)) return;
    this.currentLevel.set(level);
    this.expandedLevel.set(level.id);
    this.showingExam.set(true);
    this.examFinished.set(false);
    this.currentQuestionIndex.set(0);
    this.selectedOption.set(null);
    this.userAnswers = [];
  }

  selectOption(idx: number) {
    this.selectedOption.set(idx);
  }

  nextQuestion() {
    if (this.selectedOption() === null) return;
    
    this.userAnswers.push(this.selectedOption()!);
    this.selectedOption.set(null);

    if (this.currentQuestionIndex() < 9) {
      this.currentQuestionIndex.update(v => v + 1);
    } else {
      this.calculateScore();
    }
  }

  calculateScore() {
    const level = this.currentLevel();
    if (!level) return;

    let correct = 0;
    this.userAnswers.forEach((ans, idx) => {
      if (ans === level.exam.questions[idx].correctIndex) correct++;
    });

    this.examScore.set(correct * 10);
    this.examFinished.set(true);
  }

  retryExam() {
    this.examFinished.set(false);
    this.currentQuestionIndex.set(0);
    this.selectedOption.set(null);
    this.userAnswers = [];
  }

  finishExamSuccess() {
    const u = this.user();
    const c = this.course();
    const lvl = this.currentLevel();
    if (!u || !c || !lvl) return;

    const key = `${c.id}_${lvl.id}`;
    const results = { ...u.examResults };
    results[key] = this.examScore();

    // Check if course fully completed
    const updatedUser = { ...u, examResults: results };
    
    if (lvl.id === 3 && this.examScore() >= 70) {
      // Certification!
      const certId = 'cert_' + Math.random().toString(36).substring(7);
      updatedUser.certificates.push({
        id: certId,
        courseId: c.id,
        courseName: c.title,
        date: Date.now(),
        qrCode: `https://nitex.com/verify/${certId}`
      });
      alert('¡Has completado el curso! Certificado generado en tu perfil.');
    }

    this.auth.updateUser(updatedUser);
    this.showingExam.set(false);
    
    if (lvl.id < 3) {
      const nextLevel = this.levels()[lvl.id + 1];
      this.currentLevel.set(nextLevel);
      this.currentLesson.set(nextLevel.lessons[0]);
      this.expandedLevel.set(nextLevel.id);
    } else {
      this.router.navigate(['/profile']);
    }
  }
}
