import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-bg-main min-h-screen font-sans selection:bg-primary-100">
      
      <!-- 🌿 SaaS Hero Section -->
      <section class="relative pt-48 pb-32 overflow-hidden">
         <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/30 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
         <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-100/20 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
         
         <div class="max-w-7xl mx-auto px-6 relative z-10">
            <div class="max-w-4xl space-y-10">
               <div class="flex items-center gap-4 animate-fade">
                  <div class="w-12 h-1 bg-primary-500 rounded-full"></div>
                  <span class="text-[10px] font-black uppercase tracking-[0.5em] text-primary-600">Nuestra Identidad</span>
               </div>
               <h1 class="text-6xl md:text-8xl font-black text-text-title tracking-tighter leading-[0.9] uppercase italic animate-fade-up">
                  Forjando el <br> <span class="text-primary-500">Liderazgo</span> de la Próxima Era.
               </h1>
               <p class="max-w-2xl text-xl text-text-muted font-medium leading-relaxed animate-fade-up">
                  Nitex no es solo educación; es un ecosistema de alto rendimiento diseñado para potenciar mentes ambiciosas a través de tecnología y estrategia.
               </p>
            </div>
         </div>
      </section>

      <!-- 📖 Vision & Mission Section -->
      <section class="py-32 px-6">
         <div class="max-w-7xl mx-auto space-y-32">
            
            <!-- Misión -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div class="relative group animate-fade">
                  <div class="aspect-square rounded-[64px] overflow-hidden shadow-2xl relative z-10 hover-lift transition-all duration-700">
                     <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000">
                  </div>
                  <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-500 rounded-[56px] -z-0 opacity-10 blur-3xl animate-pulse"></div>
               </div>
               
               <div class="space-y-12 animate-fade-up">
                  <div class="space-y-6">
                     <div class="w-12 h-1 bg-primary-500 rounded-full mb-8"></div>
                     <h2 class="text-5xl md:text-6xl font-black text-text-title tracking-tighter uppercase italic leading-none">Nuestra <span class="text-primary-500 underline decoration-primary-100">Misión</span></h2>
                     <p class="text-xl text-text-muted font-medium leading-relaxed italic">
                        Democratizar el acceso a la formación técnica de élite, eliminando barreras y enfocándonos en resultados prácticos que transformen carreras.
                     </p>
                  </div>
                  <div class="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm flex items-center gap-8">
                     <div class="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                        <mat-icon class="scale-125">auto_graph</mat-icon>
                     </div>
                     <p class="text-sm font-bold text-text-title">Impacto medible en más de 20 países.</p>
                  </div>
               </div>
            </div>

            <!-- Visión -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
               <div class="order-2 lg:order-1 space-y-12 animate-fade-up">
                  <div class="space-y-6 text-right lg:text-left">
                     <div class="w-12 h-1 bg-primary-500 rounded-full mb-8 ml-auto lg:ml-0"></div>
                     <h2 class="text-5xl md:text-6xl font-black text-text-title tracking-tighter uppercase italic leading-none">Nuestra <span class="text-primary-500 underline decoration-primary-100">Visión</span></h2>
                     <p class="text-xl text-text-muted font-medium leading-relaxed italic">
                        Convertirnos en el estándar global de educación SaaS, donde cada estudiante tenga las herramientas para liderar la revolución tecnológica del mañana.
                     </p>
                  </div>
                  <div class="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm flex items-center gap-8 lg:flex-row-reverse">
                     <div class="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-500">
                        <mat-icon class="scale-125">rocket_launch</mat-icon>
                     </div>
                     <p class="text-sm font-bold text-text-title text-right">Liderazgo tecnológico para 2030.</p>
                  </div>
               </div>

               <div class="order-1 lg:order-2 relative group animate-fade">
                  <div class="aspect-square rounded-[64px] overflow-hidden shadow-2xl relative z-10 hover-lift transition-all duration-700">
                     <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000">
                  </div>
                  <div class="absolute -top-10 -left-10 w-64 h-64 bg-primary-500 rounded-[56px] -z-0 opacity-10 blur-3xl animate-pulse"></div>
               </div>
            </div>

         </div>
      </section>

      <!-- 💎 Values Section -->
      <section class="py-40 bg-slate-50/50 px-6">
         <div class="max-w-7xl mx-auto space-y-24">
            <div class="text-center space-y-8 animate-fade-up">
               <h2 class="text-5xl md:text-7xl font-black text-text-title tracking-tighter uppercase italic leading-none">Valores <span class="text-primary-500">Nitex</span></h2>
               <p class="text-text-muted font-medium italic max-w-2xl mx-auto text-xl">Los pilares que sostienen nuestra excelencia académica.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
               @for (value of values; track value.title) {
                  <div class="p-12 rounded-[64px] bg-white border border-slate-100 hover:shadow-[0_64px_120px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 group text-center lg:text-left hover-lift">
                     <div class="w-20 h-20 bg-slate-50 text-primary-500 rounded-[28px] flex items-center justify-center mb-10 mx-auto lg:mx-0 shadow-sm group-hover:bg-primary-500 group-hover:text-white transition-all duration-700 rotate-3 group-hover:rotate-0">
                        <mat-icon class="scale-[1.5]">{{ value.icon }}</mat-icon>
                     </div>
                     <h3 class="text-3xl font-black text-text-title tracking-tight mb-6 uppercase italic leading-none group-hover:text-primary-500 transition-colors">{{ value.title }}</h3>
                     <p class="text-text-muted font-medium text-lg leading-relaxed italic">{{ value.desc }}</p>
                  </div>
               }
            </div>
         </div>
      </section>

      <!-- 👥 Team Grid -->
      <section class="py-40 px-6">
         <div class="max-w-7xl mx-auto space-y-24">
            <div class="flex flex-col md:flex-row justify-between items-end gap-10">
               <div class="space-y-6">
                  <h2 class="text-4xl md:text-6xl font-black text-text-title tracking-tighter uppercase italic leading-none animate-fade-up">Mentes <span class="text-primary-500">Brillantes</span>.</h2>
                  <p class="text-text-muted font-medium max-w-lg animate-fade-up">Conoce al equipo que lidera la revolución educativa en Nitex.</p>
               </div>
               <div class="flex gap-4 animate-fade">
                  <button class="w-16 h-16 bg-white border border-slate-100 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-500"><mat-icon>west</mat-icon></button>
                  <button class="w-16 h-16 bg-text-title text-white rounded-2xl flex items-center justify-center hover:bg-primary-500 transition-all duration-500 shadow-xl shadow-primary-500/20"><mat-icon>east</mat-icon></button>
               </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               @for (member of team; track member.name) {
                  <div class="group relative overflow-hidden rounded-[48px] bg-white p-4 hover:shadow-2xl transition-all duration-700">
                     <div class="aspect-[4/5] w-full overflow-hidden rounded-[36px] bg-bg-main relative">
                        <img [src]="member.image" [alt]="member.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]">
                        <div class="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                     </div>
                     <div class="pt-8 pb-4 px-4">
                        <p class="text-[9px] font-black text-primary-500 uppercase tracking-widest mb-2">{{ member.role }}</p>
                        <h4 class="text-2xl font-black text-text-title italic tracking-tight">{{ member.name }}</h4>
                     </div>
                  </div>
               }
            </div>
         </div>
      </section>

      <!-- 🚀 SaaS CTA -->
      <section class="py-40 px-6">
         <div class="max-w-7xl mx-auto rounded-[80px] bg-text-title p-20 lg:p-32 text-center text-white relative overflow-hidden">
            <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-500/5 blur-[100px] rounded-full -translate-x-1/3 translate-y-1/3"></div>
            
            <div class="relative z-10 space-y-12">
               <h2 class="text-5xl md:text-8xl font-black tracking-tighter leading-none italic uppercase animate-fade-up">Únete a la <br> <span class="text-primary-500 underline decoration-white/10">Academia</span> Elite.</h2>
               <p class="max-w-2xl mx-auto text-xl text-slate-400 font-medium opacity-80 animate-fade-up">
                  Comienza hoy tu transformación profesional con acceso ilimitado a nuestro ecosistema de aprendizaje.
               </p>
               <div class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 animate-fade-up">
                  <button routerLink="/auth/register" class="w-full sm:w-auto px-16 py-8 bg-primary-500 text-white rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white hover:text-text-title transition-all duration-500 shadow-2xl shadow-primary-500/20">Forjar mi Destino</button>
                  <button routerLink="/courses" class="w-full sm:w-auto px-16 py-8 border border-white/10 rounded-3xl text-xs font-black uppercase tracking-[0.2em] hover:bg-white/5 transition-all duration-500">Explorar Catálogo</button>
               </div>
            </div>
         </div>
      </section>

    </div>
  `
})
export class About {
  values = [
    { icon: 'diamond', title: 'Excelencia Elite', desc: 'No aceptamos lo mediocre. Cada curso es supervisado para garantizar el máximo nivel técnico y pedagógico.' },
    { icon: 'speed', title: 'Velocidad de Adaptación', desc: 'El mundo cambia cada día. Nuestra currícula se actualiza en tiempo real con las últimas tendencias de la industria.' },
    { icon: 'diversity_3', title: 'Comunidad Radical', desc: 'Fomentamos la colaboración entre estudiantes e instructores, creando una red de networking genuina y potente.' }
  ];

  team = [
    { name: 'Marcus Nitex', role: 'Founder & Visionary', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus' },
    { name: 'Elena Vance', role: 'Head of Education', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena' },
    { name: 'Jared Sun', role: 'UX Director', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jared' },
    { name: 'Sofia Bell', role: 'Lead Strategist', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia' }
  ];
}
