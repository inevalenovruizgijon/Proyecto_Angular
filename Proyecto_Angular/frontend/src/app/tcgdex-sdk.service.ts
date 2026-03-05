import { Injectable, Query } from '@angular/core';
import TCGdex from '@tcgdex/sdk';

@Injectable({
  providedIn: 'root'
})
@Injectable({ providedIn: 'root' })
export class TcgdexSdkService {
   private tcgdex = new TCGdex('es');

  // Card por ID
  getCardById(id: string) {
    return this.tcgdex.fetch('cards', id); 
  }

  // Set por nombre o id
  getSet(idOrName: string) {
    return this.tcgdex.fetch('sets', idOrName); 
  }

  // Serie por nombre o id
  getSerie(idOrName: string) {
    return this.tcgdex.fetch('series', idOrName); 
  }

  //Filtro por atributo
  listHps() {
    return this.tcgdex.fetch('hp'); 
  }

  }




