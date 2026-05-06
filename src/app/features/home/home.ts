import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseService } from '../../core/services/course.service';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { HeroCarousel } from '../../shared/components/hero-carousel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, HeroCarousel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overflow-x-hidden bg-bg-main text-text-body font-sans selection:bg-primary-100 selection:text-primary-700">
      
      <!-- Premium Hero Carousel -->
      <app-hero-carousel></app-hero-carousel>

      <!-- 🌿 Infinite Category Scroll -->
      <section class="py-20 bg-white border-y border-slate-100 overflow-hidden relative scroll-reveal scroll-reveal-bg">
        <div class="max-w-7xl mx-auto px-6 mb-12">
           <div class="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-primary-500 animate-fade">
              <div class="w-12 h-1 bg-primary-500 rounded-full"></div>
              <span>Nuestras Especialidades</span>
           </div>
        </div>
        <div class="flex animate-infinite-scroll gap-24 items-center whitespace-nowrap min-w-max px-10">
          @for (cat of ['Belleza y estética', 'Tecnología', 'Idiomas', 'Educación']; track cat) {
            <div class="icon-text text-2xl lg:text-3xl font-black uppercase tracking-[0.2em] text-text-title hover:text-primary-500 transition-all cursor-pointer group">
              <mat-icon class="scale-[1.5] text-primary-100 group-hover:text-primary-500 transition-colors">{{ getCategoryIcon(cat) }}</mat-icon>
              <span>{{ cat }}</span>
            </div>
          }
          <!-- Duplicate for seamless loop -->
          @for (cat of ['Belleza y estética', 'Tecnología', 'Idiomas', 'Educación']; track cat) {
            <div class="icon-text text-2xl lg:text-3xl font-black uppercase tracking-[0.2em] text-text-title hover:text-primary-500 transition-all cursor-pointer group">
              <mat-icon class="scale-[1.5] text-primary-100 group-hover:text-primary-500 transition-colors">{{ getCategoryIcon(cat) }}</mat-icon>
              <span>{{ cat }}</span>
            </div>
          }
        </div>
      </section>

      <!-- 💎 Benefits Section (Grid 4 Premium) -->
      <section class="py-40 bg-bg-main px-6 scroll-reveal scroll-reveal-bg">
        <div class="max-w-7xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            @for (benefit of [
              {t: 'Contenido Élite', d: 'Currícula diseñada por líderes globales', i: 'diamond'},
              {t: 'Modo Cine', d: 'Inmersión total en cada lección', i: 'movie_filter'},
              {t: 'Credenciales Pro', d: 'Certificados con validez industrial', i: 'military_tech'},
              {t: 'Comunidad Master', d: 'Networking de alto impacto 24/7', i: 'groups'}
            ]; track benefit.t) {
              <div class="p-12 rounded-[64px] bg-white border border-slate-100 hover:shadow-[0_64px_120px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 group hover-lift">
                <div class="w-20 h-20 rounded-[28px] bg-slate-50 text-primary-500 flex items-center justify-center mb-10 group-hover:bg-primary-500 group-hover:text-white transition-all duration-700">
                   <mat-icon class="scale-[1.8]">{{ benefit.i }}</mat-icon>
                </div>
                <h3 class="text-2xl font-black text-text-title uppercase italic tracking-tighter mb-4">{{ benefit.t }}</h3>
                <p class="text-lg text-text-muted font-medium italic leading-relaxed">{{ benefit.d }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 📊 Statistics Section (Nitex Dark Premium) -->
      <section class="py-40 bg-text-title relative overflow-hidden">
        <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        <div class="max-w-7xl mx-auto px-12 relative z-10">
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-20">
            @for (stat of [
              {v: '12K', t: 'Alumnos Elite'},
              {v: '50+', t: 'Masterclass Activas'},
              {v: '98%', t: 'Ratio de Éxito'},
              {v: '120h', t: 'Contenido Técnico'}
            ]; track stat.t) {
              <div class="text-center space-y-4 animate-fade-up">
                <div class="text-6xl lg:text-8xl font-black text-white tracking-tighter italic leading-none">{{ stat.v }}</div>
                <div class="text-[11px] font-black text-primary-500 uppercase tracking-[0.5em] opacity-80">{{ stat.t }}</div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 🖼️ Featured Programs -->
      <section id="featured" class="py-40 bg-white px-6">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col lg:flex-row justify-between items-end gap-10 mb-24">
            <div class="space-y-6">
              <div class="text-primary-600 text-[11px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
                <div class="w-10 h-1 bg-primary-500 rounded-full"></div>
                Selección Premium
              </div>
              <h2 class="text-6xl lg:text-8xl font-black tracking-tighter text-text-title leading-[0.9] uppercase italic">
                Formación de <br> <span class="text-primary-500 underline decoration-primary-100">Alto Nivel</span>.
              </h2>
            </div>
            <a routerLink="/courses" class="btn-primary py-6 px-12 rounded-[32px] text-xs font-black shadow-xl shadow-primary-500/20 w-full lg:w-auto">Explorar Todo</a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            @for (course of featuredCourses(); track course.id) {
              <div 
                class="group bg-bg-main rounded-[64px] overflow-hidden border border-slate-100 hover:shadow-[0_64px_120px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 flex flex-col cursor-pointer hover-lift relative"
                [routerLink]="['/courses', course.id]"
              >
                <!-- Visual Cover -->
                <div class="aspect-[4/3] relative overflow-hidden m-4 rounded-[48px]">
                  <img [src]="course.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]">
                  <div class="absolute top-6 right-6 px-5 py-2 bg-white/90 backdrop-blur-xl rounded-2xl text-[9px] font-black text-primary-600 uppercase tracking-widest border border-white">
                    {{ course.category }}
                  </div>
                </div>
                
                <div class="p-10 pt-4 flex-grow flex flex-col">
                  <div class="flex flex-wrap items-center gap-6 mb-8">
                    <div class="flex items-center gap-2 text-primary-600">
                      <mat-icon class="scale-50">school</mat-icon>
                      <span class="text-[9px] font-black uppercase tracking-widest">{{ course.level }}</span>
                    </div>
                    <div class="flex items-center gap-2 text-slate-400">
                      <mat-icon class="scale-50">schedule</mat-icon>
                      <span class="text-[9px] font-black uppercase tracking-widest">{{ course.duration }}</span>
                    </div>
                  </div>
                  
                  <h3 class="text-3xl font-black text-text-title tracking-tight mb-8 group-hover:text-primary-500 transition-colors leading-tight italic uppercase">{{ course.title }}</h3>
                  
                  <div class="pt-10 border-t border-slate-200/50 mt-auto flex items-center justify-between">
                     <span class="text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] bg-primary-50 px-4 py-2 rounded-xl">Acceso Inmediato</span>
                     <div class="w-12 h-12 bg-white text-text-title rounded-2xl flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm">
                        <mat-icon class="scale-75 group-hover:translate-x-1 transition-transform">bolt</mat-icon>
                     </div>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 🚀 SaaS CTA -->
      <section class="py-40 px-6 bg-bg-main">
        <div class="max-w-7xl mx-auto rounded-[80px] bg-text-title p-20 lg:p-32 text-center text-white relative overflow-hidden">
          <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
          
          <div class="relative z-10 space-y-12">
            <h2 class="text-6xl lg:text-9xl font-black tracking-tighter leading-none italic uppercase animate-fade-up">
              Forja tu <br> <span class="text-primary-500 underline decoration-white/10">Destino</span> Pro.
            </h2>
            <p class="max-w-2xl mx-auto text-xl lg:text-3xl text-slate-400 font-medium opacity-80 animate-fade-up italic leading-relaxed">
              Únete hoy a la comunidad de aprendizaje técnico más disruptiva de la región. Sin barreras, solo resultados.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12 animate-fade-up">
               @if (!user()) {
                 <button routerLink="/auth/register" class="w-full sm:w-auto px-16 py-8 bg-primary-500 text-white rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-text-title transition-all duration-500 shadow-2xl shadow-primary-500/20">
                    <div class="icon-text">
                       <span>Crear cuenta</span>
                       <mat-icon class="scale-90">person_add</mat-icon>
                    </div>
                 </button>
               }
               <button routerLink="/courses" class="w-full sm:w-auto px-16 py-8 border border-white/10 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all duration-500">
                  <div class="icon-text">
                     <span>Explorar Catálogo</span>
                     <mat-icon class="scale-90">school</mat-icon>
                  </div>
               </button>
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
      animation: infinite-scroll 60s linear infinite;
    }
  `]
})
export class Home implements OnInit, OnDestroy {
  private courseService = inject(CourseService);
  private auth = inject(AuthService);
  
  featuredCourses = computed(() => this.courseService.getAllCourses()().slice(0, 3));
  user = computed(() => this.auth.currentUser());
  
  ngOnInit() {}
  ngOnDestroy() {}

  getCategoryIcon(category: string): string {
    const icons: any = {
      'Belleza y estética': 'face',
      'Tecnología': 'terminal',
      'Idiomas': 'translate',
      'Educación': 'school'
    };
    return icons[category] || 'folder';
  }
}
