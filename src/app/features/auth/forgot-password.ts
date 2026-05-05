import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-[80vh] flex items-center justify-center p-4 bg-dark-bg relative overflow-hidden">
      <!-- Decorative patterns -->
      <div class="absolute inset-0 -z-0 pointer-events-none overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div class="max-w-md w-full glass-card p-8 rounded-3xl shadow-2xl relative z-10 border border-slate-800">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
            <mat-icon class="scale-125">key</mat-icon>
          </div>
          <h1 class="text-3xl font-black mb-2 text-white">Recuperar acceso</h1>
          <p class="text-slate-500 font-medium">
            @if (step() === 1) { Ingresa tu correo para recibir un código de verificación }
            @else if (step() === 2) { Ingresa el código enviado a tu correo }
            @else { Crea una nueva contraseña para tu cuenta }
          </p>
        </div>

        @if (step() === 1) {
          <form [formGroup]="forgotForm" (ngSubmit)="sendCode()" class="space-y-6">
            <div class="group">
              <label for="forgot-email" class="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 ml-1">Correo Electrónico</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400">
                  <mat-icon class="scale-90">email</mat-icon>
                </span>
                <input id="forgot-email" type="email" formControlName="email" class="input-field pl-12" placeholder="tu@email.com">
              </div>
            </div>

            <button type="submit" [disabled]="forgotForm.invalid || isLoading()" class="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest">
              {{ isLoading() ? 'Enviando...' : 'Enviar código' }}
            </button>
          </form>
        } @else if (step() === 2) {
          <div class="space-y-6">
            <div class="flex justify-between gap-3">
              @for (i of [0,1,2,3,4,5]; track i) {
                <input 
                  type="text" 
                  maxlength="1" 
                  class="w-full h-14 bg-dark-bg border border-slate-700 rounded-xl text-center text-2xl font-bold text-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none"
                  (keyup)="onCodeInput($event, i)"
                  [id]="'code-' + i"
                >
              }
            </div>

            <p class="text-center text-sm text-slate-500 font-medium">
              ¿No recibiste nada? <button class="text-primary-400 font-bold hover:underline" (click)="step.set(1)">Reenviar código</button>
            </p>

            <button (click)="verifyCode()" class="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest">
              Verificar código
            </button>
          </div>
        } @else {
          <div class="space-y-6">
            <div class="group">
              <label for="new-password" class="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 ml-1">Nueva Contraseña</label>
              <input id="new-password" type="password" class="input-field" placeholder="••••••••">
            </div>
            <div class="group">
              <label for="confirm-password" class="block text-[10px] uppercase tracking-widest font-bold text-slate-500 mb-2 ml-1">Confirmar Contraseña</label>
              <input id="confirm-password" type="password" class="input-field" placeholder="••••••••">
            </div>
            <button (click)="resetPassword()" class="btn-primary w-full py-4 text-sm font-black uppercase tracking-widest">
              Restablecer contraseña
            </button>
          </div>
        }

        <p class="text-center mt-10">
          <a routerLink="/auth/login" class="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-primary-400 flex items-center justify-center gap-2 transition-colors">
            <mat-icon class="scale-75">arrow_back</mat-icon>
            Volver al inicio
          </a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ForgotPassword {
  private fb = inject(FormBuilder);
  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  step = signal(1);
  isLoading = signal(false);

  sendCode() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.step.set(2);
    }, 1500);
  }

  onCodeInput(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    if (target.value.length === 1 && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus();
    }
  }

  verifyCode() {
    this.step.set(3);
  }

  resetPassword() {
    alert('Contraseña restablecida con éxito. Ahora puedes iniciar sesión.');
    this.step.set(1);
  }
}
