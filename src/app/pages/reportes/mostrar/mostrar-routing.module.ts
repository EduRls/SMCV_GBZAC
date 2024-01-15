import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MostrarPage } from './mostrar.page';

const routes: Routes = [
  {
    path: '',
    component: MostrarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MostrarPageRoutingModule {}
