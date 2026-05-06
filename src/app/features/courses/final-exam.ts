import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-final-exam',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-bg-main pt-32 pb-40 px-6">
      <div class="max-w-4xl mx-auto">
        
        @if (!examFinished()) {
          <div class="space-y-12 animate-fade">
            <!-- 📊 Progress Header -->
            <div class="bg-white rounded-[48px] p-10 shadow-sm border border-slate-100 flex items-center justify-between">
               <div class="space-y-2">
                  <h1 class="text-3xl font-black text-text-title tracking-tighter uppercase italic leading-none">Examen Final</h1>
                  <p class="text-[10px] font-black text-primary-500 uppercase tracking-widest">Pregunta {{ currentQuestionIndex() + 1 }} de {{ exam()?.questions?.length }}</p>
               </div>
               <div class="relative w-32 h-32">
                  <svg class="w-full h-full" viewBox="0 0 36 36">
                    <path class="text-slate-100" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path class="text-primary-500 transition-all duration-700" stroke-width="3" [attr.stroke-dasharray]="progress() + ', 100'" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <span class="text-xl font-black text-text-title">{{ progress() }}%</span>
                  </div>
               </div>
            </div>

            <!-- 📝 Question Card -->
            <div class="bg-white rounded-[64px] p-12 lg:p-20 shadow-2xl shadow-slate-200/50 border border-white relative overflow-hidden">
               <div class="absolute top-0 right-0 w-64 h-64 bg-primary-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <div class="relative z-10 space-y-12">
                  <h2 class="text-3xl lg:text-4xl font-black text-text-title tracking-tight italic leading-tight">{{ currentQuestion().text }}</h2>
                  
                  <div class="grid grid-cols-1 gap-4">
                    @for (option of currentQuestion().options; track option; let idx = $index) {
                      <button 
                        (click)="selectOption(idx)"
                        class="p-8 rounded-[32px] border-2 text-left transition-all group flex items-center justify-between"
                        [class]="selectedOption() === idx ? 'border-primary-500 bg-primary-50/30' : 'border-slate-50 bg-slate-50/50 hover:border-primary-200 hover:bg-white'"
                      >
                        <span class="text-lg font-bold text-text-title" [class.text-primary-700]="selectedOption() === idx">{{ option }}</span>
                        <div class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all" [class]="selectedOption() === idx ? 'bg-primary-500 border-primary-500 text-white' : 'border-slate-200 bg-white'">
                           @if (selectedOption() === idx) { <mat-icon class="scale-75">check</mat-icon> }
                        </div>
                      </button>
                    }
                  </div>

                  <div class="pt-8 flex justify-end">
                    <button 
                      (click)="nextQuestion()"
                      [disabled]="selectedOption() === null"
                      class="btn-primary py-6 px-16 rounded-[32px] disabled:opacity-20 flex items-center gap-4"
                    >
                      Siguiente Pregunta <mat-icon>arrow_forward</mat-icon>
                    </button>
                  </div>
               </div>
            </div>
          </div>
        } @else {
          <!-- 🏆 Results View -->
          <div class="text-center space-y-12 animate-fade-up py-20">
             <div class="w-32 h-32 bg-primary-500 text-white rounded-[48px] flex items-center justify-center mx-auto shadow-2xl shadow-primary-500/30 rotate-12">
                <mat-icon class="scale-[2]">military_tech</mat-icon>
             </div>
             
             <div class="space-y-6">
                <h1 class="text-6xl lg:text-8xl font-black text-text-title tracking-tighter uppercase italic leading-none">Resultados</h1>
                <p class="text-2xl text-text-muted font-medium italic">Has completado el examen de certificación.</p>
             </div>

             <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div class="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Puntuación Final</p>
                   <p class="text-6xl font-black text-text-title tracking-tighter">{{ score() }}%</p>
                </div>
                <div class="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col items-center justify-center">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Estado</p>
                   <span [class]="score() >= 70 ? 'text-emerald-500' : 'text-rose-500'" class="text-3xl font-black uppercase italic">{{ score() >= 70 ? 'Aprobado' : 'Reprobado' }}</span>
                </div>
             </div>

             <div class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
                @if (score() >= 70) {
                  <button (click)="goToCertificates()" class="btn-primary py-6 px-12 rounded-[32px]">Ver Mi Certificado</button>
                }
                <button routerLink="/courses" class="btn-secondary py-6 px-12 rounded-[32px]">Volver al Catálogo</button>
             </div>
          </div>
        }

      </div>
    </div>
  `,
})
export class FinalExam implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courseService = inject(CourseService);
  private auth = inject(AuthService);

  course = signal<Course | null>(null);
  exam = signal<any>(null);
  currentQuestionIndex = signal(0);
  selectedOption = signal<number | null>(null);
  answers = signal<number[]>([]);
  examFinished = signal(false);
  score = signal(0);
  courseId: string | null = null;

  currentQuestion = computed(() => this.exam()?.questions[this.currentQuestionIndex()]);
  progress = computed(() => {
    if (!this.exam()) return 0;
    return Math.round((this.currentQuestionIndex() / this.exam().questions.length) * 100);
  });

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    if (this.courseId) {
      this.course.set(this.courseService.getCourseById(this.courseId) || null);
      this.exam.set(this.courseService.getFinalExam(this.courseId));
    }
  }

  selectOption(idx: number) {
    this.selectedOption.set(idx);
  }

  nextQuestion() {
    if (this.selectedOption() === null) return;
    
    this.answers.update(prev => [...prev, this.selectedOption()!]);
    this.selectedOption.set(null);

    if (this.currentQuestionIndex() < this.exam().questions.length - 1) {
      this.currentQuestionIndex.update(idx => idx + 1);
    } else {
      this.finishExam();
    }
  }

  finishExam() {
    const questions = this.exam().questions;
    const correctAnswers = this.answers().filter((ans, i) => ans === questions[i].correctIndex).length;
    this.score.set(Math.round((correctAnswers / questions.length) * 100));
    this.examFinished.set(true);

    // Save result to user profile
    const u = this.auth.currentUser();
    if (u && this.score() >= 70) {
       const res = { ...u.examResults, [this.exam().id]: this.score() };
       const certs = [...u.certificates];
       if (!certs.find(c => c.id === this.exam().id)) {
          certs.push({
            id: this.exam().id,
            courseId: this.exam().id.replace('_final_exam', ''),
            courseName: this.course()?.title || 'Curso Nitex',
            date: Date.now(),
            qrCode: 'NITEX-' + Math.random().toString(36).substring(2, 9).toUpperCase()
          });
       }
       this.auth.updateUser({ ...u, examResults: res, certificates: certs });
    }
  }

  goToCertificates() {
    this.router.navigate(['/certificates', this.exam().id]);
  }
}
