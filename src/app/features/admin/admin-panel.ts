import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../core/models/user.model';
import { Course } from '../../core/models/course.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-dark-bg min-h-screen py-12 text-slate-300">
      <div class="max-w-7xl mx-auto px-4">
        
        <div class="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 class="text-4xl font-black tracking-tighter mb-2 text-white">Panel de Administración</h1>
            <p class="text-slate-500 font-medium">Gestión de usuarios, cursos y métricas de la plataforma.</p>
          </div>
          <div class="flex gap-4">
             <div class="p-5 bg-dark-card rounded-2xl border border-slate-800 shadow-xl flex items-center gap-4">
               <div class="w-10 h-10 bg-primary-600/10 text-primary-400 rounded-xl flex items-center justify-center border border-primary-500/20">
                 <mat-icon>people</mat-icon>
               </div>
               <div>
                 <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Usuarios</div>
                 <div class="text-xl font-black text-white">{{ allUsers().length }}</div>
               </div>
             </div>
             <div class="p-5 bg-dark-card rounded-2xl border border-slate-800 shadow-xl flex items-center gap-4">
               <div class="w-10 h-10 bg-emerald-600/10 text-emerald-400 rounded-xl flex items-center justify-center border border-emerald-500/20">
                 <mat-icon>school</mat-icon>
               </div>
               <div>
                 <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cursos Activos</div>
                 <div class="text-xl font-black text-white">{{ allCourses().length }}</div>
               </div>
             </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="bg-dark-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl transition-all mb-12">
          <div class="p-6 border-b border-white/5 flex justify-between items-center bg-dark-surface/50">
            <h2 class="text-lg font-black text-white uppercase tracking-widest">Usuarios Registrados</h2>
          </div>
          
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 bg-dark-surface/30">
                  <th class="px-8 py-5">Usuario</th>
                  <th class="px-8 py-5">Rol</th>
                  <th class="px-8 py-5">Cursos</th>
                  <th class="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (user of allUsers(); track user.id) {
                  <tr class="hover:bg-white/[0.02] transition-colors group">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                          <img [src]="user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.name" class="w-full h-full object-cover" [alt]="user.name">
                        </div>
                        <div>
                          <p class="font-bold text-slate-200 group-hover:text-white transition-colors">{{ user.name }}</p>
                          <p class="text-xs text-slate-500">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-8 py-5">
                      <span [class]="user.role === 'admin' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary-500/10 text-primary-400 border-primary-500/20'" class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border">
                        {{ user.role }}
                      </span>
                    </td>
                    <td class="px-8 py-5 font-bold text-slate-400 text-xs uppercase tracking-wider">
                      {{ user.enrolledCourses.length }} cursos
                    </td>
                    <td class="px-8 py-5 text-right">
                      <div class="flex justify-end gap-2">
                        <button (click)="editUser(user)" class="p-2 text-slate-500 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all" title="Editar">
                           <mat-icon class="scale-75">edit</mat-icon>
                        </button>
                        <button (click)="deleteUser(user)" [disabled]="user.role === 'admin'" class="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-20 disabled:cursor-not-allowed" title="Eliminar">
                           <mat-icon class="scale-75">delete</mat-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Courses Table -->
        <div class="bg-dark-card rounded-3xl border border-slate-800 overflow-hidden shadow-2xl transition-all">
          <div class="p-6 border-b border-white/5 flex justify-between items-center bg-dark-surface/50">
            <h2 class="text-lg font-black text-white uppercase tracking-widest">Catálogo de Cursos</h2>
            <button class="bg-primary-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-500 transition-all flex items-center gap-2 shadow-lg shadow-primary-900/20">
              <mat-icon class="scale-50">add</mat-icon> Nuevo Curso
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 bg-dark-surface/30">
                  <th class="px-8 py-5">Curso</th>
                  <th class="px-8 py-5">Categoría</th>
                  <th class="px-8 py-5">Rating</th>
                  <th class="px-8 py-5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/5">
                @for (course of allCourses(); track course.id) {
                  <tr class="hover:bg-white/[0.02] transition-colors group">
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-4">
                        <div class="w-16 h-10 rounded-lg bg-slate-900 overflow-hidden border border-slate-800">
                          <img [src]="course.image" class="w-full h-full object-cover" [alt]="course.title">
                        </div>
                        <p class="font-bold text-slate-200 group-hover:text-white transition-colors">{{ course.title }}</p>
                      </div>
                    </td>
                    <td class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{{ course.category }}</td>
                    <td class="px-8 py-5">
                      <div class="flex items-center gap-1 text-amber-500">
                        <mat-icon class="scale-50">star</mat-icon>
                        <span class="text-xs font-bold">{{ course.rating }}</span>
                      </div>
                    </td>
                    <td class="px-8 py-5 text-right">
                       <div class="flex justify-end gap-2">
                        <button class="p-2 text-slate-500 hover:text-primary-400 hover:bg-primary-500/10 rounded-lg transition-all">
                           <mat-icon class="scale-75">edit</mat-icon>
                        </button>
                        <button class="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                           <mat-icon class="scale-75">delete</mat-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-12 p-8 bg-amber-500/5 rounded-3xl border border-amber-500/20 flex items-start gap-6 shadow-xl shadow-amber-900/5">
           <div class="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/30">
             <mat-icon>info</mat-icon>
           </div>
           <div>
             <h3 class="text-base font-black text-amber-500 mb-1 uppercase tracking-widest">Mantenimiento planificado</h3>
             <p class="text-amber-500/80 leading-relaxed font-medium text-sm">
               La gestión de contenidos (Cursos y Lecciones) en este panel está bajo desarrollo. Actualmente se permite únicamente la gestión de usuarios y visualización de métricas básicas.
             </p>
           </div>
        </div>
      </div>
    </div>
  `
})
export class AdminPanel {
  private auth = inject(AuthService);
  private courseService = inject(CourseService);

  allUsers = signal<User[]>([]);
  allCourses = signal<Course[]>([]);

  constructor() {
    this.refreshUsers();
    this.allCourses.set(this.courseService.getAllCourses()());
  }

  refreshUsers() {
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    // Add logged in users if any from session? 
    // Usually DB is the source. The AuthService register/login syncs to 'nitex_users_db'.
    // Let's add the default admin if missing
    if (!users.find((u: User) => u.email === 'admin@nitex.com')) {
       users.push({
         id: 'admin_1',
         email: 'admin@nitex.com',
         name: 'Administrador Nitex',
         role: 'admin',
         enrolledCourses: [],
         completedLessons: [],
         examResults: {},
         certificates: [],
         createdAt: Date.now()
       });
    }
    this.allUsers.set(users);
  }

  editUser(user: User) {
    const newName = prompt('Nuevo nombre:', user.name);
    if (newName && newName !== user.name) {
      const users = [...this.allUsers()];
      const idx = users.findIndex(u => u.id === user.id);
      if (idx !== -1) {
        users[idx] = { ...users[idx], name: newName };
        localStorage.setItem('nitex_users_db', JSON.stringify(users));
        this.refreshUsers();
        // If current user is the one edited, update session
        if (this.auth.currentUser()?.id === user.id) {
          this.auth.updateUser(users[idx]);
        }
      }
    }
  }

  deleteUser(user: User) {
    if (user.role === 'admin') return;
    if (confirm(`¿Seguro que quieres eliminar a ${user.name}?`)) {
      const users = this.allUsers().filter(u => u.id !== user.id);
      localStorage.setItem('nitex_users_db', JSON.stringify(users));
      this.refreshUsers();
    }
  }
}
