import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ColeccionComponent } from './coleccion/coleccion.component';
import { StatsComponent } from './stats/stats.component';
import { CartaDetalleComponent } from './carta-detalle/carta-detalle.component';

@NgModule({
  declarations: [
    AppComponent,
    BusquedaComponent,
    ColeccionComponent,
    StatsComponent,
    CartaDetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,      
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
