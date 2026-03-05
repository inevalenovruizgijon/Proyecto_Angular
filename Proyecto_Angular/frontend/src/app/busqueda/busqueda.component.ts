import { Component } from '@angular/core';
import { CartaResumen, TcgdexRestService } from '../tcgdex-rest.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-busqueda',
  standalone: false,
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent {
  q = '';
  lang: 'es'|'en'= 'es';

  loading=false;
  error: string| null = null;

  pagina=1;
  paginaTamano=24;

  hayMasResultados=true;

  resultados:CartaResumen[]=[]; //array con resultados
  detallesConPrecio:any[]=[]; //array con los detalles de cada carta incluido precios

  constructor(private tcgdexRest: TcgdexRestService) {}

  //la calidad de la imagen la dejamos en baja
  getCardImg(
  urlBase?: string,
  quality: 'low' | 'high'='low',
  ext: 'webp' | 'png' | 'jpg'='webp'
): string {
  if (!urlBase) return 'assets/no-image.jpg'; // si no hay url, imagen por defecto
  return `${urlBase}/${quality}.${ext}`;
}

  buscarNueva(){
    this.pagina=1;
    this.hayMasResultados=true;
    this.buscar();
  }

  paginaSiguiente(){
    //si no hay más resultados, no dejamos avanzar
    if (this.loading || !this.hayMasResultados) return;
    //cada vez que se le de al botón de página siguiente, se le sumará 1 a la página actual y se hara otra petición a la api
    this.pagina++;
    this.buscar();
  }

  paginaAnterior(){ //cada vez que se le de al botón de página anterior, se restara - a la pagina actual y se hara otra petición de busqueda a la api
    if (this.loading) return;

    if (this.pagina > 1){
      this.pagina--;
      this.buscar();
    }
  }

  //metodo que se llamará cuando el usuario pulse el botón de buscar
  buscar(){
  const value = this.q.trim();

  //si la longitud del texto es muy corta,no se enviará nada
  if (value.length < 2){
    this.resultados=[];
    this.detallesConPrecio=[];
    this.error =null;
    this.loading=false;
    this.pagina= 1;

    this.hayMasResultados= true;
    return;
  }

  this.loading =true;
  this.error =null;
  this.detallesConPrecio= [];

  // Pedimos paginaTamano + 1 para saber si hay más resultados sin cargar una página vacía
  this.tcgdexRest.buscarPorNombre(value, this.lang, this.pagina, this.paginaTamano + 1).subscribe({
    next: (res)=>{

      //si nos devuelve más de paginaTamano, hay más páginas
      this.hayMasResultados = res.length > this.paginaTamano;

      //pero solo mostramos paginaTamano cartas
      this.resultados = res.slice(0,this.paginaTamano);

      if (this.resultados.length == 0) {
        this.detallesConPrecio =[];
        this.error ='No hemos encontrado resultados para tu búsqueda.';
        this.loading=false;
        return;
      }

      //hace una llamada al servicio para que aparezca una página con 24 resultados
      forkJoin(this.resultados.map(c => this.tcgdexRest.getCartaDetalle(c.id, this.lang))).subscribe({
        next: (detalles) => {
          //se ordena por el trend, que es el precio, en este caso esta de menor a mayor
          //y después irán los son null
          console.log(detalles);
          this.detallesConPrecio = detalles.sort((a, b) => {
            const pa = a?.pricing?.cardmarket?.trend ?? Number.POSITIVE_INFINITY;
            const pb = b?.pricing?.cardmarket?.trend ?? Number.POSITIVE_INFINITY;
            return pa - pb;
          });

          this.loading = false;
        },
        error:()=>{
          this.error='Error cargando cartas';
          this.loading=false;
        }
      });
    },
    error: ()=>{
      this.error='Error consultando TCGdex';
      this.loading=false;
    }
  });
}

  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = 'assets/no-image.jpg';
  }
}