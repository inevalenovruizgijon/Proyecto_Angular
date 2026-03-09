import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TcgdexRestService } from '../tcgdex-rest.service';
import { ColeccionService } from '../coleccion.service';

@Component({
  selector: 'app-carta-detalle',
  standalone: false,
  templateUrl: './carta-detalle.component.html',
  styleUrl: './carta-detalle.component.css'
})
export class CartaDetalleComponent implements OnInit {
  carta: any=null;  //objeto con los datos de la carta
  loading=true;     //controla el estado de carga
  error: string | null=null; //mensaje de error si falla la petición
  enColeccion = false;
  constructor(
    private route: ActivatedRoute,       //para leer el parámetro :id de la URL
    private tcgdexRest: TcgdexRestService, //servicio para llamar a la API
    private router:Router,
    private coleccionService: ColeccionService
  ) {}

  ngOnInit() {
    //obtenemos el id de la carta desde la URL (ej: /carta/sv1-1)
    const id = this.route.snapshot.paramMap.get('id')!;

    //llamamos al servicio para obtener los detalles completos de la carta
    this.tcgdexRest.getCartaDetalle(id, 'es').subscribe({
      next:(data)=> {
        this.carta=data;
        this.loading=false;
        console.log(data); 
      },
      error: () => {
        this.error='Error cargando la carta';
        this.loading=false;
      }
    });
  }

  //construye la URL de la imagen, esta vez en alta calidad ya que va a estar más grande
  //si no hay url base, devuelve la imagen por defecto
  getCardImg(urlBase?: string): string {
    if (!urlBase) return 'assets/no-image.jpg';
    return `${urlBase}/high.webp`;
  }

  //si la imagen falla al cargar, sustituye por la imagen por defecto
  onImgError(ev: Event) {
    const img=ev.target as HTMLImageElement;
    img.src='assets/no-image.jpg';
  }
  volver() {
  //volvemos a busqueda manteniendo los queryParams que venían en la URL anterior
  this.router.navigate(['/busqueda'], {
    queryParams: {
      q: history.state?.q || '',
      pagina: history.state?.pagina || 1
    }
  });
}
comprobarColeccion() {
  this.coleccionService.getColeccion().subscribe({
    next:(coleccion)=>{
      this.enColeccion=coleccion.some(c=>c.carta_id==this.carta?.id);
    }
  });
}

toggleColeccion() {
  if(this.enColeccion) {
    this.coleccionService.eliminar(this.carta.id).subscribe({
      next:()=>this.enColeccion=false
    });
  } else {
      this.coleccionService.añadir({
      carta_id:this.carta.id,
      nombre:this.carta.name,
      imagen:this.carta.image,
      precio:this.carta.pricing?.cardmarket?.trend ?? null
    }).subscribe({
      next:()=>this.enColeccion = true
    });
  }
}
}