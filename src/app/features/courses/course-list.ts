import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CourseService } from '../../core/services/course.service';
import { MatIconModule } from '@angular/material/icon';
import { debounceTime, startWith } from 'rxjs';

import { HeroCarousel } from '../../shared/components/hero-carousel';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, MatIconModule, HeroCarousel],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-[#fafafa] min-h-screen text-text-body select-none">
      
      <!-- Premium Course Header -->
      <header class="bg-white border-b border-slate-100 pt-32 pb-20 px-6 sm:px-12">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
            <div class="max-w-2xl space-y-6">
              <nav class="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary-500">
                <a routerLink="/" class="hover:text-text-title transition-colors">Inicio</a>
                <mat-icon class="scale-50">chevron_right</mat-icon>
                <span class="text-text-title">Catálogo</span>
              </nav>
              <h1 class="text-4xl lg:text-7xl font-black tracking-tighter text-text-title leading-tight uppercase">
                Carreras y <br> <span class="text-primary-500 italic">cursos expertos</span>
              </h1>
              <p class="text-xl text-text-muted font-medium max-w-lg leading-relaxed">
                Domina las habilidades más demandadas con nuestra oferta académica de élite.
              </p>
            </div>
            
            <div class="relative group w-full lg:w-96">
               <mat-icon class="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-500 transition-colors scale-90">search</mat-icon>
               <input 
                 [formControl]="searchControl"
                 type="text" 
                 placeholder="¿Qué quieres aprender?" 
                 class="w-full bg-slate-50 border border-slate-100 rounded-2xl py-5 pl-16 pr-8 text-[11px] font-black uppercase tracking-widest text-text-title outline-none focus:bg-white focus:shadow-2xl focus:shadow-primary-500/5 transition-all"
               >
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-6 sm:px-12 py-20 flex flex-col lg:flex-row gap-16">
        
        <!-- Sidebar Filters -->
        <aside class="w-full lg:w-72 shrink-0 space-y-12">
          <div>
            <h4 class="text-[11px] font-black uppercase tracking-[0.3em] text-text-title mb-8 border-b border-slate-100 pb-4">Filtrar por Categoría</h4>
            <div class="space-y-4">
              @for (cat of categories; track cat) {
                <button 
                  (click)="selectedCategory.set(cat)"
                  class="w-full flex items-center justify-between group py-1"
                >
                  <span 
                    class="text-xs font-bold uppercase tracking-widest transition-all"
                    [class]="selectedCategory() === cat ? 'text-primary-500 translate-x-2' : 'text-text-muted hover:text-text-title hover:translate-x-1'"
                  >{{ cat }}</span>
                  @if (selectedCategory() === cat) {
                    <div class="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-lg shadow-primary-500/50"></div>
                  }
                </button>
              }
            </div>
          </div>

          <div>
            <h4 class="text-[11px] font-black uppercase tracking-[0.3em] text-text-title mb-8 border-b border-slate-100 pb-4">Nivel del Curso</h4>
            <div class="space-y-6">
              @for (level of ['Todos', 'Básico', 'Intermedio', 'Avanzado']; track level) {
                <label class="flex items-center gap-4 cursor-pointer group">
                  <div class="w-5 h-5 rounded-md border-2 border-slate-200 flex items-center justify-center group-hover:border-primary-500 transition-colors">
                    <div class="w-2 h-2 rounded-sm bg-primary-500 opacity-0 transition-opacity" [class.opacity-100]="selectedLevel() === level"></div>
                  </div>
                  <input type="radio" [name]="'level'" [value]="level" (change)="selectedLevel.set(level)" class="hidden">
                  <span class="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-title">{{ level }}</span>
                </label>
              }
            </div>
          </div>

          <div class="p-8 bg-primary-50 rounded-[40px] space-y-6 border border-primary-100">
             <mat-icon class="text-primary-500 scale-125">workspace_premium</mat-icon>
             <h4 class="text-sm font-black text-text-title uppercase tracking-widest leading-relaxed">¿Buscas una certificación para tu empresa?</h4>
             <p class="text-[10px] font-bold text-primary-600/60 uppercase tracking-widest leading-loose">Obtén descuentos corporativos y planes personalizados para equipos.</p>
             <button class="w-full py-4 bg-white text-primary-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all shadow-primary-500/5">Contactar ventas</button>
          </div>
        </aside>

        <!-- Main Course Grid -->
        <main class="flex-grow">
          @if (filteredCourses().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
              @for (course of filteredCourses(); track course.id) {
                <div 
                  class="group bg-white rounded-[40px] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-700 flex flex-col relative p-4"
                  [routerLink]="['/courses', course.id]"
                >
                  <div class="aspect-[16/10] relative overflow-hidden rounded-[32px] shadow-inner bg-slate-50">
                    <img [src]="course.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" [alt]="course.title">
                    <div class="absolute top-6 left-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[9px] font-black text-primary-500 uppercase tracking-[0.2em] shadow-sm border border-white/50">
                      {{ course.category }}
                    </div>
                    @if (course.featured) {
                      <div class="absolute top-6 right-6 w-10 h-10 bg-amber-400 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
                         <mat-icon class="scale-75">star</mat-icon>
                      </div>
                    }
                  </div>
                  
                  <div class="p-8 pt-4 flex-grow flex flex-col">
                    <div class="flex items-center gap-6 mb-6">
                      <div class="flex items-center gap-2 text-amber-400">
                        <mat-icon class="scale-75">star_rate</mat-icon>
                        <span class="text-[11px] font-black tracking-widest text-text-title">{{ course.rating }}</span>
                      </div>
                      <div class="h-1 w-1 bg-slate-100 rounded-full"></div>
                      <span class="text-[9px] font-black text-primary-500 uppercase tracking-widest">{{ course.level }}</span>
                      <div class="h-1 w-1 bg-slate-100 rounded-full"></div>
                      <span class="text-[9px] font-black text-text-muted uppercase tracking-widest">{{ course.duration }}</span>
                    </div>
                    
                    <h3 class="text-2xl font-black mb-6 group-hover:text-primary-500 transition-colors leading-tight text-text-title tracking-tighter">{{ course.title }}</h3>
                    
                    <div class="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                       <div class="flex flex-col">
                          <span class="text-[9px] font-black text-slate-300 uppercase tracking-widest line-through mb-1">$99.99 USD</span>
                          <span class="text-xl font-black text-text-title uppercase tracking-tighter">$49.99 <span class="text-[10px] text-primary-500">USD</span></span>
                       </div>
                       <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-primary-500 group-hover:text-white transition-all transform group-hover:translate-x-1 duration-500">
                          <mat-icon class="scale-75">arrow_forward_ios</mat-icon>
                       </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <!-- Empty State remains similar but updated style -->
            <div class="text-center py-40 bg-white rounded-[70px] border border-slate-100 shadow-xl relative overflow-hidden">
              <div class="w-24 h-24 bg-slate-50 text-slate-200 rounded-[35px] flex items-center justify-center mx-auto mb-10">
                <mat-icon class="scale-[2]">search_off</mat-icon>
              </div>
              <h3 class="text-3xl font-black text-text-title mb-4 tracking-tighter uppercase">No se encontraron cursos</h3>
              <p class="text-sm text-text-muted font-medium mb-12 max-w-xs mx-auto italic">No hay resultados para los filtros seleccionados. Intenta resetear.</p>
              <button (click)="resetFilters()" class="btn-primary !px-12">Ver todos</button>
            </div>
          }
        </main>
      </div>
    </div>
  `,
})
export class CourseList {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  
  searchControl = new FormControl('');
  selectedCategory = signal('Todos');
  selectedLevel = signal('Todos');
  categories = ['Todos', 'Administración', 'Belleza', 'Finanzas', 'Salud', 'Tecnología', 'Idiomas'];

  private courses = this.courseService.getAllCourses();
  private searchTerm = signal('');

  constructor() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      startWith('')
    ).subscribe(val => this.searchTerm.set(val || ''));

    // Handle query params from navbar
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory.set(params['category']);
      }
      if (params['q']) {
        this.searchControl.setValue(params['q']);
      }
    });
  }

  filteredCourses = computed(() => {
    return this.courses().filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(this.searchTerm().toLowerCase()) || 
                          c.shortDescription.toLowerCase().includes(this.searchTerm().toLowerCase());
      const matchesCat = this.selectedCategory() === 'Todos' || c.category === this.selectedCategory();
      const matchesLevel = this.selectedLevel() === 'Todos' || c.level === this.selectedLevel();
      return matchesSearch && matchesCat && matchesLevel;
    });
  });

  resetFilters() {
    this.searchControl.setValue('');
    this.selectedCategory.set('Todos');
    this.selectedLevel.set('Todos');
  }
}
