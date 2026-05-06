import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private _currentUser = signal<User | null>(null);
  
  // Security state
  private failedAttempts = signal(0);
  private lockoutTime = signal<number | null>(null);
  private readonly MAX_ATTEMPTS = 3;
  private readonly LOCKOUT_DURATION = 60 * 1000; // 1 minute

  // Recovery state (simulated)
  private recoveryCode = signal<string | null>(null);
  private recoveryEmail = signal<string | null>(null);
  private recoveryExpiry = signal<number | null>(null);

  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => !!this._currentUser());
  isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor() {
    this.loadSession();
    this.loadSecurityState();
  }

  private loadSession() {
    const savedUser = localStorage.getItem('nitex_user');
    if (savedUser) {
      try {
        this._currentUser.set(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('nitex_user');
      }
    }
  }

  private loadSecurityState() {
    const attempts = localStorage.getItem('nitex_failed_attempts');
    const lockout = localStorage.getItem('nitex_lockout_until');
    
    if (attempts) this.failedAttempts.set(parseInt(attempts));
    if (lockout) {
      const until = parseInt(lockout);
      if (until > Date.now()) {
        this.lockoutTime.set(until);
      } else {
        this.resetSecurityState();
      }
    }
  }

  private resetSecurityState() {
    this.failedAttempts.set(0);
    this.lockoutTime.set(null);
    localStorage.removeItem('nitex_failed_attempts');
    localStorage.removeItem('nitex_lockout_until');
  }

  getLockoutRemaining(): number {
    if (!this.lockoutTime()) return 0;
    const remaining = Math.max(0, this.lockoutTime()! - Date.now());
    if (remaining === 0) this.resetSecurityState();
    return Math.ceil(remaining / 1000);
  }

  login(email: string, password: string): { success: boolean, message?: string, showRecovery?: boolean } {
    const remainingSeconds = this.getLockoutRemaining();
    if (remainingSeconds > 0) {
      const minutes = Math.ceil(remainingSeconds / 60);
      return { 
        success: false, 
        message: `Has excedido los intentos. Debes esperar ${minutes} minutos antes de intentar nuevamente.`,
        showRecovery: true 
      };
    }

    // Demo bypass for admin
    if (email === 'admin@demo.com' && password === '123456') {
      const admin: User = {
        id: 'admin_1',
        email: 'admin@demo.com',
        name: 'Administrador Nitex',
        role: 'admin',
        enrolledCourses: [],
        completedLessons: [],
        examResults: {},
        certificates: [],
        createdAt: Date.now()
      };
      this.resetSecurityState();
      this.setSession(admin);
      return { success: true };
    }

    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    const user = users.find(u => u.email === email);
    
    // In a real app we'd verify hash.
    if (user && user.password === password) {
      this.resetSecurityState();
      this.setSession(user);
      return { success: true };
    }

    // Fail logic
    const newAttempts = this.failedAttempts() + 1;
    this.failedAttempts.set(newAttempts);
    localStorage.setItem('nitex_failed_attempts', newAttempts.toString());

    if (newAttempts >= this.MAX_ATTEMPTS) {
      const until = Date.now() + this.LOCKOUT_DURATION;
      this.lockoutTime.set(until);
      localStorage.setItem('nitex_lockout_until', until.toString());
      return { 
        success: false, 
        message: 'Has excedido los intentos. Debes esperar 1 minutos antes de intentar nuevamente.',
        showRecovery: true
      };
    }

    return { success: false, message: `Credenciales inválidas. Intentos restantes: ${this.MAX_ATTEMPTS - newAttempts}` };
  }

  // Recovery Methods
  sendRecoveryCode(email: string): { success: boolean, message: string } {
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    if (!users.find(u => u.email === email)) {
      return { success: false, message: 'El correo electrónico no existe.' };
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.recoveryCode.set(code);
    this.recoveryEmail.set(email);
    this.recoveryExpiry.set(Date.now() + 10 * 60 * 1000); // 10 minutes

    console.log(`[RECOVERY] Código enviado a ${email}: ${code}`);
    return { success: true, message: 'Se ha enviado un código a tu correo' };
  }

  verifyRecoveryCode(code: string): boolean {
    if (this.recoveryCode() === code && Date.now() < (this.recoveryExpiry() || 0)) {
      return true;
    }
    return false;
  }

  resetPassword(newPassword: string): boolean {
    if (!this.recoveryEmail()) return false;
    
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    const idx = users.findIndex(u => u.email === this.recoveryEmail());
    if (idx !== -1) {
      // In real app we'd hash and store. For demo we just reset the security state
      this.resetSecurityState();
      this.recoveryCode.set(null);
      this.recoveryEmail.set(null);
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    if (users.find(u => u.email === email)) return false;

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      password,
      role: 'student',
      enrolledCourses: [],
      completedLessons: [],
      examResults: {},
      certificates: [],
      createdAt: Date.now()
    };

    users.push(newUser);
    localStorage.setItem('nitex_users_db', JSON.stringify(users));
    this.setSession(newUser);
    return true;
  }

  updateUser(updatedUser: User) {
    this._currentUser.set(updatedUser);
    localStorage.setItem('nitex_user', JSON.stringify(updatedUser));
    
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      localStorage.setItem('nitex_users_db', JSON.stringify(users));
    }
  }

  logout() {
    this._currentUser.set(null);
    localStorage.removeItem('nitex_user');
    this.router.navigate(['/auth/login']);
  }

  private setSession(user: User) {
    this._currentUser.set(user);
    localStorage.setItem('nitex_user', JSON.stringify(user));
  }
}
