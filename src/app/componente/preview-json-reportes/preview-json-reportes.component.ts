import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import JSONFormatter from 'json-formatter-js'

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
    const formatter = new JSONFormatter(this.informacionReporte);

    const elem:any = document.getElementById('account');
    elem.appendChild(formatter.render());

    formatter.openAtDepth(10);

    elem.style.fontSize = '16px';
  }

  cerrarModal(){
    this.modal.dismiss();
  }

}
