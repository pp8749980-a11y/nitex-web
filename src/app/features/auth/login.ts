import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex bg-white font-sans">
      
      <!-- Left Panel: Brand & Motivation -->
      <div class="hidden lg:flex lg:w-1/2 bg-[#050A1F] relative overflow-hidden items-center justify-center p-20">
         <!-- Abstract decor -->
         <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
         <div class="absolute -top-24 -left-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full"></div>
         <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full"></div>

         <div class="relative z-10 max-w-xl space-y-12 animate-fade-left">
            <div class="flex items-center gap-4">
               <div class="w-16 h-1 bg-primary-500"></div>
               <span class="text-xs font-black text-primary-400 uppercase tracking-[0.5em]">BIENVENIDO A NITEX</span>
            </div>
            <h2 class="text-6xl xl:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">Forja tu <span class="text-primary-500">Destino</span> Académico.</h2>
            <p class="text-xl text-slate-400 font-medium leading-relaxed italic">Únete a la comunidad de aprendizaje más exclusiva y profesional. Accede a recursos de élite y certificaciones que transformarán tu carrera.</p>
            
            <div class="grid grid-cols-2 gap-8 pt-10">
               <div class="space-y-2">
                  <p class="text-4xl font-black text-white italic tracking-tighter">50K+</p>
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estudiantes Activos</p>
               </div>
               <div class="space-y-2">
                  <p class="text-4xl font-black text-white italic tracking-tighter">1.2K</p>
                  <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cursos Máster</p>
               </div>
            </div>
         </div>
      </div>

      <!-- Right Panel: Login Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 relative bg-white">
         <div class="max-w-md w-full space-y-12 animate-fade-up">
            <div class="text-center lg:text-left space-y-4">
               <div class="lg:hidden flex justify-center mb-8">
                  <div class="w-16 h-16 bg-[#050A1F] text-white rounded-2xl flex items-center justify-center shadow-xl">
                     <mat-icon class="scale-110">school</mat-icon>
                  </div>
               </div>
               <h1 class="text-4xl font-black text-text-title tracking-tighter uppercase italic leading-none">Acceso <span class="text-primary-500">Elite</span></h1>
               <p class="text-text-muted font-medium italic">Ingresa tus credenciales para continuar tu formación.</p>
            </div>

            @if (errorMsg()) {
              <div class="p-5 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                <mat-icon class="scale-75">info</mat-icon>
                {{ errorMsg() }}
              </div>
            }

            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-8">
               <div class="space-y-3">
                  <label for="email" class="text-[10px] font-black uppercase text-slate-300 tracking-widest ml-2">Email corporativo</label>
                  <input id="email" formControlName="email" type="email" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-text-title font-bold focus:bg-white focus:shadow-xl transition-all outline-none italic" placeholder="tu@empresa.com">
               </div>
               
               <div class="space-y-3">
                  <div class="flex justify-between items-center ml-2">
                     <label for="password" class="text-[10px] font-black uppercase text-slate-300 tracking-widest">Contraseña segura</label>
                     <a routerLink="/auth/forgot" class="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:underline">¿Olvido?</a>
                  </div>
                  <div class="relative">
                     <input id="password" [type]="showPassword() ? 'text' : 'password'" formControlName="password" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-text-title font-bold focus:bg-white focus:shadow-xl transition-all outline-none italic" placeholder="••••••••">
                     <button type="button" (click)="showPassword.set(!showPassword())" class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-text-title transition-colors">
                        <mat-icon class="scale-90">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                     </button>
                  </div>
               </div>

               <button type="submit" [disabled]="loginForm.invalid || isLoading()" class="w-full py-5 bg-[#050A1F] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-primary-500 transition-all shadow-xl shadow-primary-900/20 active:scale-95 flex items-center justify-center gap-4 group">
                  @if (isLoading()) {
                    <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    AUTENTICANDO...
                  } @else {
                    ACCEDER A LA ACADEMIA <mat-icon class="group-hover:translate-x-1 transition-transform">arrow_forward</mat-icon>
                  }
               </button>
            </form>

            <div class="space-y-8 pt-4">
               <div class="flex items-center gap-4 text-[9px] font-black text-slate-200 uppercase tracking-[0.5em]">
                  <div class="flex-grow h-px bg-slate-100"></div>
                  O continúa con
                  <div class="flex-grow h-px bg-slate-100"></div>
               </div>
               <button type="button" class="w-full py-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-text-title hover:bg-slate-50 transition-all group">
                  <svg class="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"></path><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path></svg>
                  Google Identity
               </button>
            </div>

            <p class="text-center text-xs font-black italic text-slate-300">
               ¿No tienes una cuenta? <a routerLink="/auth/register" class="text-primary-500 uppercase tracking-widest ml-2 hover:underline">Regístrate gratis</a>
            </p>
         </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['student@nitex.com', [Validators.required, Validators.email]],
    password: ['Nitex123!', [Validators.required, Validators.minLength(8)]]
  });

  isLoading = signal(false);
  errorMsg = signal('');
  showPassword = signal(false);

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    this.errorMsg.set('');

    setTimeout(() => {
      const { email, password } = this.loginForm.value;
      const success = this.auth.login(email, password);
      
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.errorMsg.set('Correo o contraseña incorrectos. Usa student@nitex.com / Nitex123!');
        this.isLoading.set(false);
      }
    }, 1000);
  }
}
