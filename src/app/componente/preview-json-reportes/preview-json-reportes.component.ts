import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { prettyPrintJson } from 'pretty-print-json';

@Component({
  selector: 'app-preview-json-reportes',
  templateUrl: './preview-json-reportes.component.html',
  styleUrls: ['./preview-json-reportes.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class PreviewJsonReportesComponent  implements OnInit {

  @Input() informacionReporte: any;

  constructor(
    private modal:ModalController
  ) { }

  ngOnInit() {
    const elem:any = document.getElementById('account');
    elem.innerHTML =  prettyPrintJson.toHtml(this.informacionReporte);
  }

  cerrarModal(){
    this.modal.dismiss();
  }

}
