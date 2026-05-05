import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private _currentUser = signal<User | null>(null);
  
  currentUser = computed(() => this._currentUser());
  isAuthenticated = computed(() => !!this._currentUser());
  isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor() {
    this.loadSession();
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

  login(email: string, password: string): boolean {
    // Simulating login logic
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    const user = users.find(u => u.email === email);
    
    // Static admin bypass for demo/convenience if needed, but we follow rules
    if (email === 'admin@nitex.com' && password === 'Admin123!') {
      const admin: User = {
        id: 'admin_1',
        email: 'admin@nitex.com',
        name: 'Administrador Nitex',
        role: 'admin',
        enrolledCourses: [],
        completedLessons: [],
        examResults: {},
        certificates: [],
        createdAt: Date.now()
      };
      this.setSession(admin);
      return true;
    }

    if (user && password === 'Nitex123!') { // Simple simulation password
      this.setSession(user);
      return true;
    }
    return false;
  }

  register(name: string, email: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('nitex_users_db') || '[]');
    if (users.find(u => u.email === email)) return false;

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
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
    
    // Sync with DB
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
