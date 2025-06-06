import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistrarEntradaSalidaPageRoutingModule } from './registrar-entrada-salida-routing.module';

import { RegistrarEntradaSalidaPage } from './registrar-entrada-salida.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistrarEntradaSalidaPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [RegistrarEntradaSalidaPage]
})
export class RegistrarEntradaSalidaPageModule {}
