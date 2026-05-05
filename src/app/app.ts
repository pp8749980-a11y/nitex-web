import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MatIconModule],
  template: `
    <div class="min-h-screen flex flex-col bg-[#fafafa] text-slate-800">

      <!-- 🔥 NAVBAR PRO -->
      <nav class="w-full border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">

          <!-- LEFT -->
          <div class="flex items-center gap-8">

            <a routerLink="/" class="flex items-center gap-3 group">
              <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
                <span class="font-bold text-lg">N</span>
              </div>
              <span class="text-xl font-extrabold tracking-tight group-hover:text-blue-600 transition">
                NITEX
              </span>
            </a>

            <div class="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
              <a routerLink="/" routerLinkActive="text-blue-600" class="hover:text-blue-600 transition">Inicio</a>
              <a routerLink="/courses" routerLinkActive="text-blue-600" class="hover:text-blue-600 transition">Cursos</a>
              <a routerLink="/about" class="hover:text-blue-600 transition">Nosotros</a>
              <a routerLink="/contact" class="hover:text-blue-600 transition">Contacto</a>
            </div>

          </div>

          <!-- RIGHT -->
          <div class="flex items-center gap-3 sm:gap-5">

            <!-- SEARCH -->
            <div class="hidden md:block relative">
              <input
                #searchInput
                (keyup.enter)="onSearch(searchInput.value)"
                type="text"
                placeholder="Buscar cursos..."
                class="w-44 lg:w-64 bg-gray-100 rounded-full pl-4 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
            </div>

            <!-- AUTH -->
            @if (auth.isAuthenticated()) {
              <button 
                (click)="auth.logout()" 
                class="text-sm text-red-500 hover:text-red-600 font-medium transition"
              >
                Salir
              </button>
            } @else {
              <div class="flex items-center gap-2 sm:gap-3">
                <a 
                  routerLink="/auth/login" 
                  class="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
                >
                  Acceder
                </a>

                <a 
                  routerLink="/auth/register" 
                  class="bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm"
                >
                  Registrarse
                </a>
              </div>
            }

            <!-- MOBILE -->
            <button class="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">
              <mat-icon>menu</mat-icon>
            </button>

          </div>

        </div>
      </nav>

      <!-- CONTENIDO -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <!-- 🔥 FOOTER MEJORADO -->
      <footer class="bg-[#050A1F] text-white py-12 mt-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 text-center space-y-4">
          <h3 class="text-lg font-bold tracking-wide">NITEX Academy</h3>
          <p class="text-sm text-gray-400 max-w-md mx-auto">
            Aprende habilidades reales, mejora tu futuro y domina las tecnologías del mañana.
          </p>
          <p class="text-xs text-gray-500 mt-4">
            © 2026 Nitex. Todos los derechos reservados.
          </p>
        </div>
      </footer>

    </div>
  `
})
export class App {
  auth = inject(AuthService);
  router = inject(Router);

  onSearch(term: string) {
    if (!term.trim()) return;
    this.router.navigate(['/courses'], { queryParams: { q: term } });
  }
}