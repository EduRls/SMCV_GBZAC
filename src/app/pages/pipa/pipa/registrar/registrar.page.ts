import { Component, OnInit } from '@angular/core';
//import * as Tesseract from 'tesseract.js';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  constructor(
  ) { }

  ngOnInit() {
  }
  async onFileSelected(event: any) {
    /*
    const image = event.target.files[0];
    
    // Crear un objeto FileReader para leer la imagen como un objeto de tipo 'blob'
    const reader = new FileReader();
    
    reader.onload = async (e: any) => {
      // Crear una nueva imagen
      const img = new Image();
      img.src = e.target.result;
  
      // Esperar a que la imagen se cargue completamente
      img.onload = async () => {
        // Crear un elemento canvas para manipular la imagen
        const canvas = document.createElement('canvas');
        const ctx:any = canvas.getContext('2d');
        
        // Asignar el tamaño del canvas al tamaño de la imagen
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Dibujar la imagen en el canvas
        ctx.drawImage(img, 0, 0);
        
        // Convertir la imagen a escala de grises
        this.convertToGrayscale(ctx, canvas);
        
        // Aplicar ajuste de contraste
        this.applyContrast(ctx, canvas, 10); // Puedes ajustar el valor del contraste según sea necesario
        
        // Convertir el canvas a una imagen codificada en base64
        const processedImage = canvas.toDataURL('image/jpeg');
        
        // Reconocer el texto en la imagen procesada usando Tesseract
        const ret = await Tesseract.recognize(processedImage, 'spa+eng', {
          
        });
        console.log(ret.data.text);
      };
    };
    
    // Leer la imagen como un objeto de tipo 'blob'
    reader.readAsDataURL(image);
    */
  }
  
  convertToGrayscale(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    // Obtener los datos de píxeles de la imagen
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
  
    // Convertir la imagen a escala de grises
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg;
      data[i + 1] = avg;
      data[i + 2] = avg;
    }
  
    // Colocar los datos de píxeles de la imagen en el canvas
    ctx.putImageData(imageData, 0, 0);
  }
  
  applyContrast(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, contrast: number) {
    // Obtener los datos de píxeles de la imagen
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  
    // Aplicar ajuste de contraste a cada píxel de la imagen
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      data[i] = factor * (r - 128) + 128;
      data[i + 1] = factor * (g - 128) + 128;
      data[i + 2] = factor * (b - 128) + 128;
    }
  
    // Colocar los datos de píxeles de la imagen en el canvas
    ctx.putImageData(imageData, 0, 0);
  }
}