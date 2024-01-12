import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadComponent } from './preload/preload.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { RouterModule } from '@angular/router';

const componentesAdminLTE = [
  PreloadComponent,
  MainHeaderComponent,
  MainSidebarComponent
]

@NgModule({
  declarations: [componentesAdminLTE],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [componentesAdminLTE]
})
export class AdminlteModule { }
