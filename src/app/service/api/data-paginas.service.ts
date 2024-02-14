import { Injectable } from '@angular/core';
import * as Tesseract from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class DataPaginasService {

  constructor(
  ) { }

  async consultarInformacion() {
    const worker = await Tesseract.createWorker();
    
  }
}
