import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-certificate-viewer',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="min-h-screen bg-slate-900 pt-20 pb-40 px-6 print:p-0 print:bg-white flex flex-col items-center">
      
      <!-- 🛠️ Actions Bar (Hidden on Print) -->
      <div class="max-w-5xl w-full flex justify-between items-center mb-16 print:hidden">
         <button routerLink="/profile" class="text-white/60 hover:text-white flex items-center gap-2 font-black uppercase text-[10px] tracking-widest transition-all">
            <mat-icon class="scale-75">west</mat-icon> Volver al Perfil
         </button>
         <button (click)="print()" class="px-10 py-5 bg-primary-500 text-white rounded-[24px] font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-2xl shadow-primary-500/20 hover:scale-105 transition-all">
            <mat-icon class="scale-75">print</mat-icon> Imprimir Certificado (PDF)
         </button>
      </div>

      <!-- 🏆 The Certificate -->
      <div id="certificate" class="certificate-canvas bg-white relative overflow-hidden shadow-[0_80px_160px_-40px_rgba(0,0,0,0.5)]">
         <!-- Ornamental Background -->
         <div class="absolute inset-0 border-[40px] border-slate-50 opacity-40"></div>
         <div class="absolute inset-0 border-[2px] border-slate-200 m-8"></div>
         <div class="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
         <div class="absolute bottom-0 left-0 w-96 h-96 bg-primary-500/5 blur-[100px] rounded-full -translate-x-1/2 translate-y-1/2"></div>
         
         <div class="relative z-10 h-full flex flex-col items-center justify-between p-24 lg:p-40 text-center">
            
            <!-- Header -->
            <div class="space-y-8">
               <div class="flex items-center justify-center gap-4">
                  <div class="w-16 h-1 bg-primary-500 rounded-full"></div>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white">
                       <mat-icon class="scale-75">rocket_launch</mat-icon>
                    </div>
                    <span class="text-3xl font-black text-text-title tracking-tighter uppercase italic">NITEX</span>
                  </div>
                  <div class="w-16 h-1 bg-primary-500 rounded-full"></div>
               </div>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">PLATAFORMA EDUCATIVA ELITE</p>
            </div>

            <!-- Content -->
            <div class="space-y-12">
               <h1 class="text-5xl lg:text-7xl font-black text-text-title tracking-tighter uppercase italic leading-none">CERTIFICADO DE <br> <span class="text-primary-500">EXCELENCIA</span></h1>
               
               <div class="space-y-6">
                  <p class="text-xl text-text-muted font-medium italic">Se otorga con distinción el presente título a:</p>
                  <h2 class="text-6xl font-black text-text-title tracking-tighter border-b-4 border-slate-100 pb-4 inline-block px-10">{{ user()?.name }}</h2>
               </div>

               <div class="max-w-2xl mx-auto">
                  <p class="text-xl text-text-muted font-medium italic leading-relaxed">
                     Por haber completado satisfactoriamente el programa de formación técnica de alto nivel en
                     <span class="text-text-title font-black uppercase not-italic">"{{ certificate()?.courseName }}"</span>
                     cumpliendo con todos los estándares académicos y técnicos exigidos por nuestra currícula institucional.
                  </p>
               </div>
            </div>

            <!-- Footer / QR -->
            <div class="w-full flex items-end justify-between pt-20">
               <div class="text-left space-y-4">
                  <div class="w-48 border-b border-slate-300"></div>
                  <div>
                     <p class="text-lg font-black text-text-title uppercase italic leading-none">Director Académico</p>
                     <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Nitex Educational Group</p>
                  </div>
               </div>

               <div class="flex flex-col items-center gap-4">
                  <div class="p-3 bg-white border border-slate-100 rounded-3xl shadow-sm">
                     <img [src]="qrUrl()" class="w-28 h-28 object-contain">
                  </div>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">{{ certificate()?.qrCode }}</p>
               </div>

               <div class="text-right space-y-4">
                  <p class="text-lg font-black text-text-title uppercase italic leading-none">{{ certificate()?.date | date:'longDate' }}</p>
                  <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Fecha de Emisión</p>
               </div>
            </div>

         </div>
      </div>

    </div>
  `,
  styles: [`
    .certificate-canvas {
      width: 100%;
      max-width: 1100px;
      aspect-ratio: 1.414 / 1; /* A4 Landscape */
    }
    @media print {
      .min-h-screen { min-height: 0 !important; padding: 0 !important; }
      .certificate-canvas { 
        width: 100% !important; 
        max-width: none !important;
        box-shadow: none !important;
        border: none !important;
      }
      body { margin: 0; }
    }
  `]
})
export class CertificateViewer implements OnInit {
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  
  user = computed(() => this.auth.currentUser());
  certificate = signal<any>(null);
  qrUrl = computed(() => {
    const code = this.certificate()?.qrCode || 'NITEX-VERIFY';
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://nitex.pro/verify/${code}`;
  });

  ngOnInit() {
    const certId = this.route.snapshot.paramMap.get('id');
    const u = this.user();
    if (u && certId) {
       const cert = u.certificates.find((c: any) => c.id === certId);
       this.certificate.set(cert);
    }
  }

  print() {
    window.print();
  }
}
