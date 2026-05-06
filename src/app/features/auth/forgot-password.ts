import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      <!-- 🌿 Background Orbs -->
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary-200/40 rounded-full blur-[100px] animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-100/30 rounded-full blur-[100px] animate-pulse delay-1000"></div>

      <div class="w-full max-w-lg relative z-10 animate-fade-up">
        <div class="bg-white/70 backdrop-blur-3xl rounded-[48px] p-8 lg:p-12 shadow-[0_64px_120px_-24px_rgba(0,0,0,0.1)] border border-white relative overflow-hidden">
          
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 mx-auto mb-6 rotate-6">
              <mat-icon class="scale-110">vpn_key</mat-icon>
            </div>
            <h1 class="text-3xl lg:text-4xl font-black text-text-title tracking-tighter uppercase italic mb-1 leading-none">Recuperar</h1>
            <p class="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] opacity-70">Sigue los pasos para restablecer tu acceso</p>
          </div>

          <!-- Step Indicators -->
          <div class="flex justify-between mb-10 px-4">
             @for (s of [1, 2, 3, 4]; track s) {
                <div class="flex items-center">
                   <div class="w-8 h-8 rounded-full flex-center text-[10px] font-black transition-all"
                      [class]="step() === s ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 scale-110' : 
                               step() > s ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'">
                      {{ s }}
                   </div>
                   @if (s < 4) {
                      <div class="w-8 h-[2px] bg-slate-100 mx-2" [class.bg-primary-100]="step() > s"></div>
                   }
                </div>
             }
          </div>

          <!-- Step 1: Email -->
          @if (step() === 1) {
            <form [formGroup]="emailForm" (ngSubmit)="sendCode()" class="space-y-6 animate-fade-right">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Ingresa tu Correo</label>
                <div class="input-group">
                  <div class="input-icon-wrapper">
                    <mat-icon class="scale-90">mail</mat-icon>
                  </div>
                  <input formControlName="email" type="email" class="input-field" placeholder="tu@nitex.com">
                </div>
              </div>
              <button type="submit" [disabled]="emailForm.invalid || isLoading()" class="w-full btn-primary py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black">
                 {{ isLoading() ? 'Enviando...' : 'Enviar Código' }}
              </button>
            </form>
          }

          <!-- Step 2 & 3: Verify Code -->
          @if (step() === 2) {
            <div class="space-y-6 animate-fade-right">
               <div class="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                  <mat-icon class="text-emerald-500 scale-75">check_circle</mat-icon>
                  <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-tight">Se ha enviado un código a tu correo</p>
               </div>
               <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Código de 6 dígitos</label>
                  <div class="input-group">
                    <div class="input-icon-wrapper">
                      <mat-icon class="scale-90">dialpad</mat-icon>
                    </div>
                    <input #codeInput type="text" maxlength="6" class="input-field tracking-[1em] text-center font-black" placeholder="000000">
                  </div>
               </div>
               <button (click)="verifyCode(codeInput.value)" [disabled]="isLoading()" class="w-full btn-primary py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black">
                  {{ isLoading() ? 'Verificando...' : 'Verificar Código' }}
               </button>
            </div>
          }

          <!-- Step 4: New Password -->
          @if (step() === 3) {
            <form [formGroup]="passForm" (ngSubmit)="resetPass()" class="space-y-6 animate-fade-right">
              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Nueva Contraseña</label>
                  <div class="input-group">
                    <div class="input-icon-wrapper">
                      <mat-icon class="scale-90">key</mat-icon>
                    </div>
                    <input formControlName="password" type="password" class="input-field" placeholder="••••••••">
                  </div>
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Confirmar Contraseña</label>
                  <div class="input-group">
                    <div class="input-icon-wrapper">
                      <mat-icon class="scale-90">lock</mat-icon>
                    </div>
                    <input formControlName="confirmPassword" type="password" class="input-field" placeholder="••••••••">
                  </div>
                </div>
              </div>
              <button type="submit" [disabled]="passForm.invalid || isLoading()" class="w-full btn-primary py-4 rounded-2xl text-[10px] uppercase tracking-[0.2em] font-black">
                 {{ isLoading() ? 'Restableciendo...' : 'Guardar Nueva Contraseña' }}
              </button>
            </form>
          }

          <!-- Success State -->
          @if (step() === 4) {
            <div class="text-center space-y-8 animate-fade-up">
               <div class="w-20 h-20 bg-emerald-500 text-white rounded-full flex-center mx-auto shadow-xl shadow-emerald-500/20">
                  <mat-icon class="scale-150">verified_user</mat-icon>
               </div>
               <div class="space-y-2">
                  <h3 class="text-2xl font-black text-text-title uppercase italic tracking-tighter">¡Éxito Total!</h3>
                  <p class="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Tu contraseña ha sido actualizada</p>
               </div>
               <button routerLink="/auth/login" class="w-full btn-primary py-5 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-black">
                  Ir al Login
               </button>
            </div>
          }

          @if (errorMsg()) {
            <div class="mt-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 animate-fade">
              <mat-icon class="text-rose-500 scale-75">error_outline</mat-icon>
              <p class="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-tight">{{ errorMsg() }}</p>
            </div>
          }

          <div class="mt-8 text-center pt-8 border-t border-slate-200/50">
            <a routerLink="/auth/login" class="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary-600 transition-colors flex items-center justify-center gap-2">
               <mat-icon class="scale-75">arrow_back</mat-icon> Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  step = signal(1);
  isLoading = signal(false);
  errorMsg = signal('');

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  passForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  sendCode() {
    if (this.emailForm.invalid) return;
    this.isLoading.set(true);
    this.errorMsg.set('');

    const res = this.auth.sendRecoveryCode(this.emailForm.value.email);
    setTimeout(() => {
      this.isLoading.set(false);
      if (res.success) {
        this.step.set(2);
      } else {
        this.errorMsg.set(res.message);
      }
    }, 1500);
  }

  verifyCode(code: string) {
    if (code.length < 6) return;
    this.isLoading.set(true);
    this.errorMsg.set('');

    setTimeout(() => {
      this.isLoading.set(false);
      if (this.auth.verifyRecoveryCode(code)) {
        this.step.set(3);
      } else {
        this.errorMsg.set('Código inválido o expirado.');
      }
    }, 1500);
  }

  resetPass() {
    if (this.passForm.invalid) return;
    this.isLoading.set(true);
    
    setTimeout(() => {
      if (this.auth.resetPassword(this.passForm.value.password)) {
        this.step.set(4);
      }
      this.isLoading.set(false);
    }, 2000);
  }
}
