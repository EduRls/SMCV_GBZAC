import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController
  ) { }

  public resultado:any
  recognition: any;


  ngOnInit() {


  }

  async startRecording(){
    
  }

  async stopRecording(){
    
  }

  async generarModal(){
    const user = [{
      nombre: "Eduardo",
      apellido: {
        apellido_paterno: "Ruelas",
        apellido_materno: "Cortés"
      },
      edad: 21
    }];


  }
}
