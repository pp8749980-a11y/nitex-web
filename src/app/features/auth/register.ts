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
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <!-- 🌿 Dynamic Background Orbs -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-primary-200/40 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-primary-100/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div class="w-full max-w-lg relative z-10 animate-fade-up">
        <!-- 💎 Glassmorphism Card -->
        <div class="bg-white/70 backdrop-blur-3xl rounded-[48px] p-8 lg:p-10 shadow-[0_64px_120px_-24px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden">
          
          <div class="text-center mb-6">
            <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 mx-auto mb-4 -rotate-6">
              <mat-icon class="scale-110">rocket_launch</mat-icon>
            </div>
            <h1 class="text-3xl lg:text-4xl font-black text-text-title tracking-tighter uppercase italic mb-1 leading-none">Crear Cuenta</h1>
            <p class="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] opacity-70">Únete a nuestra comunidad de aprendizaje</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-3">
            
            <!-- Nombre Completo -->
            <div class="space-y-1">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Nombre Completo</label>
              <div class="input-group">
                <div class="input-icon-wrapper">
                  <mat-icon class="scale-90">person</mat-icon>
                </div>
                <input 
                  formControlName="name"
                  type="text" 
                  class="input-field" 
                  placeholder="Tu nombre"
                >
              </div>
              @if (registerForm.get('name')?.touched && registerForm.get('name')?.errors?.['required']) {
                <p class="input-error-msg">El nombre es obligatorio</p>
              }
            </div>

            <!-- Email -->
            <div class="space-y-1">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Correo Electrónico</label>
              <div class="input-group">
                <div class="input-icon-wrapper">
                  <mat-icon class="scale-90">mail</mat-icon>
                </div>
                <input 
                  formControlName="email"
                  type="email" 
                  class="input-field" 
                  placeholder="correo@ejemplo.com"
                >
              </div>
              @if (registerForm.get('email')?.touched) {
                @if (registerForm.get('email')?.errors?.['required']) {
                  <p class="input-error-msg">El email es obligatorio</p>
                } @else if (registerForm.get('email')?.errors?.['email']) {
                  <p class="input-error-msg">Email inválido</p>
                }
              }
            </div>

            <!-- Password -->
            <div class="space-y-1">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Contraseña</label>
              <div class="input-group">
                <div class="input-icon-wrapper">
                  <mat-icon class="scale-90">key</mat-icon>
                </div>
                <input 
                  [type]="showPassword() ? 'text' : 'password'" 
                  formControlName="password"
                  class="input-field" 
                  placeholder="Mínimo 6 caracteres"
                >
                <button 
                  type="button"
                  (click)="showPassword.set(!showPassword())"
                  class="w-14 flex items-center justify-center text-slate-300 hover:text-primary-500 transition-colors"
                >
                  <mat-icon class="scale-75">{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
                </button>
              </div>
              @if (registerForm.get('password')?.touched) {
                @if (registerForm.get('password')?.errors?.['required']) {
                  <p class="input-error-msg">La contraseña es obligatoria</p>
                } @else if (registerForm.get('password')?.errors?.['minlength']) {
                  <p class="input-error-msg">Mínimo 6 caracteres</p>
                }
              }
            </div>

            <!-- Confirm Password -->
            <div class="space-y-1">
              <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Confirmar Contraseña</label>
              <div class="input-group">
                <div class="input-icon-wrapper">
                  <mat-icon class="scale-90">lock</mat-icon>
                </div>
                <input 
                  [type]="showPassword() ? 'text' : 'password'" 
                  formControlName="confirmPassword"
                  class="input-field" 
                  placeholder="Repite tu contraseña"
                >
              </div>
              @if (registerForm.get('confirmPassword')?.touched) {
                @if (registerForm.get('confirmPassword')?.errors?.['required']) {
                  <p class="input-error-msg">Debes confirmar tu contraseña</p>
                } @else if (registerForm.errors?.['mismatch']) {
                  <p class="input-error-msg">Las contraseñas no coinciden</p>
                }
              }
            </div>

            @if (errorMsg()) {
              <div class="p-3 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-fade">
                <mat-icon class="text-rose-500 scale-75">error_outline</mat-icon>
                <p class="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-tight">{{ errorMsg() }}</p>
              </div>
            }

            <div class="pt-2">
              <button 
                type="submit" 
                [disabled]="registerForm.invalid || isLoading()"
                class="w-full btn-primary py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black shadow-xl shadow-primary-500/20 disabled:opacity-30"
              >
                @if (isLoading()) {
                  <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                } @else {
                  <div class="icon-text">
                     <span>Registrar</span>
                     <mat-icon class="scale-90">bolt</mat-icon>
                  </div>
                }
              </button>
            </div>
          </form>

          <div class="mt-6 text-center pt-6 border-t border-slate-200/50">
            <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3">¿Ya eres miembro?</p>
            <a routerLink="/auth/login" class="text-xs font-black text-primary-600 hover:text-primary-700 tracking-tight transition-colors">Inicia sesión aquí</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Register {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  isLoading = signal(false);
  errorMsg = signal('');
  showPassword = signal(false);

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    this.errorMsg.set('');

    setTimeout(() => {
      const { name, email, password } = this.registerForm.value;
      const success = this.auth.register(name, email, password);
      
      if (success) {
        this.router.navigate(['/']);
      } else {
        this.errorMsg.set('Este correo ya está registrado.');
        this.isLoading.set(false);
      }
    }, 1000);
  }
}
