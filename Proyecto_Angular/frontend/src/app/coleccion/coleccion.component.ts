import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ColeccionService } from '../coleccion.service';

@Component({
  selector: 'app-coleccion',
  standalone: false,
  templateUrl: './coleccion.component.html',
  styleUrl: './coleccion.component.css'
})
export class ColeccionComponent {
coleccion: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private router: Router,
    private coleccionService: ColeccionService
  ) {}

  ngOnInit() {
    //cargamos la colección desde la API de Laravel
    this.coleccionService.getColeccion().subscribe({
      next: (data) => {
        this.coleccion = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error cargando la colección';
        this.loading = false;
      }
    });
  }

  getCardImg(urlBase?: string): string {
    if (!urlBase) return 'assets/no-image.jpg';
    return `${urlBase}/low.webp`;
  }

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = 'assets/no-image.jpg';
  }

  verDetalle(id: string) {
    this.router.navigate(['/carta', id]);
  }

  eliminar(cartaId: string) {
    //eliminamos la carta de la colección llamando a la API
    this.coleccionService.eliminar(cartaId).subscribe({
      next: () => {
        this.coleccion = this.coleccion.filter(c => c.carta_id !== cartaId);
      },
      error: () => {
        this.error = 'Error eliminando la carta';
      }
    });
  }
}
