import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { MatIconModule } from '@angular/material/icon';
import { Certificate } from '../../core/models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#fafafa] min-h-screen select-none text-text-body">
      
      <!-- Premium Profile Header -->
      <header class="bg-white border-b border-slate-100 pt-32 pb-16 px-6 sm:px-12 relative overflow-hidden">
         <!-- Abstract backgrounds -->
         <div class="absolute top-0 right-0 w-96 h-96 bg-primary-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
         
         <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-10 relative z-10">
            <div class="flex flex-col md:flex-row items-center md:items-end gap-10 text-center md:text-left">
               <div class="relative group">
                  <div class="w-32 h-32 md:w-44 md:h-44 rounded-[48px] overflow-hidden shadow-2xl border-8 border-white bg-slate-50 relative z-10 transition-transform hover:scale-105 duration-500">
                     <img [src]="user()?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user()?.name" class="w-full h-full object-cover">
                  </div>
                  <button (click)="activeTab.set('settings')" class="absolute -bottom-2 -right-2 w-12 h-12 bg-[#050A1F] text-white rounded-2xl flex items-center justify-center border-4 border-white shadow-xl hover:bg-primary-500 transition-all z-20">
                     <mat-icon class="scale-75">edit</mat-icon>
                  </button>
               </div>
               
               <div class="space-y-4 pb-4">
                  <div class="flex flex-col md:flex-row items-center gap-4">
                     <h1 class="text-4xl lg:text-5xl font-black text-text-title tracking-tighter uppercase italic leading-none">{{ user()?.name }}</h1>
                     <span class="px-4 py-1.5 bg-primary-50 text-primary-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary-100">Estudiante NITEX ELITE</span>
                  </div>
                  <div class="flex flex-wrap items-center justify-center md:justify-start gap-8">
                     <div class="flex items-center gap-3">
                        <mat-icon class="text-slate-300 scale-75">calendar_month</mat-icon>
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Miembro desde: Enero 2024</span>
                     </div>
                     <div class="flex items-center gap-3">
                        <mat-icon class="text-slate-300 scale-75">location_on</mat-icon>
                        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Citizen</span>
                     </div>
                  </div>
               </div>
            </div>

            <div class="flex items-center gap-4 pb-4">
               <div class="p-4 px-6 bg-slate-50 rounded-2xl border border-slate-100 hidden sm:block">
                  <span class="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Membresía</span>
                  <span class="text-xs font-black text-text-title uppercase">Plan Platinum</span>
               </div>
               <button (click)="logout()" class="w-14 h-14 bg-red-50 text-red-500 rounded-2xl border border-red-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm">
                  <mat-icon class="scale-90">logout</mat-icon>
               </button>
            </div>
         </div>
      </header>

      <!-- Main Content Grid -->
      <div class="max-w-7xl mx-auto px-6 sm:px-12 py-16 flex flex-col lg:flex-row gap-16">
         
         <!-- Sidebar: Stats & Achievements -->
         <aside class="w-full lg:w-80 shrink-0 space-y-12">
            <div class="grid grid-cols-1 gap-6">
               <div class="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm space-y-2 text-center group hover:bg-primary-500 transition-all duration-500">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/60 transition-colors">Cursos en marcha</span>
                  <p class="text-4xl font-black text-text-title italic group-hover:text-white transition-colors leading-none">{{ user()?.enrolledCourses?.length }}</p>
               </div>
               <div class="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm space-y-2 text-center group hover:bg-emerald-500 transition-all duration-500">
                  <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-white/60 transition-colors">Finalizados</span>
                  <p class="text-4xl font-black text-text-title italic group-hover:text-white transition-colors leading-none">{{ completedCoursesCount() }}</p>
               </div>
            </div>

            <!-- Mini Achievements -->
            <div>
               <h4 class="text-[11px] font-black uppercase tracking-[0.3em] text-text-title mb-8 border-b border-slate-100 pb-4">Logros Recientes</h4>
               <div class="flex flex-wrap gap-4">
                  @for (ach of [1,2,3,4]; track $index) {
                     <div class="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-[#050A1F] hover:text-white transition-all group cursor-help" [title]="'Insignia NITEX Nivel ' + $index">
                        <mat-icon class="scale-75">stars</mat-icon>
                     </div>
                  }
               </div>
            </div>

            <!-- Ad / Promo -->
            <div class="p-10 bg-gradient-to-br from-[#0A2A5C] to-[#050A1F] rounded-[48px] text-white space-y-6 shadow-2xl relative overflow-hidden group">
               <mat-icon class="absolute -right-4 -bottom-4 scale-[5] text-white/5 rotate-12 group-hover:rotate-0 transition-transform">auto_awesome</mat-icon>
               <span class="text-[9px] font-black text-primary-400 uppercase tracking-widest">NITEX ELITE</span>
               <h4 class="text-xl font-black tracking-tight leading-tight italic">Acceso total a carreras máster</h4>
               <button routerLink="/courses" class="w-full py-4 bg-white text-[#050A1F] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all shadow-lg shadow-white/5">Explorar Academia</button>
            </div>
         </aside>

         <!-- Main Dashboard -->
         <div class="flex-grow space-y-12">
            
            <!-- Dashboard Tabs -->
            <div class="flex items-center gap-12 border-b border-slate-100 px-4">
               @for (tab of ['Mis Cursos', 'Certificados', 'Configuración']; track tab) {
                  <button 
                    (click)="activeTab.set(tabToId(tab))"
                    class="py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all"
                    [class]="activeTab() === tabToId(tab) ? 'border-primary-500 text-primary-500 pb-4' : 'border-transparent text-slate-300 hover:text-text-title'"
                  >{{ tab }}</button>
               }
            </div>

            <!-- Tab Content -->
            <div class="animate-fade-up">
               @switch (activeTab()) {
                  @case ('courses') {
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
                        @for (c of enrolledCourses(); track c.id) {
                           <div class="group bg-white rounded-[40px] border border-slate-100 hover:shadow-2xl hover:shadow-primary-500/5 transition-all p-6 space-y-6">
                              <div class="aspect-video w-full rounded-[30px] overflow-hidden bg-slate-50 relative">
                                 <img [src]="c.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000">
                                 <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div class="w-14 h-14 bg-white text-primary-500 rounded-full flex items-center justify-center shadow-xl transform scale-50 group-hover:scale-100 transition-transform"><mat-icon>play_arrow</mat-icon></div>
                                 </div>
                              </div>
                              
                              <div class="space-y-4">
                                 <h3 class="text-xl font-black text-text-title tracking-tight leading-none group-hover:text-primary-500 transition-colors uppercase italic">{{ c.title }}</h3>
                                 <div class="space-y-3">
                                    <div class="flex justify-between items-center px-1 text-[9px] font-black uppercase tracking-widest">
                                       <span class="text-slate-300">Tu avance</span>
                                       <span class="text-primary-500">{{ getProgress(c.id) }}%</span>
                                    </div>
                                    <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                       <div class="h-full bg-primary-500 transition-all duration-1000" [style.width.%]="getProgress(c.id)"></div>
                                    </div>
                                 </div>
                              </div>
                              
                              <button [routerLink]="['/learning', c.id]" class="w-full py-4 bg-slate-50 text-text-title text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-[#050A1F] hover:text-white transition-all shadow-sm">Continuar clase</button>
                           </div>
                        }
                     </div>
                  }
                  @case ('certificates') {
                     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        @for (cert of user()?.certificates; track cert.id) {
                           <div class="bg-white rounded-[40px] p-10 border border-slate-100 flex flex-col items-center text-center group hover:shadow-xl transition-all">
                              <div class="w-24 h-24 bg-slate-50 rounded-[30px] flex items-center justify-center mb-8 shadow-inner group-hover:scale-110 transition-transform">
                                 <mat-icon class="scale-[1.8] text-primary-200 group-hover:text-primary-500 transition-colors">workspace_premium</mat-icon>
                              </div>
                              <h3 class="text-lg font-black text-text-title tracking-tight mb-4 flex-grow uppercase italic leading-none">{{ cert.courseName }}</h3>
                              <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-10">{{ cert.date | date:'MMMM yyyy' }}</p>
                              <button (click)="downloadCert(cert)" class="w-full py-4 border border-slate-100 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all">Descargar PDF</button>
                           </div>
                        }
                     </div>
                  }
                  @case ('settings') {
                    <div class="bg-white rounded-[56px] p-12 lg:p-20 border border-slate-100 shadow-2xl shadow-slate-200/50 animate-fade-up max-w-3xl">
                       <div class="mb-14 space-y-4 text-center sm:text-left">
                          <h2 class="text-4xl font-black text-text-title tracking-tighter uppercase italic">Ajustes de <span class="text-primary-500">Perfil</span></h2>
                          <p class="text-text-muted font-medium text-lg italic opacity-70">Personaliza tu identidad en la plataforma.</p>
                       </div>

                       <div class="grid grid-cols-1 gap-10">
                          <div class="space-y-4">
                             <label class="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] ml-2">Nombre Público</label>
                             <input type="text" [(ngModel)]="editName" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-10 py-6 text-text-title font-bold focus:bg-white focus:shadow-xl transition-all outline-none italic">
                          </div>
                          <div class="space-y-4">
                             <label class="text-[10px] font-black uppercase text-slate-300 tracking-[0.3em] ml-2">URL del Avatar (Opcional)</label>
                             <input type="text" [(ngModel)]="editAvatar" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-10 py-6 text-text-title font-bold focus:bg-white focus:shadow-xl transition-all outline-none italic" placeholder="https://ejemplo.com/avatar.jpg">
                          </div>
                       </div>

                       <div class="mt-16 pt-10 border-t border-slate-50 flex flex-col sm:flex-row gap-6">
                          <button (click)="saveProfile()" class="px-16 py-6 rounded-2xl bg-[#050A1F] text-white font-black text-[10px] uppercase tracking-widest hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/20">Guardar Cambios</button>
                          <button (click)="cancelEdit()" class="px-10 py-6 rounded-2xl bg-white border border-slate-100 text-slate-300 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">Cancelar</button>
                       </div>
                    </div>
                  }
               }
            </div>
         </div>
      </div>
    </div>
  `,
})
export class ProfileDashboard {
  private auth = inject(AuthService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  user = this.auth.currentUser;
  activeTab = signal('courses');
  isEditing = signal(false);

  // Edit fields
  editName = '';
  editAvatar = '';
  editPassword = '';
  editPhone = '';

  enrolledCourses = computed(() => {
    const list = this.user()?.enrolledCourses || [];
    return this.courseService.getAllCourses()().filter(c => list.includes(c.id));
  });

  lastActiveCourse = computed(() => {
    const courseId = this.user()?.lastActiveCourseId;
    if (!courseId) return null;
    return this.courseService.getCourseById(courseId) || null;
  });

  constructor() {
    this.editName = this.user()?.name || '';
    this.editAvatar = this.user()?.avatar || '';
  }

  tabToId(tab: string): string {
    const map: Record<string, string> = {
      'Mis Cursos': 'courses',
      'Certificados': 'certificates',
      'Configuración': 'settings'
    };
    return map[tab] || 'courses';
  }

  getProgress(courseId: string): number {
    const u = this.user();
    if (!u) return 0;

    const courseLevels = this.courseService.getCourseLevels(courseId);
    const totalLessons = courseLevels.reduce((a, l) => a + l.lessons.length, 0);
    const completed = courseLevels.reduce((a, l) => {
      return a + l.lessons.filter(less => u.completedLessons.includes(less.id)).length;
    }, 0);

    return totalLessons ? Math.round((completed / totalLessons) * 100) : 0;
  }

  completedCoursesCount = computed(() => {
    return this.enrolledCourses().filter(c => this.getProgress(c.id) >= 100).length;
  });

  saveProfile() {
    const u = this.user();
    if (u) {
      const updated = { ...u, name: this.editName, avatar: this.editAvatar };
      // Note: In a real app we would send editPassword and editPhone to the server.
      this.auth.updateUser(updated);
      alert('Cambios guardados con éxito');
      this.isEditing.set(false);
      this.activeTab.set('courses');
    }
  }

  cancelEdit() {
    this.editName = this.user()?.name || '';
    this.editAvatar = this.user()?.avatar || '';
    this.editPassword = '';
    this.editPhone = '';
    this.isEditing.set(false);
    this.activeTab.set('courses');
  }

  downloadCert(cert: Certificate) {
    alert(`Descargando certificado de ${cert.courseName}...\nVerificado con QR: ${cert.qrCode}`);
  }

  logout() {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      this.auth.logout();
    }
  }
}
