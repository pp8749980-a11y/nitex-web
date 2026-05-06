import { ChangeDetectionStrategy, Component, inject, signal, computed, HostListener } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatIconModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-bg-main flex flex-col font-sans selection:bg-primary-100 selection:text-primary-700">
      
      <!-- 🌿 SaaS Premium Navbar (Sticky with Blur) -->
      <nav 
        [class.nav-scrolled]="isScrolled()"
        class="fixed top-0 left-0 w-full z-50 h-24 flex items-center px-6 lg:px-12 transition-all duration-500 bg-primary-50/80 backdrop-blur-xl border-b border-primary-100/50"
      >
        <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
          
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group cursor-pointer">
            <div class="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/20 group-hover:rotate-12 transition-transform duration-500">
              <mat-icon class="scale-110">rocket_launch</mat-icon>
            </div>
            <span class="text-2xl font-black text-text-title tracking-tighter uppercase italic">Nitex</span>
          </a>

          <!-- Nav Links (Center Pill) -->
          <div class="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-md p-2 rounded-full border border-slate-100 shadow-sm">
            <a routerLink="/" routerLinkActive="nav-link-active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
              Inicio
            </a>
            <a routerLink="/courses" routerLinkActive="nav-link-active" class="nav-link">
              Cursos
            </a>
            <a routerLink="/about" routerLinkActive="nav-link-active" class="nav-link">
              Nosotros
            </a>
          </div>

          <!-- User Profile / Auth (Right) -->
          <div class="flex items-center gap-6">
            @if (user()) {
              <!-- 👤 Profile Dropdown Cluster -->
              <div class="relative">
                <button 
                  (click)="isMenuOpen.set(!isMenuOpen())"
                  class="flex items-center gap-4 p-2 pr-5 bg-white/80 backdrop-blur-sm rounded-full border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                >
                  <div class="relative shrink-0">
                    <div class="w-11 h-11 rounded-full p-1 bg-gradient-to-tr from-primary-400 to-primary-100 overflow-hidden shadow-sm">
                      <img [src]="user()?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user()?.name" class="w-full h-full object-cover rounded-full bg-white">
                    </div>
                    <!-- Activo Indicator -->
                    <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>
                  <div class="text-left hidden lg:block mr-2">
                    <p class="text-[10px] font-black uppercase tracking-widest text-primary-500 leading-none mb-1">Activo</p>
                    <p class="text-sm font-bold text-text-title leading-none truncate max-w-[120px]">{{ user()?.name }}</p>
                  </div>
                  <mat-icon class="text-slate-400 group-hover:text-primary-500 transition-colors">expand_more</mat-icon>
                </button>

                <!-- 📂 Dropdown Menu -->
                @if (isMenuOpen()) {
                  <div class="absolute right-0 mt-4 w-72 bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden z-[60] animate-fade-up">
                    <div class="p-8 bg-slate-50/50 border-b border-slate-100 text-center">
                      <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Mi Cuenta</p>
                      <p class="text-sm font-black text-text-title truncate">{{ user()?.email }}</p>
                    </div>
                    <div class="p-4 space-y-1">
                      <a (click)="closeMenu()" routerLink="/profile" class="dropdown-item">
                        <mat-icon>person_outline</mat-icon> Mi Perfil
                      </a>
                      <div class="h-px bg-slate-50 my-2 mx-4"></div>
                      <button (click)="logout()" class="dropdown-item w-full text-rose-500 hover:bg-rose-50 hover:text-rose-600">
                        <mat-icon>logout</mat-icon> Cerrar sesión
                      </button>
                    </div>
                  </div>
                  <!-- Overlay for clicking outside -->
                  <div (click)="closeMenu()" class="fixed inset-0 z-50"></div>
                }
              </div>
            } @else {
              <div class="flex items-center gap-3">
                <a routerLink="/auth/login" class="nav-link px-6 py-3 bg-white/80 backdrop-blur-sm border border-white shadow-sm hover:border-primary-200">
                  Iniciar sesión
                </a>
                <a routerLink="/auth/register" class="btn-primary py-3 px-8 text-xs font-black shadow-lg shadow-primary-500/20">
                  Registrar
                </a>
              </div>
            }
          </div>
        </div>
      </nav>

      <!-- 🚀 Main Viewport -->
      <main class="flex-grow pt-24 overflow-x-hidden">
        <router-outlet></router-outlet>
      </main>

      <!-- 🦶 Footer Premium -->
      @if (showFooter()) {
        <footer class="bg-white border-t border-slate-100 pt-24 pb-12 px-6 lg:px-12 mt-auto">
          <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
              <div class="space-y-8">
                 <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                    <mat-icon>rocket_launch</mat-icon>
                  </div>
                  <span class="text-2xl font-black text-text-title tracking-tighter uppercase italic leading-none">Nitex</span>
                </div>
                <p class="text-sm text-text-muted leading-relaxed font-medium italic">
                  Transformando la educación digital con experiencias premium y contenido de élite.
                </p>
              </div>

              <div>
                <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Ecosistema</h4>
                <ul class="space-y-4">
                  <li><a routerLink="/courses" class="text-sm font-bold text-text-body hover:text-primary-500 transition-colors">Catálogo</a></li>
                  <li><a routerLink="/about" class="text-sm font-bold text-text-body hover:text-primary-500 transition-colors">Nosotros</a></li>
                  <li><a routerLink="/admin" class="text-sm font-bold text-text-body hover:text-primary-500 transition-colors">Admin</a></li>
                </ul>
              </div>

              <div>
                <h4 class="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">Legal</h4>
                <ul class="space-y-4">
                  <li><a href="#" class="text-sm font-bold text-text-body hover:text-primary-500 transition-colors">Privacidad</a></li>
                  <li><a href="#" class="text-sm font-bold text-text-body hover:text-primary-500 transition-colors">Términos</a></li>
                </ul>
              </div>

              <div class="bg-primary-50/50 p-8 rounded-[48px] border border-primary-100 relative overflow-hidden">
                 <h4 class="text-lg font-black text-primary-700 mb-4 tracking-tight italic uppercase">News Élite</h4>
                 <div class="flex gap-2">
                   <input type="text" placeholder="Tu Email" class="w-full bg-white border-0 rounded-2xl px-5 py-4 text-xs outline-none">
                   <button class="w-12 h-12 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-lg"><mat-icon class="scale-75">send</mat-icon></button>
                 </div>
              </div>
            </div>
            <div class="pt-12 border-t border-slate-50 flex justify-between items-center">
              <p class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">© 2026 NITEX. ALL RIGHTS RESERVED.</p>
            </div>
          </div>
        </footer>
      }

    </div>
  `,
  styles: [`
    :host { display: block; }
    .nav-scrolled {
      box-shadow: 0 20px 40px -15px rgba(6, 182, 212, 0.15);
      background-color: rgba(255, 255, 255, 0.95);
      border-color: transparent;
    }
    .nav-link { 
      font-size: 13px;
      font-weight: 800;
      color: #64748b;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      padding: 0.75rem 1.5rem;
      border-radius: 9999px; /* full rounded */
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-link:hover { color: var(--color-primary-500); background-color: var(--color-primary-50); }
    .nav-link-active { color: var(--color-primary-600); background-color: var(--color-primary-50); }
    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.5rem;
      font-size: 0.75rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      transition: all 0.3s ease;
      cursor: pointer;
      border-radius: 1rem;
      margin: 0 0.5rem;
    }
    .dropdown-item:hover {
      background-color: var(--color-primary-50);
      color: var(--color-primary-500);
    }
    .dropdown-item mat-icon { 
      transform: scale(0.75);
    }
  `]
})
export class App {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = computed(() => this.authService.currentUser());
  isMenuOpen = signal(false);
  isScrolled = signal(false);
  
  showFooter = computed(() => {
    const url = this.router.url;
    return !url.includes('/auth/') && !url.includes('/admin');
  });

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  closeMenu() { this.isMenuOpen.set(false); }

  logout() {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/auth/login']);
  }
}