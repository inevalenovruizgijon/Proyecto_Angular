import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaz para los resultados de búsqueda
export interface CartaResumen {
  id: string;
  localId: string | number;
  name: string;
  image?: string;
  pricing?: any;
}

@Injectable({ providedIn: 'root' })
export class TcgdexRestService {

  // 1. URL de la API Externa (Datos generales)
  private base = 'https://api.tcgdex.net/v2';

  // 2. URL de tu API en Laravel (Tu lógica y base de datos)
  private myLaravelApi = 'https://ruix.iesruizgijon.es/inevalenov/Pokemon_Angular/backend/public/api';

  constructor(private http: HttpClient) {}



  // Busca cartas con filtros y paginación
  buscarPorNombre(nombre: string, lang: 'es' | 'en' = 'es', page = 1,itemsPerPage = 24): Observable<CartaResumen[]> {
    const params = new HttpParams()
      .set('name', nombre)
      .set('pagination:page', String(page))
      .set('pagination:itemsPerPage', '24');

    return this.http.get<CartaResumen[]>(`${this.base}/${lang}/cards`, { params });
  }

  // Obtiene todos los detalles de una carta (ataques, rareza, etc.)
  getCartaDetalle(id: string, lang: 'es' | 'en' = 'es'): Observable<any> {
    return this.http.get<any>(`${this.base}/${lang}/cards/${id}`);
  }

  //Obtiene el Top 10 que Laravel procesa desde la API de Pokémon TCG
  getTopMarket(): Observable<any[]> {
    return this.http.get<any[]>(`${this.myLaravelApi}/top-market`);
  }

  // GET: Trae tu colección personal desde MySQL
  getFavoritos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.myLaravelApi}/coleccion`);
  }

  // POST: Guarda un nuevo Pokémon en tu base de datos
  addFavorito(carta: any): Observable<any> {
    const payload = {
      id: carta.id,
      name: carta.name,
      // Lógica para elegir la mejor imagen disponible
      imagen: carta.images?.large || carta.images?.small || carta.image || null,
      precio_final: carta.pricing?.low || carta.precio_final || 0
    };
    return this.http.post(`${this.myLaravelApi}/coleccion`, payload);
  }

  // DELETE: Elimina de la colección por ID de MySQL
  deleteFavorito(id: number): Observable<any> {
    return this.http.delete(`${this.myLaravelApi}/coleccion/${id}`);
  }
}