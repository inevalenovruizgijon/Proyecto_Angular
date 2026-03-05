import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartaResumen {
  id: string;
  localId: string | number;
  name: string;
  image?: string; 
}

@Injectable({ providedIn: 'root' })
export class TcgdexRestService {
  private base = 'https://api.tcgdex.net/v2';

  constructor(private http: HttpClient) {}

  buscarPorNombre(
    nombre: string,
    lang: 'es' | 'en' = 'en',
    page = 1,
    itemsPerPage = 24
  ): Observable<CartaResumen[]> {
    const params = new HttpParams()
      .set('name', nombre)
      .set('pagination:page', String(page))
      .set('pagination:itemsPerPage', String(itemsPerPage));

    return this.http.get<CartaResumen[]>(`${this.base}/${lang}/cards`, { params });
  }

  getCartaDetalle(id: string, lang: 'es' | 'en' = 'en'): Observable<any> {
    return this.http.get<any>(`${this.base}/${lang}/cards/${id}`);
  }
}
