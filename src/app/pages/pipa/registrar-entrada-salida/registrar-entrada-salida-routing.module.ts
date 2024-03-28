import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarEntradaSalidaPage } from './registrar-entrada-salida.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarEntradaSalidaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarEntradaSalidaPageRoutingModule {}
