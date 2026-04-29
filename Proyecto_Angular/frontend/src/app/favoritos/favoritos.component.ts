import { Component, OnInit } from '@angular/core';
import { TcgdexRestService } from '../tcgdex-rest.service';

@Component({
  selector: 'app-favoritos',
  standalone: false,
  templateUrl: './favoritos.component.html',
  styleUrls: ['./favoritos.component.css']
})
export class FavoritosComponent implements OnInit {

  //Array que almacena las cartas favoritas obtenidas de la base de datos Laravel
  misFavoritos: any[] = [];

  constructor(
    private service: TcgdexRestService //Servicio que gestiona las llamadas a Laravel
  ) { }

  //Se ejecuta automáticamente al cargar el componente
  ngOnInit(): void {
    this.cargarFavoritos();
  }

  //Obtiene todos los favoritos guardados en MySQL a través de Laravel
  cargarFavoritos(): void {
    this.service.getFavoritos().subscribe({
      next: (res) => {
        this.misFavoritos = res;// Guardamos la respuesta para renderizarla en el HTML
      },
      error: (err) => console.error('Error al traer favoritos de Laravel', err)
    });
  }

  //Elimina una carta de favoritos por su ID de fila en la tabla MySQL
  eliminar(id: number): void {

    //Pedimos confirmación al usuario antes de borrar
    if (confirm('¿Quieres eliminar esta carta de tu base de datos?')) {
      this.service.deleteFavorito(id).subscribe(() => {

        this.misFavoritos = this.misFavoritos.filter(c => c.id !== id);
      });
    }
  }
}