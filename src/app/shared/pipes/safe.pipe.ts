import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safe',
  standalone: true
})
export class SafePipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(url: string | null | undefined, type: string): SafeResourceUrl {
    if (!url) return '';
    switch (type) {
      case 'resource':
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      default:
        throw new Error(`Invalid safe type specified: ${type}`);
    }
  }
}
