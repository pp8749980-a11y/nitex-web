import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-[calc(100vh-80px)] bg-bg-main overflow-hidden font-sans">
      
      <!-- 📂 Admin Sidebar -->
      <aside class="w-80 shrink-0 bg-white border-r border-slate-100 flex flex-col p-10 space-y-12 shadow-sm relative z-20">
        <div class="space-y-6">
           <div class="flex items-center gap-3 px-2">
              <div class="w-10 h-10 bg-primary-500 rounded-xl flex-center text-white shadow-lg shadow-primary-500/20">
                <mat-icon class="scale-90">admin_panel_settings</mat-icon>
              </div>
              <span class="text-xl font-black text-text-title tracking-tighter uppercase italic">Control Panel</span>
           </div>
           
           <nav class="space-y-1 pt-6">
             @for (item of menuItems; track item.label) {
               <button 
                 (click)="activeView.set(item.view)"
                 class="w-full flex items-center gap-4 px-8 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest transition-all group"
                 [class]="activeView() === item.view ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20' : 'text-slate-400 hover:bg-slate-50 hover:text-primary-600'"
               >
                 <mat-icon class="scale-90" [class.text-white]="activeView() === item.view">{{ item.icon }}</mat-icon>
                 {{ item.label }}
               </button>
             }
           </nav>
        </div>

        <div class="mt-auto pt-10 border-t border-slate-50">
           <div class="flex items-center gap-4 p-5 bg-slate-50 rounded-[32px] border border-slate-100">
              <div class="w-12 h-12 rounded-2xl overflow-hidden shadow-sm border-2 border-white ring-4 ring-primary-50">
                <img [src]="auth.currentUser()?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'" class="w-full h-full object-cover">
              </div>
              <div class="min-w-0">
                <p class="text-xs font-black text-text-title truncate uppercase tracking-tighter">{{ auth.currentUser()?.name }}</p>
                <p class="text-[9px] font-black text-primary-500 uppercase tracking-widest leading-none mt-1">Master Admin</p>
              </div>
           </div>
        </div>
      </aside>

      <!-- 📊 Main Content -->
      <main class="flex-grow overflow-y-auto p-12 lg:p-20 scrollbar-thin">
        <div class="max-w-6xl mx-auto space-y-16 animate-fade">
          
          <div class="flex flex-col md:flex-row justify-between items-end gap-12">
             <div class="space-y-4">
                <div class="flex items-center gap-3 text-primary-500">
                   <div class="w-10 h-0.5 bg-current rounded-full"></div>
                   <span class="text-[10px] font-black uppercase tracking-[0.4em]">Gestión de Activos</span>
                </div>
                <h1 class="text-5xl lg:text-7xl font-black text-text-title tracking-tighter uppercase italic leading-none">{{ activeView() }}</h1>
                <p class="text-xl text-text-muted font-medium italic">Supervisa y optimiza la experiencia Nitex.</p>
             </div>
             
             <div class="flex gap-6">
                <div class="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm text-center min-w-[200px] hover:shadow-xl transition-all group">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Estudiantes</p>
                   <p class="text-5xl font-black text-text-title tracking-tighter group-hover:text-primary-500 transition-colors">{{ allUsers().length }}</p>
                </div>
                <div class="p-10 bg-white rounded-[48px] border border-slate-100 shadow-sm text-center min-w-[200px] hover:shadow-xl transition-all group">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Cursos</p>
                   <p class="text-5xl font-black text-primary-500 tracking-tighter">{{ allCourses().length }}</p>
                </div>
             </div>
          </div>

          <!-- Views -->
          <div class="animate-fade-up">
             @if (activeView() === 'Dashboard') {
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   <div class="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm space-y-6">
                      <div class="w-16 h-16 bg-primary-50 rounded-[24px] flex-center text-primary-500">
                         <mat-icon class="scale-110">people</mat-icon>
                      </div>
                      <div>
                         <p class="text-4xl font-black text-text-title tracking-tighter">{{ allUsers().length }}</p>
                         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Estudiantes Totales</p>
                      </div>
                   </div>
                   <div class="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm space-y-6">
                      <div class="w-16 h-16 bg-indigo-50 rounded-[24px] flex-center text-indigo-500">
                         <mat-icon class="scale-110">school</mat-icon>
                      </div>
                      <div>
                         <p class="text-4xl font-black text-text-title tracking-tighter">{{ allCourses().length }}</p>
                         <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cursos Activos</p>
                      </div>
                   </div>
                </div>
                
                <div class="mt-12 p-12 bg-slate-900 rounded-[64px] text-white relative overflow-hidden">
                   <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl"></div>
                   <div class="relative z-10 space-y-4">
                      <h3 class="text-3xl font-black italic uppercase tracking-tighter">Resumen de Actividad</h3>
                      <p class="text-white/60 font-medium italic">La plataforma Nitex está operando con un rendimiento del 99.9% hoy.</p>
                   </div>
                </div>
             }

             @if (activeView() === 'Usuarios') {
               <div class="bg-white rounded-[64px] border border-slate-100 overflow-hidden shadow-[0_64px_120px_-24px_rgba(0,0,0,0.08)]">
                  <table class="w-full text-left">
                    <thead>
                      <tr class="bg-slate-50/50 border-b border-slate-100">
                        <th class="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identidad del Estudiante</th>
                        <th class="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso Global</th>
                        <th class="px-12 py-8 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-50">
                      @for (user of allUsers(); track user.id) {
                        <tr class="group hover:bg-slate-50/50 transition-all duration-500">
                          <td class="px-12 py-10">
                            <div class="flex items-center gap-6">
                              <div class="w-16 h-16 rounded-[24px] overflow-hidden shadow-lg border-2 border-white ring-4 ring-slate-50 group-hover:ring-primary-50 transition-all">
                                <img [src]="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name" class="w-full h-full object-cover">
                              </div>
                              <div class="min-w-0">
                                <p class="text-xl font-black text-text-title tracking-tight italic uppercase leading-none mb-2">{{ user.name }}</p>
                                <p class="text-xs text-text-muted font-medium italic">{{ user.email }}</p>
                              </div>
                            </div>
                          </td>
                          <td class="px-12 py-10">
                            <div class="space-y-3">
                               <div class="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400 px-1">
                                  <span>Avance</span>
                                  <span>{{ user.completedLessons.length * 5 }}%</span>
                               </div>
                               <div class="w-40 h-2 bg-slate-100 rounded-full overflow-hidden">
                                  <div [style.width.%]="user.completedLessons.length * 5" class="h-full bg-primary-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]"></div>
                               </div>
                            </div>
                          </td>
                          <td class="px-12 py-10 text-right">
                             <div class="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                               <button (click)="editUser(user)" class="w-12 h-12 rounded-2xl bg-white text-slate-400 hover:text-primary-500 shadow-sm border border-slate-100 flex-center transition-all hover:scale-110"><mat-icon class="scale-75">edit</mat-icon></button>
                               <button (click)="deleteUser(user)" [disabled]="user.role === 'admin'" class="w-12 h-12 rounded-2xl bg-white text-slate-400 hover:text-rose-500 shadow-sm border border-slate-100 flex-center transition-all disabled:opacity-10 hover:scale-110"><mat-icon class="scale-75">delete</mat-icon></button>
                             </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
               </div>
             }

             @if (activeView() === 'Cursos') {
               <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  @for (course of allCourses(); track course.id) {
                    <div class="bg-white p-10 rounded-[64px] border border-slate-100 shadow-sm hover:shadow-[0_64px_120px_-24px_rgba(0,0,0,0.1)] transition-all duration-700 group flex items-center justify-between relative overflow-hidden">
                       <div class="flex items-center gap-8 min-w-0 relative z-10">
                          <div class="w-24 h-24 rounded-[32px] overflow-hidden border border-slate-100 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                             <img [src]="course.image" class="w-full h-full object-cover">
                          </div>
                          <div class="min-w-0">
                             <p class="text-[10px] text-primary-500 font-black uppercase tracking-[0.3em] mb-2 leading-none">{{ course.category }}</p>
                             <p class="text-2xl font-black text-text-title tracking-tight italic truncate uppercase leading-tight">{{ course.title }}</p>
                          </div>
                       </div>
                       <div class="flex gap-3 relative z-10">
                          <button (click)="editCourse(course)" class="w-14 h-14 rounded-3xl bg-slate-50 text-slate-400 hover:bg-primary-500 hover:text-white transition-all duration-500 flex-center hover:scale-110 shadow-sm"><mat-icon class="scale-75">edit</mat-icon></button>
                          <button (click)="deleteCourse(course)" class="w-14 h-14 rounded-3xl bg-slate-50 text-slate-400 hover:bg-rose-500 hover:text-white transition-all duration-500 flex-center hover:scale-110 shadow-sm"><mat-icon class="scale-75">delete</mat-icon></button>
                       </div>
                    </div>
                  }
                  <button (click)="createNewCourse()" class="p-12 rounded-[64px] border-4 border-dashed border-slate-100 text-slate-300 hover:border-primary-500/50 hover:text-primary-500 hover:bg-primary-50/20 transition-all duration-700 flex flex-col items-center justify-center gap-6 group">
                     <div class="w-20 h-20 bg-slate-50 rounded-[32px] flex-center group-hover:bg-primary-500 group-hover:text-white group-hover:rotate-90 transition-all duration-700 shadow-sm group-hover:shadow-xl group-hover:shadow-primary-500/30">
                        <mat-icon class="scale-[1.8]">add</mat-icon>
                     </div>
                     <span class="text-xs font-black uppercase tracking-[0.4em]">Inyectar Nuevo Activo Educativo</span>
                  </button>
               </div>
             }
          </div>

        </div>
      </main>

    </div>
  `,
})
export class AdminPanel {
  public auth = inject(AuthService);
  private courseService = inject(CourseService);
  private router = inject(Router);

  activeView = signal('Dashboard');
  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', view: 'Dashboard' },
    { label: 'Cursos', icon: 'school', view: 'Cursos' },
    { label: 'Usuarios', icon: 'people', view: 'Usuarios' }
  ];

  allUsers = signal<User[]>([]);
  allCourses = computed(() => this.courseService.getAllCourses()());

  constructor() {
    if (this.auth.currentUser()?.role !== 'admin') {
      this.router.navigate(['/']);
    }
    this.refreshData();
  }

  refreshData() {
    this.allUsers.set(JSON.parse(localStorage.getItem('nitex_users_db') || '[]'));
  }

  editUser(user: User) {
    const name = prompt('Nuevo nombre del estudiante:', user.name);
    if (name) {
      const users = [...this.allUsers()];
      const idx = users.findIndex(u => u.id === user.id);
      users[idx] = { ...users[idx], name };
      localStorage.setItem('nitex_users_db', JSON.stringify(users));
      this.refreshData();
    }
  }

  deleteUser(user: User) {
    if (user.role === 'admin') return;
    if (confirm(`¿Estás seguro de expulsar a ${user.name} de la comunidad?`)) {
      const users = this.allUsers().filter(u => u.id !== user.id);
      localStorage.setItem('nitex_users_db', JSON.stringify(users));
      this.refreshData();
    }
  }

  createNewCourse() {
    const title = prompt('Título del nuevo curso:');
    if (title) {
       const newCourse: Course = {
          id: 'new-' + Date.now(),
          title,
          category: 'Tecnología',
          shortDescription: 'Nuevo curso inyectado desde el panel admin.',
          fullDescription: 'Descripción extendida del curso.',
          image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
          level: 'Básico',
          duration: '20h',
          lessonsCount: 5,
          rating: 5.0,
          instructor: 'Admin Instructor',
          video: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
       };
       this.courseService.addCourse(newCourse);
    }
  }

  editCourse(course: Course) {
    const newTitle = prompt('Nuevo título para el curso:', course.title);
    if (newTitle) {
       this.courseService.updateCourse({ ...course, title: newTitle });
    }
  }

  deleteCourse(course: Course) {
    if (confirm(`¿Eliminar ${course.title} permanentemente del catálogo de élite?`)) {
      this.courseService.deleteCourse(course.id);
    }
  }
}
