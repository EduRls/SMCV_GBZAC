import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MostrarPageRoutingModule } from './mostrar-routing.module';

import { MostrarPage } from './mostrar.page';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MostrarPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [MostrarPage]
})
export class MostrarPageModule {}
