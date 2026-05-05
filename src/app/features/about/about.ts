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
    <div class="bg-white min-h-screen font-sans selection:bg-primary-100">
      
      <!-- Hero Section -->
      <section class="relative pt-40 pb-24 overflow-hidden bg-[#050A1F] text-white">
         <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
         <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/20 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
         
         <div class="max-w-7xl mx-auto px-6 relative z-10 text-center space-y-10">
            <div class="flex items-center justify-center gap-4 animate-fade-up">
               <div class="w-12 h-1 bg-primary-500"></div>
               <span class="text-xs font-black uppercase tracking-[0.6em] text-primary-400">Nuestra Esencia</span>
               <div class="w-12 h-1 bg-primary-500"></div>
            </div>
            <h1 class="text-6xl md:text-8xl font-black tracking-tighter leading-none italic uppercase animate-fade-up">Elevando el <span class="text-primary-500 underline decoration-white/20">Potencial</span> <br> Humano a Escala Global.</h1>
            <p class="max-w-2xl mx-auto text-xl text-slate-400 font-medium leading-relaxed italic animate-fade-up">Nitex no es solo una plataforma educativa; es un ecosistema de alto rendimiento diseñado para forjar a los líderes de la era digital.</p>
         </div>
      </section>

      <!-- Mission & Story -->
      <section class="py-32 px-6">
         <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div class="space-y-10 order-2 lg:order-1">
               <div class="space-y-4">
                  <h2 class="text-4xl md:text-5xl font-black text-text-title tracking-tighter uppercase italic leading-tight">Nuestra <span class="text-primary-500">Historia</span> de Innovación</h2>
                  <div class="h-1.5 w-24 bg-primary-500 rounded-full"></div>
               </div>
               <div class="space-y-6 text-lg text-text-muted font-medium italic leading-relaxed">
                  <p>Fundada en 2024 con una visión radical: la educación premium no debería ser inaccesible. Nitex nació para romper barreras y conectar a los mentes más brillantes de la industria con estudiantes ambiciosos.</p>
                  <p>Hoy, somos el punto de encuentro de instructores de clase mundial y miles de profesionales que buscan no solo aprender, sino dominar las habilidades que el mercado real exige.</p>
               </div>
               <div class="flex flex-wrap gap-10 pt-6">
                  <div class="space-y-2">
                     <p class="text-4xl font-black text-text-title italic tracking-tighter">2024</p>
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Año de Lanzamiento</p>
                  </div>
                  <div class="space-y-2">
                     <p class="text-4xl font-black text-text-title italic tracking-tighter">Global</p>
                     <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alcance Académico</p>
                  </div>
               </div>
            </div>
            <div class="relative order-1 lg:order-2">
               <div class="aspect-square rounded-[64px] overflow-hidden shadow-2xl border-8 border-slate-50 relative z-10">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200" class="w-full h-full object-cover">
               </div>
               <div class="absolute -bottom-10 -left-10 w-64 h-64 bg-primary-500 rounded-[56px] -z-0 opacity-10 blur-2xl"></div>
            </div>
         </div>
      </section>

      <!-- Values -->
      <section class="py-32 bg-slate-50 px-6">
         <div class="max-w-7xl mx-auto space-y-20">
            <div class="text-center space-y-6">
               <h2 class="text-4xl md:text-5xl font-black text-text-title tracking-tighter uppercase italic leading-none">Valores que nos <span class="text-primary-500">Mueven</span></h2>
               <p class="text-text-muted font-medium italic">La brújula que guía cada curso, cada clase y cada interacción.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
               @for (value of values; track value.title) {
                  <div class="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-500/5 transition-all group">
                     <div class="w-16 h-16 bg-slate-50 text-primary-500 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#050A1F] group-hover:text-white transition-all shadow-inner">
                        <mat-icon class="scale-110">{{ value.icon }}</mat-icon>
                     </div>
                     <h3 class="text-2xl font-black text-text-title tracking-tight mb-4 uppercase italic leading-none group-hover:text-primary-500 transition-colors">{{ value.title }}</h3>
                     <p class="text-text-muted font-medium italic leading-relaxed">{{ value.desc }}</p>
                  </div>
               }
            </div>
         </div>
      </section>

      <!-- Team -->
      <section class="py-32 px-6">
         <div class="max-w-7xl mx-auto space-y-20">
            <div class="flex flex-col md:flex-row justify-between items-end gap-10">
               <div class="space-y-6">
                  <h2 class="text-4xl md:text-5xl font-black text-text-title tracking-tighter uppercase italic leading-none">Mentes Detrás de la <br> <span class="text-primary-500 underline decoration-primary-50/50">Excelencia</span>.</h2>
                  <p class="text-text-muted font-medium italic max-w-lg">Un equipo multidisciplinario enfocado en crear la mejor experiencia de aprendizaje del mundo.</p>
               </div>
               <div class="flex gap-4">
                  <button class="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:bg-[#050A1F] hover:text-white transition-all"><mat-icon>west</mat-icon></button>
                  <button class="w-14 h-14 bg-[#050A1F] text-white rounded-full flex items-center justify-center hover:bg-primary-500 transition-all"><mat-icon>east</mat-icon></button>
               </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
               @for (member of team; track member.name) {
                  <div class="group relative overflow-hidden rounded-[56px]">
                     <div class="aspect-[3/4] w-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                        <img [src]="member.image" [alt]="member.name" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]">
                     </div>
                     <div class="absolute inset-0 bg-gradient-to-t from-[#050A1F] via-[#050A1F]/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10 space-y-4">
                        <div class="translate-y-10 group-hover:translate-y-0 transition-transform duration-700">
                           <p class="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2">{{ member.role }}</p>
                           <h4 class="text-2xl font-black text-white italic tracking-tight">{{ member.name }}</h4>
                           <div class="flex gap-4 mt-6">
                              <a href="#" class="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white hover:bg-primary-500 transition-all"><mat-icon class="scale-75">link</mat-icon></a>
                           </div>
                        </div>
                     </div>
                  </div>
               }
            </div>
         </div>
      </section>

      <!-- CTA -->
      <section class="py-32 px-6">
         <div class="max-w-7xl mx-auto rounded-[80px] bg-[#050A1F] p-20 text-center text-white relative overflow-hidden group">
            <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
            
            <div class="relative z-10 space-y-10">
               <h2 class="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">Tú puedes ser el <br> <span class="text-primary-500">Siguiente</span> Caso de Éxito.</h2>
               <p class="max-w-xl mx-auto text-lg text-slate-400 font-medium italic opacity-80">Únete a más de 50,000 profesionales que están transformando su futuro con Nitex Academy.</p>
               <div class="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
                  <button routerLink="/auth/register" class="px-12 py-6 bg-white text-[#050A1F] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-xl shadow-white/5">Crear mi cuenta Elite</button>
                  <button routerLink="/courses" class="px-12 py-6 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/5 transition-all italic">Explorar Catálogo</button>
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
