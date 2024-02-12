import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

declare const SpeechRecognition: any;

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
    this.SpeechToText()
  }

  SpeechToText() {
    this.platform.ready().then(() => {
        this.recognition = new SpeechRecognition(); 
        this.recognition.lang = 'en-US';
        this.recognition.onnomatch = ((event:any) => {
            console.log('No match found.');
        });
        this.recognition.onerror = ((event:any) => {
            console.log('Error happens.');
        });
        this.recognition.onresult = ((event:any) => {
            if (event.results.length > 0) {
                console.log('Output STT: ', event.results[0][0].transcript);            
            }
        });     
        this.recognition.start();
    });
}

  async startRecording(){
    
  }

  async stopRecording(){
    
  }
}
