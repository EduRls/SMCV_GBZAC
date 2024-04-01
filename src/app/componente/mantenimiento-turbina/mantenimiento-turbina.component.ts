import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mantenimiento-turbina',
  templateUrl: './mantenimiento-turbina.component.html',
  styleUrls: ['./mantenimiento-turbina.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, FormsModule]
})
export class MantenimientoTurbinaComponent  implements OnInit {

  @Input() mantenimiento: any; // Recibe el registro a editar como entrada

  constructor(
    private modal:ModalController
  ) { }

  ngOnInit() {
    console.log(this.mantenimiento);
  }

  cerrarModal(){
    this.modal.dismiss();
  }

}
