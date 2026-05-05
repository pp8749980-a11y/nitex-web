import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex bg-white font-sans">
      
      <!-- Right Panel (reversed for variation): Brand & Motivation -->
      <div class="hidden lg:flex lg:w-1/2 bg-[#050A1F] relative overflow-hidden items-center justify-center p-20 order-2">
         <!-- Abstract decor -->
         <div class="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.04]"></div>
         <div class="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full"></div>
         <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-500/10 blur-[120px] rounded-full"></div>

         <div class="relative z-10 max-w-xl space-y-12 animate-fade-right">
            <div class="flex items-center gap-4">
               <div class="w-16 h-1 bg-emerald-500"></div>
               <span class="text-xs font-black text-emerald-400 uppercase tracking-[0.5em]">COMIENZA TU VIAJE</span>
            </div>
            <h2 class="text-6xl xl:text-7xl font-black text-white tracking-tighter leading-none italic uppercase">Lidera la <span class="text-emerald-500">Transformación</span> Digital.</h2>
            <p class="text-xl text-slate-400 font-medium leading-relaxed italic">Únete a miles de profesionales que ya están escalando sus carreras con Nitex. Educación de alto impacto, diseñada para los líderes del futuro.</p>
            
            <div class="space-y-6 pt-10">
               <div class="flex items-center gap-6">
                  <div class="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center"><mat-icon>verified</mat-icon></div>
                  <div>
                     <p class="text-white font-black text-xs uppercase tracking-widest italic">Certificaciones Oficiales</p>
                     <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Reconocidas por la industria</p>
                  </div>
               </div>
               <div class="flex items-center gap-6">
                  <div class="w-12 h-12 bg-primary-500/10 text-primary-500 rounded-2xl flex items-center justify-center"><mat-icon>offline_bolt</mat-icon></div>
                  <div>
                     <p class="text-white font-black text-xs uppercase tracking-widest italic">Aprendizaje Acelerado</p>
                     <p class="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Metodología Nitex Flow</p>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <!-- Left Panel: Register Form -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-20 relative bg-white order-1">
         <div class="max-w-md w-full space-y-12 animate-fade-up">
            <div class="text-center lg:text-left space-y-4">
               <h1 class="text-4xl font-black text-text-title tracking-tighter uppercase italic leading-none">Nueva <span class="text-emerald-500">Cuenta</span></h1>
               <p class="text-text-muted font-medium italic">Completa tus datos para unirte a la academia.</p>
            </div>

            @if (errorMsg()) {
              <div class="p-5 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-shake">
                <mat-icon class="scale-75">info</mat-icon>
                {{ errorMsg() }}
              </div>
            }

            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
               <div class="space-y-3">
                  <label for="name" class="text-[10px] font-black uppercase text-slate-300 tracking-widest ml-2">Nombre completo</label>
                  <input id="name" formControlName="name" type="text" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-text-title font-bold focus:bg-white focus:shadow-xl transition-all outline-none italic" placeholder="Ej: Alex Rivera">
               </div>

               <div class="space-y-3">
                  <label for="email" class="text-[10px] font-black uppercase text-slate-300 tracking-widest ml-2">Correo profesional</label>
                  <input id="email" formControlName="email" type="email" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-text-title font-bold focus:bg-white focus:shadow-xl transition-all outline-none italic" placeholder="tu@vibe.com">
               </div>
               
               <div class="space-y-3 relative group">
                  <label for="password" class="text-[10px] font-black uppercase text-slate-300 tracking-widest ml-2">Contraseña maestra</label>
                  <div class="relative">
                     <input id="password" [type]="showPassword() ? 'text' : 'password'" formControlName="password" class="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-text-title font-bold focus:bg-white focus:shadow-xl transition-all outline-none italic" placeholder="••••••••">
                     <button type="button" (click)="showPassword.set(!showPassword())" class="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-text-title transition-colors">
                        <mat-icon class="scale-90">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                     </button>
                  </div>
                  <!-- Password strength indicator -->
                  <div class="flex gap-2 h-1 px-1">
                     <div class="flex-grow rounded-full transition-all duration-500" [class]="passwordStrength() > 0 ? 'bg-red-400' : 'bg-slate-100'"></div>
                     <div class="flex-grow rounded-full transition-all duration-500" [class]="passwordStrength() > 1 ? 'bg-amber-400' : 'bg-slate-100'"></div>
                     <div class="flex-grow rounded-full transition-all duration-500" [class]="passwordStrength() > 2 ? 'bg-emerald-400' : 'bg-slate-100'"></div>
                  </div>
               </div>

               <div class="flex items-start gap-4 pt-4 group cursor-pointer">
                  <input type="checkbox" formControlName="terms" id="terms" class="mt-1 w-5 h-5 border-2 border-slate-100 rounded-lg checked:bg-emerald-500 checked:border-emerald-500 transition-all cursor-pointer">
                  <label for="terms" class="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-loose">Acepto los <a href="#" class="text-emerald-500 underline">términos de servicio</a> y la política de privacidad de la academia Nitex.</label>
               </div>

               <button type="submit" [disabled]="registerForm.invalid || isLoading()" class="w-full py-5 bg-[#050A1F] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 active:scale-95 flex items-center justify-center gap-4 group mt-6">
                  @if (isLoading()) {
                    <svg class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    FORJANDO CUENTA...
                  } @else {
                    REGISTRARME AHORA <mat-icon class="group-hover:translate-x-1 transition-transform">rocket_launch</mat-icon>
                  }
               </button>
            </form>

            <p class="text-center text-xs font-black italic text-slate-300">
               ¿Ya eres miembro? <a routerLink="/auth/login" class="text-emerald-500 uppercase tracking-widest ml-2 hover:underline">Iniciar sesión</a>
            </p>
         </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, Validators.requiredTrue]
  });

  isLoading = signal(false);
  errorMsg = signal('');
  showPassword = signal(false);

  passwordStrength = signal(0);

  constructor() {
    this.registerForm.get('password')?.valueChanges.subscribe(val => {
      let strength = 0;
      if (val.length > 7) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[A-Z]/.test(val) || /[!@#$%^&*]/.test(val)) strength++;
      this.passwordStrength.set(strength);
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMsg.set('');

    setTimeout(() => {
      const { name, email } = this.registerForm.value;
      const success = this.auth.register(name, email);
      
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.errorMsg.set('Este correo ya está registrado.');
        this.isLoading.set(false);
      }
    }, 1200);
  }
}
