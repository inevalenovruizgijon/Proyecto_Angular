import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColeccionService {
  //url base de la api de laravel
  private apiUrl='http://127.0.0.1:8000/api/coleccion';

  constructor(private http: HttpClient) {}

  //obtener todas las cartas de la colección
  getColeccion():Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  //añadir una carta a la colección
  añadir(carta: any): Observable<any> {
    return this.http.post(this.apiUrl, carta);
  }

  //eliminar una carta de la colección
  eliminar(cartaId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${cartaId}`);
  }
}
