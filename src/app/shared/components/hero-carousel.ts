import { Component, ChangeDetectionStrategy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';

@Component({
  selector: 'app-hero-carousel',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div 
      class="relative w-full min-h-[700px] lg:h-[850px] overflow-hidden bg-white"
      (mouseenter)="stopAutoplay()"
      (mouseleave)="startAutoplay()"
      (touchstart)="onTouchStart($event)"
      (touchend)="onTouchEnd($event)"
    >
      <!-- Slides Layer -->
      @for (course of featuredCourses(); track course.id; let i = $index) {
        <div 
          class="absolute inset-0 transition-all duration-1000 ease-in-out"
          [class.opacity-100.z-10]="currentSlide() === i"
          [class.opacity-0.z-0]="currentSlide() !== i"
        >
          <div class="max-w-7xl mx-auto h-full px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16">
            
            <!-- Left Side Content -->
            <div class="space-y-10 animate-slide-up relative z-20 pt-20 lg:pt-0">
               <div class="inline-flex items-center gap-4 px-5 py-2 bg-primary-50 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 animate-pulse">
                  <mat-icon class="scale-75">bolt</mat-icon>
                  Aprende sin límites
               </div>

               <h1 class="text-6xl lg:text-[100px] font-black text-text-title tracking-tighter leading-[0.9]">
                  Capacítate hoy, <br> transforma <span class="text-primary-500">tu futuro</span>
               </h1>

               <p class="text-xl lg:text-2xl text-text-muted font-medium max-w-xl leading-relaxed">
                  {{ course.shortDescription }}
               </p>

               <div class="flex flex-col sm:flex-row items-center gap-6 pt-6">
                  <a [routerLink]="['/courses', course.id]" class="btn-primary flex items-center justify-center gap-4 group w-full sm:w-auto">
                    Explorar cursos <mat-icon class="scale-90 group-hover:translate-x-2 transition-transform">arrow_forward</mat-icon>
                  </a>
                  <a routerLink="/about" class="btn-secondary flex items-center justify-center gap-4 group w-full sm:w-auto">
                    <mat-icon class="text-primary-500 scale-90 group-hover:rotate-12 transition-transform">play_circle</mat-icon> Ver cómo funciona
                  </a>
               </div>
            </div>

            <!-- Right Side Image & Cards -->
            <div class="relative h-full flex items-center justify-center lg:justify-end animate-fade-in">
               <!-- Abstract background circles -->
               <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-50 rounded-full blur-[100px] opacity-60"></div>
               
               <div class="relative">
                  <!-- Main Student Image -->
                  <div class="w-[350px] lg:w-[550px] relative z-10">
                     <img 
                       [src]="i % 2 === 0 ? 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200' : 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200'" 
                       class="w-full h-auto rounded-[80px] shadow-2xl relative z-10" 
                       [alt]="course.title"
                     >
                     
                     <!-- Premium Info Cards (Floating) -->
                     <div class="absolute -top-10 -right-10 lg:-right-20 bg-white p-6 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-5 min-w-[280px] z-20 animate-bounce-slow">
                        <div class="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[24px] flex items-center justify-center shrink-0">
                           <mat-icon class="scale-110">verified</mat-icon>
                        </div>
                        <div>
                           <p class="text-[11px] font-black text-text-title uppercase tracking-widest">Certificado incluido</p>
                           <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Al finalizar cada curso</p>
                        </div>
                     </div>

                     <div class="absolute -bottom-10 -left-10 lg:-left-20 bg-white p-6 rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-slate-100 flex items-center gap-5 min-w-[280px] z-20 animate-bounce-slow-delayed">
                        <div class="w-14 h-14 bg-primary-50 text-primary-500 rounded-[24px] flex items-center justify-center shrink-0">
                           <mat-icon class="scale-110">schedule</mat-icon>
                        </div>
                        <div>
                           <p class="text-[11px] font-black text-text-title uppercase tracking-widest">Aprende a tu ritmo</p>
                           <p class="text-[9px] font-bold text-text-muted uppercase tracking-widest mt-0.5">Accede 24/7 desde donde sea</p>
                        </div>
                     </div>

                     <!-- Abstract dots -->
                     <div class="absolute bottom-20 -right-10 grid grid-cols-4 gap-3 opacity-20">
                        @for (dot of [1,2,3,4,5,6,1,2,3,4,5,6]; track $index) {
                           <div class="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
                        }
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      }

      <!-- Indicators UI -->
      <div class="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-10">
         <div class="flex items-center gap-4">
            @for (dot of featuredCourses(); track dot.id; let i = $index) {
              <button 
                (click)="setSlide(i)"
                class="transition-all duration-700"
                [class]="currentSlide() === i ? 'w-10 h-2 bg-primary-500 rounded-full' : 'w-2 h-2 bg-slate-200 rounded-full hover:bg-primary-200'"
              ></button>
            }
         </div>
      </div>
    </div>
  `,
  styles: [`
    .vertical-text {
      writing-mode: vertical-rl;
      text-orientation: mixed;
    }
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    .animate-slide-up {
      animation: slide-up 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
    }
    .animate-fade-in {
      animation: fade-in 1.5s ease-out forwards;
    }
    .animate-bounce-slow {
      animation: bounce-slow 4s ease-in-out infinite;
    }
    .animate-bounce-slow-delayed {
      animation: bounce-slow 4s ease-in-out 2s infinite;
    }
  `]
})
export class HeroCarousel {
  private courseService = inject(CourseService);
  featuredCourses = computed(() => this.courseService.getAllCourses()().filter(c => c.featured));
  currentSlide = signal(0);
  private interval: ReturnType<typeof setInterval> | undefined;
  private touchStartX = 0;

  constructor() {
    effect((onCleanup) => {
      this.startAutoplay();
      onCleanup(() => this.stopAutoplay());
    });
  }

  startAutoplay() {
    this.stopAutoplay();
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 15000); // 15 seconds
  }

  stopAutoplay() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  nextSlide() {
    this.currentSlide.update(curr => (curr + 1) % this.featuredCourses().length);
    this.resetAutoplay();
  }

  prevSlide() {
    this.currentSlide.update(curr => (curr - 1 + this.featuredCourses().length) % this.featuredCourses().length);
    this.resetAutoplay();
  }

  setSlide(index: number) {
    this.currentSlide.set(index);
    this.resetAutoplay();
  }

  private resetAutoplay() {
    this.stopAutoplay();
    this.startAutoplay();
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX;
    const diff = this.touchStartX - touchEndX;

    if (Math.abs(diff) > 50) { // Threshold for swipe
      if (diff > 0) {
        this.nextSlide();
      } else {
        this.prevSlide();
      }
    }
  }
}
