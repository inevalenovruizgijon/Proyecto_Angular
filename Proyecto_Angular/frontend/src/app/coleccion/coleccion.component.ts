import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TcgdexRestService } from '../tcgdex-rest.service';
// Importaciones de Chart.js para tipar la configuración del gráfico
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-coleccion',
  standalone: false,
  templateUrl: './coleccion.component.html',
  styleUrl: './coleccion.component.css' 
})
export class ColeccionComponent implements OnInit {

  //Array con las 10 cartas más caras que devuelve Laravel
  topCartas: any[] = [];

  // Controla si se está cargando (para mostrar el spinner)
  loading = true;

  //Mensaje de error si la petición falla
  error: string | null = null;

  //CONFIGURACIÓN DEL GRÁFICO DE BARRAS
  

  // Opciones generales del gráfico
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,        // Se adapta al ancho del contenedor
    maintainAspectRatio: false, // Permite controlar la altura manualmente con CSS
    plugins: {
      legend: { display: true, position: 'top' } // Leyenda arriba del gráfico
    }
  };

  //Tipo de gráfico: barras verticales
  public barChartType: ChartType = 'bar';

  //Datos del gráfico: se rellenan dinámicamente en ngOnInit
  public barChartData: ChartConfiguration['data'] = {
    labels: [],   //Eje X: nombres de las cartas (se rellena con la respuesta de Laravel)
    datasets: [{ 
      data: [],                    // Eje Y: precio de cada carta
      label: 'Precio Market Trend (€)', 
      backgroundColor: '#ffcb05', // Amarillo Pokémon para las barras
      borderColor: '#3b4cca',     // Azul Pokémon para el borde
      borderWidth: 2 
    }]
  };

  constructor(
    private router: Router,              //Para navegar al detalle de una carta
    private tcgdexRest: TcgdexRestService 
  ) {}

  ngOnInit() {
    //Al cargar el componente pedimos el Top 10 a nuestro backend Laravel
    //Laravel consulta la API de Pokémon TCG, procesa los datos y los devuelve ordenados
    this.tcgdexRest.getTopMarket().subscribe({
      next: (data) => {
        //Guardamos las cartas para renderizar las tarjetas en el HTML
        this.topCartas = data;
        
        //Rellenamos el eje X del gráfico con los nombres de las cartas
        this.barChartData.labels = data.map(c => c.name);

        //Rellenamos el eje Y con el precio de cada carta
        this.barChartData.datasets[0].data = data.map(c => c.precio_final || 0);
        
        // Sin esto, el gráfico no se redibujaría al llegar los datos
        this.barChartData = { ...this.barChartData };

        this.loading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el Top 10 del mercado';
        this.loading = false;
      }
    });
  }

  // Navega a la página de detalle de la carta seleccionada
  verDetalle(id: string) {
    this.router.navigate(['/carta', id]);
  }

  // Construye la URL de la imagen en calidad baja (suficiente para las tarjetas del Top 10)
  // Devuelve una imagen por defecto si no hay URL base
  getCardImg(urlBase?: string): string {
    if (!urlBase) return 'assets/no-image.jpg';
    return `${urlBase}/low.webp`;
  }
}