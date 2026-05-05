import { ChangeDetectionStrategy, Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { MatIconModule } from '@angular/material/icon';

import { AnimateOnScrollDirective } from '../../core/directives/animate-on-scroll.directive';

import { HeroCarousel } from '../../shared/components/hero-carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, AnimateOnScrollDirective, HeroCarousel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-x-hidden bg-[#fafafa] text-text-body select-none">
      
      <!-- Premium Hero Carousel -->
      <app-hero-carousel></app-hero-carousel>

      <!-- Infinite Category Scroll -->
      <section class="py-16 bg-white border-b border-slate-100 overflow-hidden relative">
        <div class="max-w-7xl mx-auto px-6 mb-10">
           <div class="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">
              <div class="w-12 h-px bg-primary-200"></div>
              <span>Nuestras Especialidades</span>
           </div>
        </div>
        <div class="flex animate-infinite-scroll gap-20 items-center whitespace-nowrap min-w-max px-10">
          @for (cat of ['Administración', 'Belleza', 'Finanzas', 'Salud', 'Tecnología', 'Idiomas', 'Marketing', 'Negocios']; track cat) {
            <div class="flex items-center gap-5 text-xl font-black uppercase tracking-[0.2em] text-text-title hover:text-primary-500 transition-all cursor-pointer group">
              <div class="w-3 h-3 rounded-full bg-primary-100 group-hover:bg-primary-500 transition-colors"></div>
              {{ cat }}
            </div>
          }
          <!-- Duplicate for seamless loop -->
          @for (cat of ['Administración', 'Belleza', 'Finanzas', 'Salud', 'Tecnología', 'Idiomas', 'Marketing', 'Negocios']; track cat) {
            <div class="flex items-center gap-5 text-xl font-black uppercase tracking-[0.2em] text-text-title hover:text-primary-500 transition-all cursor-pointer group">
              <div class="w-3 h-3 rounded-full bg-primary-100 group-hover:bg-primary-500 transition-colors"></div>
              {{ cat }}
            </div>
          }
        </div>
      </section>

      <!-- Benefits Section (Grid 5) -->
      <section class="py-32 bg-white px-6">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            @for (benefit of [
              {t: 'Cursos actualizados', d: 'Contenido vigente', i: 'update', c: 'bg-blue-50 text-blue-600'},
              {t: '100% en línea', d: 'Estudia donde quieras', i: 'devices', c: 'bg-indigo-50 text-indigo-600'},
              {t: 'Certificación oficial', d: 'Validez curricular', i: 'verified', c: 'bg-emerald-50 text-emerald-600'},
              {t: 'Aprende a tu ritmo', d: 'Sin presiones', i: 'schedule', c: 'bg-amber-50 text-amber-600'},
              {t: 'Soporte constante', d: 'Expertos a tu lado', i: 'support_agent', c: 'bg-rose-50 text-rose-600'}
            ]; track benefit.t) {
              <div class="p-10 rounded-[40px] bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 group">
                <div [class]="'w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ' + benefit.c">
                   <mat-icon class="scale-110">{{ benefit.i }}</mat-icon>
                </div>
                <h3 class="text-sm font-black text-text-title uppercase tracking-widest mb-3">{{ benefit.t }}</h3>
                <p class="text-xs font-bold text-text-muted uppercase tracking-widest opacity-60">{{ benefit.d }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Statistics Section -->
      <section class="py-24 bg-[#050A1F] relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,_white_0%,_transparent_50%)]"></div>
        <div class="max-w-7xl mx-auto px-12 relative z-10">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-16">
            @for (stat of [
              {v: '+12k', t: 'Estudiantes Activos'},
              {v: '50+', t: 'Cursos Especializados'},
              {v: '8.5k', t: 'Certificados Emitidos'},
              {v: '98%', t: 'Satisfacción Total'}
            ]; track stat.t) {
              <div class="text-center space-y-4">
                <div class="text-5xl lg:text-7xl font-black text-white tracking-tighter">{{ stat.v }}</div>
                <div class="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em]">{{ stat.t }}</div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- Featured Programs (Grid) -->
      <section id="featured" class="py-32 bg-[#fafafa] px-6">
        <div class="max-w-7xl mx-auto">
          <div class="text-center max-w-3xl mx-auto mb-24 space-y-6">
            <div class="text-primary-500 text-[10px] font-black uppercase tracking-[0.5em]">Excelencia Educativa</div>
            <h2 class="text-5xl lg:text-7xl font-black tracking-tighter text-text-title leading-tight uppercase">
              Explora nuestros <br> <span class="italic text-primary-500">cursos destacados</span>
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            @for (course of featuredCourses(); track course.id) {
              <!-- Course card content -->
              <div 
                class="group bg-white rounded-[48px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-700 flex flex-col relative p-4"
                [routerLink]="['/courses', course.id]"
              >
                <div class="aspect-[16/10] relative overflow-hidden rounded-[40px] shadow-inner bg-slate-50">
                  <img [src]="course.image" [alt]="course.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000">
                  <div class="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] shadow-sm border border-white/50">
                    {{ course.category }}
                  </div>
                </div>
                
                <div class="p-10 pt-4 flex-grow flex flex-col">
                  <div class="flex items-center gap-6 mb-6">
                    <div class="flex items-center gap-2 text-amber-400">
                      <mat-icon class="scale-75">star</mat-icon>
                      <span class="text-[11px] font-black tracking-widest text-text-title">{{ course.rating }}</span>
                    </div>
                    <div class="h-1 w-1 bg-slate-200 rounded-full"></div>
                    <span class="text-[9px] font-black text-text-muted uppercase tracking-[0.2em]">{{ course.level }}</span>
                  </div>
                  
                  <h3 class="text-2xl font-black mb-6 group-hover:text-primary-500 transition-colors leading-tight text-text-title tracking-tight">{{ course.title }}</h3>
                  <p class="text-text-muted text-sm mb-10 line-clamp-2 leading-relaxed font-medium italic opacity-80">{{ course.shortDescription }}</p>
                  
                  <div class="flex items-center justify-between pt-8 border-t border-slate-50 mt-auto">
                    <div class="flex items-center gap-4">
                      <div class="w-10 h-10 rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                        <img [src]="'https://ui-avatars.com/api/?name=' + course.instructor + '&background=f8fafc&color=0A2A5C'" class="w-full h-full object-cover" [alt]="course.instructor">
                      </div>
                      <span class="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted group-hover:text-primary-500 transition-colors">{{ course.instructor }}</span>
                    </div>
                    <div class="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-all transform group-hover:translate-x-1 duration-500">
                       <mat-icon class="scale-75">arrow_forward_ios</mat-icon>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          <div class="flex justify-center mt-20">
             <a routerLink="/courses" class="btn-primary px-16 py-6 rounded-[32px] group">
                Ver catálogo completo
                <mat-icon class="scale-90 group-hover:translate-x-2 transition-transform">arrow_forward</mat-icon>
             </a>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-40 bg-[#fafafa] px-6">
        <div class="max-w-7xl mx-auto bg-[#0A2A5C] rounded-[80px] p-20 lg:p-32 overflow-hidden relative text-center">
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
          <div class="relative z-10 space-y-12 max-w-4xl mx-auto">
            <h2 class="text-5xl lg:text-9xl font-black text-white leading-none tracking-tighter uppercase italic">
              Es momento <br> de <span class="text-primary-500">crecer</span>.
            </h2>
            <p class="text-xl lg:text-3xl text-white/60 font-medium leading-relaxed italic">
              Únete a la plataforma que está transformando el aprendizaje técnico en toda la región.
            </p>
            <div class="flex flex-col sm:flex-row gap-8 justify-center pt-8">
               <a routerLink="/register" class="btn-primary px-16 py-6 rounded-[32px] text-lg">Comenzar Gratis Ahora</a>
               <a routerLink="/courses" class="px-16 py-6 rounded-[32px] border-2 border-white/20 text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 transition-all">Explorar Catálogo</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    @keyframes infinite-scroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
    .animate-infinite-scroll {
      animation: infinite-scroll 40s linear infinite;
    }
  `]
})
export class Home implements OnInit, OnDestroy {
  private courseService = inject(CourseService);
  featuredCourses = signal(this.courseService.getAllCourses()().filter(c => c.featured));
  currentSlide = 0;
  private autoSlideInterval: ReturnType<typeof setInterval> | undefined;

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => this.nextSlide(), 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) clearInterval(this.autoSlideInterval);
  }

  nextSlide() {
    const total = Math.ceil(this.featuredCourses().length / (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3));
    this.currentSlide = (this.currentSlide + 1) % total;
  }

  prevSlide() {
    const total = Math.ceil(this.featuredCourses().length / (window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3));
    this.currentSlide = (this.currentSlide - 1 + total) % total;
  }
}

