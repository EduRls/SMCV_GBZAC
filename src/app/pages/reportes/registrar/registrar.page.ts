import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  constructor(
    private platform: Platform
  ) { }

  public resultado:any
  recognition: any;


  ngOnInit() {
    
  }

  async startRecording(){
    
  }

  async stopRecording(){
    
  }
}
