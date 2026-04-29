import { Component, OnInit } from '@angular/core';
import { CartaResumen, TcgdexRestService } from '../tcgdex-rest.service';
import { forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  standalone: false,
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent implements OnInit {

  q = '';
  lang: 'es' | 'en' = 'es';
  loading = false;
  error: string | null = null;
  pagina = 1;
  paginaTamano = 24;
  hayMasResultados = true;
  resultados: CartaResumen[] = [];
  detallesConPrecio: any[] = [];

  constructor(
    private tcgdexRest: TcgdexRestService, // Único servicio necesario
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.q = params['q'];
        this.pagina = +params['pagina'] || 1;
        this.buscar();
      }
    });
  }

  anadirAFavoritos(carta: any) {
    const urlBase = carta.image 
      ?? carta.images?.small 
      ?? carta.images?.standard 
      ?? null;

    const datosParaLaravel = {
      id: carta.id,
      name: carta.name,
      imagen: urlBase ? this.getCardImg(urlBase, 'low', 'webp') : null,
      precio_final: carta.pricing?.cardmarket?.trend ?? 0
    };

    console.log("Enviando a favoritos:", datosParaLaravel);

    // CORRECCIÓN: Ahora usamos tcgdexRest, que es el servicio unificado
    this.tcgdexRest.addFavorito(datosParaLaravel).subscribe({
      next: () => alert(`¡${carta.name} añadida a favoritos!`),
      error: (err) => {
        console.error("Error de Laravel:", err);
        alert('Error al guardar en la base de datos');
      }
    });
  }

  getCardImg(urlBase?: string, quality: 'low' | 'high' = 'low', ext: 'webp' | 'png' | 'jpg' = 'webp'): string {
    if (!urlBase) return 'assets/no-image.jpg';
    return `${urlBase}/${quality}.${ext}`;
  }

  buscarNueva() {
    this.pagina = 1;
    this.hayMasResultados = true;
    this.buscar();
  }

  paginaSiguiente() {
    if (this.loading || !this.hayMasResultados) return;
    this.pagina++;
    this.buscar();
  }

  paginaAnterior() {
    if (this.loading) return;
    if (this.pagina > 1) {
      this.pagina--;
      this.buscar();
    }
  }

  buscar() {
    const value = this.q.trim();
    if (value.length < 2) {
      this.resultados = [];
      this.detallesConPrecio = [];
      this.loading = false;
      return;
    }

    this.loading = true;
    this.error = null;
    this.detallesConPrecio = [];

    this.tcgdexRest.buscarPorNombre(value, this.lang, this.pagina, this.paginaTamano + 1).subscribe({
      next: (res) => {
        this.hayMasResultados = res.length > this.paginaTamano;
        this.resultados = res.slice(0, this.paginaTamano);

        if (this.resultados.length === 0) {
          this.error = 'No se encontraron resultados.';
          this.loading = false;
          return;
        }

        // Aquí usamos forkJoin para pedir los detalles de las 24 cartas a la vez
        forkJoin(this.resultados.map(c => this.tcgdexRest.getCartaDetalle(c.id, this.lang))).subscribe({
          next: (detalles) => {
            // Ordenación de precios: menor a mayor
            this.detallesConPrecio = detalles.sort((a, b) => {
              const pa = a?.pricing?.cardmarket?.trend ?? Number.POSITIVE_INFINITY;
              const pb = b?.pricing?.cardmarket?.trend ?? Number.POSITIVE_INFINITY;
              return pa - pb;
            });
            this.loading = false;
          },
          error: () => {
            this.error = 'Error cargando detalles';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Error en el servidor TCGdex';
        this.loading = false;
      }
    });

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q: this.q, pagina: this.pagina },
      queryParamsHandling: 'merge'
    });
  }

  onImgError(ev: Event) {
    (ev.target as HTMLImageElement).src = 'assets/no-image.jpg';
  }

  verDetalle(id: string) {
    this.router.navigate(['/carta', id], {
      state: { q: this.q, pagina: this.pagina }
    });
  }
}