import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { CourseService } from '../../core/services/course.service';
import { MatIconModule } from '@angular/material/icon';
import { Course } from '../../core/models/course.model';

@Component({
  selector: 'app-profile-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex h-[calc(100vh-80px)] bg-bg-main overflow-hidden font-sans">
      
      <!-- 📂 Dashboard Sidebar (Fijo) -->
      <aside class="w-80 shrink-0 bg-white border-r border-slate-100 flex flex-col p-10 space-y-12">
        <div class="flex flex-col items-center text-center space-y-6">
           <div class="relative">
              <div class="w-28 h-28 rounded-[40px] p-1 bg-gradient-to-tr from-primary-400 to-primary-100 shadow-xl overflow-hidden">
                 <img [src]="user()?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user()?.name" class="w-full h-full object-cover rounded-[32px] bg-white">
              </div>
              <span class="absolute bottom-0 right-0 w-8 h-8 bg-emerald-500 border-4 border-white rounded-2xl shadow-lg"></span>
           </div>
           <div>
              <h2 class="text-xl font-black text-text-title tracking-tighter uppercase italic leading-none">{{ user()?.name }}</h2>
              <p class="text-[10px] font-black text-primary-500 uppercase tracking-widest mt-2">Estudiante Élite</p>
           </div>
        </div>

        <nav class="space-y-2">
          @for (item of menuItems; track item.view) {
            <button 
              (click)="activeView.set(item.view)"
              class="w-full flex items-center gap-4 px-8 py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest transition-all group"
              [class]="activeView() === item.view ? 'bg-primary-500 text-white shadow-xl shadow-primary-500/20' : 'text-slate-400 hover:bg-slate-50 hover:text-primary-600'"
            >
              <mat-icon class="scale-90" [class.text-white]="activeView() === item.view">{{ item.icon }}</mat-icon>
              {{ item.label }}
            </button>
          }
        </nav>

        <div class="mt-auto pt-10 border-t border-slate-50">
           <button (click)="auth.logout()" class="w-full flex items-center gap-4 px-8 py-5 rounded-3xl text-[11px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all">
              <mat-icon class="scale-90">logout</mat-icon> Cerrar Sesión
           </button>
        </div>
      </aside>

      <!-- 📊 Dashboard Content Area -->
      <main class="flex-grow overflow-y-auto p-12 lg:p-20 scrollbar-thin">
        <div class="max-w-6xl mx-auto space-y-16 animate-fade">
          
          <div class="space-y-4">
             <h1 class="text-5xl lg:text-7xl font-black text-text-title tracking-tighter uppercase italic leading-none">{{ activeViewLabel() }}</h1>
             <p class="text-xl text-text-muted font-medium italic">Gestiona tu progreso académico y logros.</p>
          </div>

          <!-- 📚 Mis Cursos -->
          @if (activeView() === 'courses') {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up">
               @if (myCourses().length > 0) {
                 @for (course of myCourses(); track course.id) {
                    <div class="bg-white rounded-[48px] p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
                       <div class="flex items-center gap-6 mb-8">
                          <div class="w-20 h-20 rounded-3xl overflow-hidden border border-slate-100 shrink-0">
                             <img [src]="course.image" class="w-full h-full object-cover">
                          </div>
                          <div class="min-w-0">
                             <h3 class="text-xl font-black text-text-title tracking-tight italic uppercase truncate leading-none mb-3">{{ course.title }}</h3>
                             <p class="text-[10px] text-primary-500 font-black uppercase tracking-widest">{{ course.category }}</p>
                          </div>
                       </div>
                       
                       <div class="space-y-3 mb-8">
                          <div class="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                             <span>Progreso</span>
                             <span>{{ getProgress(course.id) }}%</span>
                          </div>
                          <div class="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                             <div [style.width.%]="getProgress(course.id)" class="h-full bg-primary-500 transition-all duration-1000"></div>
                          </div>
                       </div>

                       <div class="mt-auto">
                          <button [routerLink]="['/learning', course.id]" class="w-full py-5 bg-slate-900 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest group-hover:bg-primary-500 transition-all">
                             Continuar Formación
                          </button>
                       </div>
                    </div>
                 }
               } @else {
                  <div class="col-span-full py-40 bg-white rounded-[64px] border border-slate-50 text-center space-y-8">
                     <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                        <mat-icon class="scale-150">school</mat-icon>
                     </div>
                     <div class="space-y-4">
                        <h3 class="text-3xl font-black text-text-title tracking-tighter uppercase italic">No hay inscripciones</h3>
                        <p class="text-text-muted font-medium italic">Tu catálogo está esperando nuevas aventuras académicas.</p>
                     </div>
                     <button routerLink="/courses" class="btn-primary">Ver Cursos Disponibles</button>
                  </div>
               }
            </div>
          }

          <!-- 🏆 Certificados -->
          @if (activeView() === 'certificates') {
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-up">
               @if (certificates().length > 0) {
                 @for (cert of certificates(); track cert.id) {
                    <div class="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm flex items-center gap-8 group hover:shadow-2xl transition-all">
                       <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                          <mat-icon class="scale-[1.8]">military_tech</mat-icon>
                       </div>
                       <div class="flex-grow space-y-2">
                          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certificación Oficial</p>
                          <h3 class="text-2xl font-black text-text-title tracking-tighter italic uppercase leading-none">{{ cert.courseName }}</h3>
                          <p class="text-[10px] font-black text-primary-500 uppercase tracking-widest opacity-60">ID: {{ cert.id }}</p>
                       </div>
                        <a [routerLink]="['/certificates', cert.id]" class="px-8 py-4 bg-primary-500 text-white rounded-[20px] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary-500/20">
                           Ver Certificado
                        </a>
                    </div>
                 }
               } @else {
                  <div class="col-span-full py-40 bg-white rounded-[64px] border border-slate-50 text-center space-y-8">
                     <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                        <mat-icon class="scale-150">emoji_events</mat-icon>
                     </div>
                     <h3 class="text-3xl font-black text-text-title tracking-tighter uppercase italic">Sin Trofeos Aún</h3>
                     <p class="text-text-muted font-medium italic">Completa el examen final de un curso para obtener tu certificado.</p>
                  </div>
               }
            </div>
          }

          <!-- 👤 Perfil / Configuración -->
          @if (activeView() === 'profile_settings') {
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fade-up">
               
               <!-- Left Card: Personal Info -->
               <div class="lg:col-span-8 bg-white rounded-[64px] p-12 lg:p-16 border border-slate-100 shadow-sm space-y-12">
                  <div class="space-y-2">
                     <h2 class="text-3xl font-black text-text-title uppercase italic tracking-tighter">Información Personal</h2>
                     <p class="text-sm text-text-muted font-medium italic">Gestiona tu identidad y seguridad.</p>
                  </div>

                  <div class="flex items-center gap-10 py-6">
                     <div class="relative">
                        <div class="w-32 h-32 rounded-[40px] p-1 bg-gradient-to-tr from-primary-400 to-primary-100 shadow-xl overflow-hidden">
                           <img [src]="avatarPreview() || user()?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user()?.name" class="w-full h-full object-cover rounded-[32px] bg-white">
                        </div>
                        <label class="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg cursor-pointer hover:bg-primary-600 border-4 border-white">
                           <mat-icon class="scale-75">camera_alt</mat-icon>
                           <input type="file" (change)="onFileSelected($event)" class="hidden" accept="image/*">
                        </label>
                     </div>
                     <div class="space-y-2">
                        <button (click)="triggerFileInput()" class="px-8 py-4 border border-slate-200 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Cambiar foto</button>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Formatos: JPG, PNG</p>
                     </div>
                  </div>

                  <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-8">
                     <div class="space-y-3">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nombre Completo</label>
                        <div class="input-group">
                           <div class="input-icon-wrapper">
                              <mat-icon class="scale-90">person</mat-icon>
                           </div>
                           <input formControlName="name" type="text" class="input-field" placeholder="Tu nombre">
                        </div>
                        @if (profileForm.get('name')?.touched && profileForm.get('name')?.errors?.['required']) {
                           <p class="input-error-msg">El nombre es obligatorio</p>
                        }
                     </div>

                     <div class="space-y-3">
                        <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Correo Electrónico</label>
                        <div class="input-group">
                           <div class="input-icon-wrapper">
                              <mat-icon class="scale-90">mail</mat-icon>
                           </div>
                           <input formControlName="email" type="email" class="input-field" placeholder="tu@nitex.com">
                        </div>
                        @if (profileForm.get('email')?.touched) {
                           @if (profileForm.get('email')?.errors?.['required']) {
                              <p class="input-error-msg">El email es obligatorio</p>
                           } @else if (profileForm.get('email')?.errors?.['email']) {
                              <p class="input-error-msg">Email inválido</p>
                           }
                        }
                     </div>

                      @if (showSuccess()) {
                        <div class="p-4 bg-primary-50 border border-primary-100 rounded-2xl flex items-center gap-3 animate-fade mb-4">
                           <mat-icon class="text-primary-500 scale-75">check_circle</mat-icon>
                           <p class="text-[10px] font-bold text-primary-600 uppercase tracking-widest leading-tight">Perfil actualizado correctamente</p>
                        </div>
                      }

                      <div class="pt-10">
                        <button type="submit" [disabled]="profileForm.invalid || isSaving()" class="w-full btn-primary py-6 rounded-[32px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-500/20 disabled:opacity-30">
                           <div class="icon-text flex-center">
                              <span>{{ isSaving() ? 'Guardando...' : 'Guardar Cambios' }}</span>
                              @if (!isSaving()) { <mat-icon class="scale-75">save</mat-icon> }
                           </div>
                        </button>
                     </div>
                  </form>
               </div>

               <!-- Right Card: Progress Summary -->
               <div class="lg:col-span-4 space-y-8">
                  <div class="bg-white rounded-[48px] p-10 border border-slate-100 shadow-sm space-y-10">
                     <h3 class="text-xl font-black text-text-title uppercase italic tracking-tighter">Tu Progreso Resumido</h3>
                     <div class="text-center space-y-4">
                        <p class="text-8xl font-black text-primary-500 tracking-tighter leading-none">{{ myCourses().length }}</p>
                        <p class="text-xs font-black text-text-title uppercase tracking-widest">Cursos Inscritos</p>
                     </div>
                     <div class="pt-8 border-t border-slate-50 text-center">
                        <p class="text-xs font-medium text-text-muted italic leading-relaxed">Sigue capacitándote para desbloquear nuevos certificados éltie.</p>
                     </div>
                  </div>
               </div>

            </div>
          }

        </div>
      </main>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .scrollbar-thin::-webkit-scrollbar { width: 6px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
  `]
})
export class ProfileDashboard implements OnInit {
  public auth = inject(AuthService);
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  user = computed(() => this.auth.currentUser());
  activeView = signal('courses');
  isSaving = signal(false);
  avatarPreview = signal<string | null>(null);

  profileForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  menuItems = [
    { label: 'Mis Cursos', icon: 'school', view: 'courses' },
    { label: 'Certificados', icon: 'military_tech', view: 'certificates' },
    { label: 'Mi Perfil', icon: 'person', view: 'profile_settings' }
  ];

  myCourses = computed(() => {
    return this.courseService.getAllCourses()().filter(c => c.featured || this.user()?.enrolledCourses.includes(c.id));
  });

  certificates = computed(() => {
    return this.user()?.certificates || [];
  });

  activeViewLabel = computed(() => {
    return this.menuItems.find(m => m.view === this.activeView())?.label || 'Dashboard';
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['tab']) this.activeView.set(params['tab']);
    });

    const currentUser = this.user();
    if (currentUser) {
      this.profileForm.patchValue({
        name: currentUser.name,
        email: currentUser.email
      });
    }
  }

  getProgress(courseId: string): number {
    const user = this.user();
    if (!user) return 0;
    const levels = this.courseService.getCourseLevels(courseId);
    if (levels.length === 0) return 0;
    const total = levels.reduce((acc: number, l: any) => acc + l.lessons.length, 0);
    const completed = levels.reduce((acc: number, l: any) => {
      return acc + l.lessons.filter((less: any) => user.completedLessons.includes(less.id)).length;
    }, 0);
    return Math.round((completed / total) * 100);
  }

  triggerFileInput() {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    input?.click();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.avatarPreview.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  showSuccess = signal(false);

  saveProfile() {
    if (this.profileForm.invalid) return;
    this.isSaving.set(true);
    this.showSuccess.set(false);
    
    setTimeout(() => {
      const updatedUser = {
        ...this.user()!,
        name: this.profileForm.value.name,
        email: this.profileForm.value.email,
        avatar: this.avatarPreview() || this.user()?.avatar
      };
      
      this.auth.updateUser(updatedUser);
      this.isSaving.set(false);
      this.showSuccess.set(true);
      this.avatarPreview.set(null);

      setTimeout(() => this.showSuccess.set(false), 3000);
    }, 1000);
  }
}
