import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { LaravelService } from 'src/app/service/api/laravel.service';
import { StorageService } from 'src/app/service/storage/storage.service';
import { GuiaLlenadoSatComponent } from 'src/app/componente/guia-llenado-sat/guia-llenado-sat.component';
import { DataPaginasService } from 'src/app/service/api/data-paginas.service';
@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.page.html',
  styleUrls: ['./registrar.page.scss'],
})
export class RegistrarPage implements OnInit {

  // Elementos del formulario
  public modalidadPermisoInputHabil:boolean = false; 
  public NumPermisoHabil:boolean = false; 
  public NumContratoOAsignacionHabil:boolean = false; 


  // Formulario
  formInformacionGeneral: FormGroup;

  private token: any;
  private infromacionGeneral: any;

  //Mostrar la guia de llenado
  mostrarGuia:boolean = false;

  constructor(
    private toastController: ToastController,
    private api: LaravelService,
    private storage: StorageService,
    private formBuilder: FormBuilder,
    private loadController:LoadingController,
    private modalCtrl: ModalController,
    private datapage:DataPaginasService
  ) {
    this.formInformacionGeneral = this.formBuilder.group({
      id_planta: [''],
      rfc_contribuyente: ['', Validators.required],
      rfc_representante_legal: [''],
      rfc_proveedor: [''],
      rfc_proveedores: [''],
      tipo_caracter: [''],
      modalidad_permiso: [''],
      numero_permiso: [''],
      numero_contrato_asignacion: [''],
      instalacion_almacen_gas: [''],
      clave_instalacion: [''],
      descripcion_instalacion: [''],
      geolocalizacion_latitud: [''],
      geolocalizacion_longitud: [''],
      numero_pozos: [''],
      numero_tanques: [''],
      numero_ductos_entrada_salida: [''],
      numero_ductos_transporte: [''],
      numero_dispensarios: ['']
    });
  }

  async ngOnInit() {
    await this.getInformacion();
  }

  async getInformacion() {
    try {
      this.token = await this.storage.getUserData();
      this.formInformacionGeneral.get('id_planta')?.setValue(this.token.user.id_planta);
      (await this.api.getInformacionGeneralReporte(this.token.token, this.token.user.id_planta)).subscribe((data: any) => {
        if (data && data.length > 0) {
          this.generarFormularioReporte(data[0]);
          this.infromacionGeneral = data;
        }
      });
      this.datapage.consultarInformacion().then((res) => {
        const camposRequeridos =  res.required;
        const camposCondicionlaes = res.allOf;
        const camposPropiedades = res.properties;
      })
    } catch (error) {
      console.error('Error al obtener la información:', error);
    }
  }

  generarFormularioReporte(data: any) {
    const keysInformacionGeneral = Object.keys(data);
    for (let i = 1; i <= 19; i++) {
      if (keysInformacionGeneral[i] == 'rfc_proveedores') {
        const claveNombre = keysInformacionGeneral[i];
        const valor = data[claveNombre];
        this.formInformacionGeneral.get(claveNombre)?.setValue(valor != null ? (JSON.parse(valor)).toString() : '');
      } else {
        const claveNombre = keysInformacionGeneral[i];
        const valor = data[claveNombre];
        this.formInformacionGeneral.get(claveNombre)?.setValue(valor != null ? valor : '');
      }
    }
  }


  caracterSeleccionado(event:any){
    
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

  async onSubmit(seccion:any) {
    const load = await this.loadController.create({
      message: "Guardando información..."
    });

    await load.present();
    if(this.infromacionGeneral != undefined && this.infromacionGeneral.length != 0){
      (await this.api.editInformacionGeneralReporte(this.infromacionGeneral[0].id, this.formInformacionGeneral.value, this.token.token)).subscribe({
        next:(val)=>{
          this.presentToast('bottom', 'Informaicón guardada correctamente', 'success');
          this.getInformacion();
        }, error:(err) => {
          console.log("🚀 ~ RegistrarPage ~ err:", err)
          this.presentToast('bottom', 'Algo salió mal, vuelva a intentarlo', 'danger');
        }
      });
      await load.dismiss();
    }else{
      (await this.api.createInformacionGeneralReporte(this.formInformacionGeneral.value, this.token.token)).subscribe({
        next:(val)=>{
          this.presentToast('bottom', 'Informaicón guardada correctamente', 'success');
          this.getInformacion();
        }, error:(err) => {
          console.log("🚀 ~ RegistrarPage ~ err:", err)
          this.presentToast('bottom', 'Algo salió mal, vuelva a intentarlo', 'danger');
        }
      });
      await load.dismiss();
    }
  }

  cleanForm(){
    this.formInformacionGeneral.get('rfc_contribuyente').setValue(null);
    this.formInformacionGeneral.get('rfc_representante_legal').setValue(null);
    this.formInformacionGeneral.get('rfc_proveedor').setValue(null);
    this.formInformacionGeneral.get('rfc_proveedores').setValue(null);
    this.formInformacionGeneral.get('tipo_caracter').setValue(null);
    this.formInformacionGeneral.get('modalidad_permiso').setValue(null);
    this.formInformacionGeneral.get('numero_permiso').setValue(null);
    this.formInformacionGeneral.get('numero_contrato_asignacion').setValue(null);
    this.formInformacionGeneral.get('instalacion_almacen_gas').setValue(null);
    this.formInformacionGeneral.get('clave_instalacion').setValue(null);
    this.formInformacionGeneral.get('descripcion_instalacion').setValue(null);
    this.formInformacionGeneral.get('geolocalizacion_latitud').setValue(null);
    this.formInformacionGeneral.get('geolocalizacion_longitud').setValue(null);
    this.formInformacionGeneral.get('numero_pozos').setValue(null);
    this.formInformacionGeneral.get('numero_tanques').setValue(null);
    this.formInformacionGeneral.get('numero_ductos_entrada_salida').setValue(null);
    this.formInformacionGeneral.get('numero_ductos_transporte').setValue(null);
    this.formInformacionGeneral.get('numero_dispensarios').setValue(null);
  }

  async consultarGuia(){
    const modalSat = await this.modalCtrl.create({
      component: GuiaLlenadoSatComponent,
      cssClass: 'modalPc'
    });

    await modalSat.present();
  }
}
