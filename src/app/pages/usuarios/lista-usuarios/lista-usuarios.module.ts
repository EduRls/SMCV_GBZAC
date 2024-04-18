import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaUsuariosPageRoutingModule } from './lista-usuarios-routing.module';

import { ListaUsuariosPage } from './lista-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaUsuariosPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ListaUsuariosPage]
})
export class ListaUsuariosPageModule {}
