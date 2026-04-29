import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//Interfaz que define la estructura de cada carta del Top 10
export interface TopCard {
  id: string;           //ID único de la carta en la API de Pokémon TCG
  name: string;         //Nombre de la carta
  precio_final: number; //Precio de mercado calculado por Laravel
  image: string;        //URL de la imagen de la carta
  cardmarket: string | null; //URL a Cardmarket (puede no existir)
}

//@Injectable permite que Angular inyecte este servicio en cualquier componente
@Injectable({
  providedIn: 'root'
})
export class ColeccionService {

  // URL base de tu API Laravel para los favoritos guardados en MySQL
  private apiUrl = 'http://127.0.0.1:8000/api/coleccion';

  // URL del endpoint de Laravel que consulta la API externa y devuelve el Top 10
  private marketUrl = 'http://127.0.0.1:8000/api/top-market'; 

  constructor(private http: HttpClient) {}

  //GET: Obtiene todas las cartas guardadas como favoritos en la base de datos
  getColeccion(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // POST: Guarda una carta en favoritos
  //Recibe el objeto carta con los campos que espera Laravel (carta_id, nombre, imagen, precio)
  añadir(carta: any): Observable<any> {
    return this.http.post(this.apiUrl, carta);
  }

  //DELETE: Elimina una carta de favoritos por su carta_id
  eliminar(cartaId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${cartaId}`);
  }

  //GET: Obtiene el Top 10 de cartas más caras del mercado
  //filtra, ordena por precio y devuelve solo las 10 más caras
  getTopMarket(): Observable<TopCard[]> {
    return this.http.get<TopCard[]>(this.marketUrl);
  }
}