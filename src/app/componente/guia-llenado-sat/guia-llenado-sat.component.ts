import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-guia-llenado-sat',
  templateUrl: './guia-llenado-sat.component.html',
  styleUrls: ['./guia-llenado-sat.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class GuiaLlenadoSatComponent  implements OnInit {

  constructor(
    private modalController:ModalController
  ) { }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss();
  }

}
