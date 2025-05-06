import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';

@Component({
  selector: 'app-agregar-evento-almacen',
  templateUrl: './agregar-evento-almacen.component.html',
  styleUrls: ['./agregar-evento-almacen.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AgregarEventoAlmacenComponent implements OnInit {
  formularioEvento: FormGroup;

  private token: any;
  public listaTanques: any;

  public eventosAlmacen: any[] = [];
  public existencias: any[] = [];


  constructor(
    private modalController: ModalController,
    private apiLaravel: LaravelService,
    private storage: StorageService,
    private fb: FormBuilder,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.getInformacion()
    const ahora = new Date().toISOString();
    this.formularioEvento = this.fb.group({
      tipo_evento: ['', Validators.required],
      id_almacen: ['', Validators.required],
      volumen_inicial: [0, [Validators.required, Validators.min(0)]],
      volumen_movido: [0, [Validators.required, Validators.min(0)]],
      volumen_final: [0, [Validators.required, Validators.min(0)]],
      fecha_inicio_evento: [ahora, Validators.required],
      fecha_fin_evento: [ahora, Validators.required],
      temperatura: [null],
      presion_absoluta: [null],
      observaciones: ['']
    });
  }

  onChangeTanque() {
    const idTanque = this.formularioEvento.get('id_almacen')?.value;
  
    // Buscar eventos por tanque
    const eventos = this.eventosAlmacen
      .filter((e: any) => e.id_almacen == idTanque)
      .sort((a: any, b: any) => new Date(b.fecha_fin_evento).getTime() - new Date(a.fecha_fin_evento).getTime());
  
    if (eventos.length > 0) {
      const ultimoEvento = eventos[0];
      this.formularioEvento.get('volumen_inicial')?.setValue(ultimoEvento.volumen_final);
      this.formularioEvento.get('volumen_final')?.setValue(ultimoEvento.volumen_final);
    } else {
      // Buscar existencia inicial
      const existencia = this.existencias.find((e: any) => e.id_almacen == idTanque);
      if (existencia) {
        this.formularioEvento.get('volumen_inicial')?.setValue(existencia.volumen_existencia);
        this.formularioEvento.get('volumen_final')?.setValue(existencia.volumen_existencia);
      }
    }
  
    this.calcularVolumenFinal();
  }
  

  async getInformacion() {
    this.token = this.storage.getUserData();

    (await this.apiLaravel.getAlmacen(this.token.token, this.token.user.id_planta)).subscribe((res: any) => {
      this.listaTanques = res;
    });

    (await this.apiLaravel.getEventosAlmacen(this.token.token, this.token.user.id_planta)).subscribe((res: any) => {
      this.eventosAlmacen = res;
    });

    (await this.apiLaravel.getExistenciaAlmacen(this.token.token, this.token.user.id_planta)).subscribe((res: any) => {
      this.existencias = res;
    });
  }

  async cerrarModal() {
    this.modalController.dismiss();
  }

  async guardarEvento() {
    if (this.formularioEvento.valid) {
      (await this.apiLaravel.createEventosAlmacen(this.formularioEvento.value, this.token.token)).subscribe({
        next: () => {
          this.presentToast('bottom', 'Se agregado un registro!', 'success')
          this.formularioEvento.reset();
          setTimeout(() => {
            window.location.reload();
          }, 1500);
          this.modalController.dismiss();
        }, error: (err) => {
          console.log("🚀 ~ MostrarPage ~ err:", err)
          this.presentToast('bottom', 'Algo ha salido mal', 'danger')
        },
      })
    } else {
      // Aquí puedes manejar el caso en que el formulario no sea válido
      console.log("El formulario no es válido");
    }
  }

  calcularVolumenFinal() {
    const tipo = this.formularioEvento.get('tipo_evento')?.value;
    const inicial = Number(this.formularioEvento.get('volumen_inicial')?.value || 0);
    const movido = Number(this.formularioEvento.get('volumen_movido')?.value || 0);

    let final = inicial;

    if (tipo === 'entrada') {
      final = inicial + movido;
    } else if (tipo === 'salida') {
      final = inicial - movido;
    }

    this.formularioEvento.get('volumen_final')?.setValue(final);
  }


  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, color: "success" | "danger" | "warning") {
    const toast = await this.toastController.create({
      message: msg,
      duration: 1500,
      position: position,
      color: color
    });

    await toast.present();
  }
}
