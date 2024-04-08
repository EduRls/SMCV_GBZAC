import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'equipo_tecnico/registrar',
    loadChildren: () => import('./pages/equipo_tecnico/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'equipo_tecnico/mostrar',
    loadChildren: () => import('./pages/equipo_tecnico/mostrar/mostrar.module').then( m => m.MostrarPageModule)
  },
  {
    path: 'panel_control/mostrar',
    loadChildren: () => import('./pages/panel_control/mostrar/mostrar.module').then( m => m.MostrarPageModule)
  },
  {
    path: 'reporte/registrar',
    loadChildren: () => import('./pages/reportes/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'reporte/mostrar',
    loadChildren: () => import('./pages/reportes/mostrar/mostrar.module').then( m => m.MostrarPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'pipa/registrar',
    loadChildren: () => import('./pages/pipa/pipa/registrar/registrar.module').then( m => m.RegistrarPageModule)
  },
  {
    path: 'pipa/mostrar',
    loadChildren: () => import('./pages/pipa/pipa/mostrar/mostrar.module').then( m => m.MostrarPageModule)
  },
  {
    path: 'pipa/registrar-entrada-salida',
    loadChildren: () => import('./pages/pipa/registrar-entrada-salida/registrar-entrada-salida.module').then( m => m.RegistrarEntradaSalidaPageModule)
  },  {
    path: 'registro',
    loadChildren: () => import('./pages/almacen/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'mostrar',
    loadChildren: () => import('./pages/almacen/mostrar/mostrar.module').then( m => m.MostrarPageModule)
  }






];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
