import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ColeccionComponent } from './coleccion/coleccion.component';
import { CartaDetalleComponent } from './carta-detalle/carta-detalle.component';
import { FavoritosComponent } from './favoritos/favoritos.component';

@NgModule({
  declarations: [
    AppComponent,
    BusquedaComponent,
    ColeccionComponent,
    CartaDetalleComponent,
    FavoritosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,      
    HttpClientModule,
    BaseChartDirective
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  bootstrap: [AppComponent]
})
export class AppModule { }
