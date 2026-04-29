import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { ColeccionComponent } from './coleccion/coleccion.component';
import { CartaDetalleComponent } from './carta-detalle/carta-detalle.component';
import { FavoritosComponent } from './favoritos/favoritos.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'busqueda' },
  { path: 'busqueda', component: BusquedaComponent, title: 'Búsqueda' },
  { path: 'coleccion', component: ColeccionComponent, title: 'Mi colección' },
  { path: 'carta/:id', component: CartaDetalleComponent, title: 'Detalle carta' },
  { path: 'favoritos', component: FavoritosComponent },
  { path: '**', redirectTo: 'busqueda' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }