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

  // Solo datos (nombre, apellido, numero)
  async guardarCambios() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const body = {
      nombre: this.nombre,
      apellido: this.apellido,
      numero: this.numero
    };

    this.http.put(`${API_URL}/music/usuarios/actualizar-perfil`, body, { headers }).subscribe({
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

  // Solo imagen
  async actualizarImagen() {
    if (!this.imagen) {
      const toast = await this.toastCtrl.create({
        message: 'Selecciona una imagen primero',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    const formData = new FormData();
    formData.append('imagen', this.imagen);

    this.http.put(`${API_URL}/music/usuarios/actualizar-imagen`, formData, { headers }).subscribe({
      next: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Imagen actualizada correctamente',
          duration: 2000,
          color: 'success'
        });
        toast.present();
        this.modalCtrl.dismiss(true); // Recargar perfil
      },
      error: async err => {
        const toast = await this.toastCtrl.create({
          message: err.error?.msg || 'Error al actualizar imagen',
          duration: 2000,
          color: 'danger'
        });
        toast.present();
      }
    });
  }
}