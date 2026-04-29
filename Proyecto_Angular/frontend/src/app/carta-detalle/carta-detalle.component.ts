import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TcgdexRestService } from '../tcgdex-rest.service';
import { ColeccionService } from '../coleccion.service';
// Importaciones de Chart.js para tipar correctamente la configuración del gráfico
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-carta-detalle',
  standalone: false,
  templateUrl: './carta-detalle.component.html',
  styleUrl: './carta-detalle.component.css'
})
export class CartaDetalleComponent implements OnInit {

  //Datos completos de la carta que llegan de la API
  carta: any = null;

  //Controla si se está cargando la carta (para mostrar spinner)
  loading = true;

  //Mensaje de error si la petición falla
  error: string | null = null;

  // Indica si la carta ya está guardada en la colección del usuario
  enColeccion = false;


  //Opciones generales del gráfico (ejes, leyenda, responsividad)
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true, // Se adapta al tamaño del contenedor
    scales: {
      y: { 
        beginAtZero: true, //El eje Y empieza en 0
        title: { display: true, text: 'Puntos de Daño' } 
      }
    },
    plugins: {
      legend: { display: true } //Muestra la leyenda del gráfico
    }
  };

  //Tipo de gráfico: barras verticales
  public barChartType: ChartType = 'bar';

  //Datos del gráfico: labels = nombres de ataques, data = daño de cada ataque
  //Se rellenan dinámicamente en ngOnInit cuando llega la carta
  public barChartData: ChartConfiguration['data'] = {
    labels: [],   // Eje X: nombres de los ataques
    datasets: [
      { 
        data: [],                        // Eje Y: daño de cada ataque
        label: 'Daño de Ataque', 
        backgroundColor: '#f54242',      // Color de las barras
        borderColor: '#b32d2d',          // Borde de las barras
        borderWidth: 1 
      }
    ]
  };

  constructor(
    private route: ActivatedRoute,        //Para leer el :id de la URL
    private tcgdexRest: TcgdexRestService, //Para pedir los datos de la carta
    private router: Router,               //Para navegar (botón volver)
    private coleccionService: ColeccionService //Para gestionar favoritos en Laravel
  ) {}

  ngOnInit() {
    //Leemos el parámetro :id de la URL (ej: /carta/sv04-001)
    const id = this.route.snapshot.paramMap.get('id')!;

    //Pedimos el detalle completo de la carta a la API de TCGdex
    this.tcgdexRest.getCartaDetalle(id, 'es').subscribe({
      next: (data) => {
        this.carta = data;
        this.loading = false;

        //Si la carta tiene ataques, rellenamos el gráfico de barras
        if (this.carta && this.carta.attacks) {

          // Eje X: nombres de los ataques (ej: ['Placaje', 'Llamarada'])
          this.barChartData.labels = this.carta.attacks.map((a: any) => a.name);
          
          //Eje Y: daño numérico de cada ataque
          // Si no hay daño (ej: ataques de efecto), devuelve 0
          this.barChartData.datasets[0].data = this.carta.attacks.map((a: any) => {
            const damage = parseInt(a.damage);
            return isNaN(damage) ? 0 : damage;
          });

          this.barChartData = { ...this.barChartData };
        }

        // Comprobamos si esta carta ya está en la colección del usuario
        this.comprobarColeccion();
        console.log(data);
      },
      error: () => {
        this.error = 'Error cargando la carta';
        this.loading = false;
      }
    });
  }

  // Construye la URL de la imagen en alta calidad
  getCardImg(urlBase?: string): string {
    if (!urlBase) return 'assets/no-image.jpg';
    return `${urlBase}/high.webp`; //Usamos 'high' para la vista de detalle
  }

  //Si la imagen no carga (URL rota), la reemplaza por una imagen por defecto
  onImgError(ev: Event) {
    const img = ev.target as HTMLImageElement;
    img.src = 'assets/no-image.jpg';
  }

  volver() {
    this.router.navigate(['/busqueda'], {
      queryParams: {
        q: history.state?.q || '',
        pagina: history.state?.pagina || 1
      }
    });
  }

  // Consulta la colección guardada en Laravel y comprueba si esta carta ya está
  comprobarColeccion() {
    this.coleccionService.getColeccion().subscribe({
      next: (coleccion) => {
        this.enColeccion = coleccion.some(c => c.carta_id == this.carta?.id);
      }
    });
  }

  // Alterna entre añadir y eliminar la carta de la colección
  toggleColeccion() {
    if (this.enColeccion) {
      // Si ya está en colección → la eliminamos
      this.coleccionService.eliminar(this.carta.id).subscribe({
        next: () => this.enColeccion = false // Actualizamos el estado local
      });
    } else {
      this.coleccionService.añadir({
        carta_id: this.carta.id,
        nombre: this.carta.name,
        imagen: this.carta.image,
        precio: this.carta.pricing?.cardmarket?.trend ?? null // null si no tiene precio
      }).subscribe({
        next: () => this.enColeccion = true // Actualizamos el estado local
      });
    }
  }
}