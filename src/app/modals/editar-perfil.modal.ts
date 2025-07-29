import { Component, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from 'src/app/config/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.modal.html',
  styleUrls: ['./editar-perfil.modal.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class EditarPerfilModal {
  @Input() usuario: any;

  nombre = '';
  apellido = '';
  numero = '';
  imagen: File | null = null;
  imagenPreview = '';

  constructor(
    private modalCtrl: ModalController,
    private http: HttpClient,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.nombre = this.usuario?.nombre || '';
    this.apellido = this.usuario?.apellido || '';
    this.numero = this.usuario?.numero || '';
    this.imagenPreview = this.usuario?.imagenUrl || '';
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagen = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  async guardarCambios() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido', this.apellido);
    formData.append('numero', this.numero);
    if (this.imagen) {
      formData.append('imagen', this.imagen);
    }

    this.http.put(`${API_URL}/travel/usuarios/perfil`, formData, { headers }).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Perfil actualizado correctamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.modalCtrl.dismiss(true); // Recargar perfil
      },
      error: async err => {
        const toast = await this.toastCtrl.create({
          message: err.error?.msg || 'Error al actualizar perfil',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}
