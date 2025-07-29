import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ToastController, NavController, AlertController, ModalController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_URL } from 'src/app/config/api';
import { EditarPerfilModal } from '../modals/editar-perfil.modal';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,]
})
export class Tab3Page implements OnInit {
  usuario: any = null;
  token = localStorage.getItem('token');
  isLoggedIn = false;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!this.token;

    if (this.isLoggedIn) {
      this.obtenerPerfil();
    }
  }

  private getAuthHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders().set('Authorization', `Bearer ${this.token}`)
    };
  }

  obtenerPerfil() {
    this.http.get(`${API_URL}/music/usuarios/perfil`, this.getAuthHeaders()).subscribe({
      next: (res: any) => {
        this.usuario = res.usuario || res;
      },
      error: err => {
        console.error(err);
        this.presentToast('Error al obtener perfil');
      }
    });
  }

  goToLogin() {
    this.navCtrl.navigateRoot('/login');
  }

  async cerrarSesion() {
    localStorage.removeItem('token');
    this.presentToast('Sesión cerrada');
    this.navCtrl.navigateRoot('/login');
  }

  cambiarFotoPerfil() {
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';

    imageInput.onchange = () => {
      const file = imageInput.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('imagen', file);

      this.http.put(`${API_URL}/actualizar-imagen`, formData, this.getAuthHeaders())
        .subscribe({
          next: (res: any) => {
            this.presentToast(res.msg || 'Imagen actualizada');
            this.obtenerPerfil(); // refresca el perfil
          },
          error: err => {
            console.error(err);
            this.presentToast('Error al actualizar imagen');
          }
        });
    };

    imageInput.click();
  }

  async abrirModalEditar() {
    const modal = await this.modalCtrl.create({
      component: EditarPerfilModal,
      componentProps: {
        usuario: this.usuario
      }
    });

    modal.onDidDismiss().then((result: any) => {
      if (result.data) {
        this.obtenerPerfil(); // recarga el perfil después de editar
      }
    });

    await modal.present();
  }

  async abrirModalPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar contraseña',
      inputs: [
        {
          name: 'nuevopassword',
          type: 'password',
          placeholder: 'Nueva contraseña'
        },
        {
          name: 'confirmarpassword',
          type: 'password',
          placeholder: 'Confirmar contraseña'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cambiar',
          handler: data => this.cambiarPassword(data)
        }
      ]
    });

    await alert.present();
  }

  cambiarPassword(data: any) {
    const { nuevopassword, confirmarpassword } = data;

    if (!nuevopassword || !confirmarpassword) {
      this.presentToast('Completa ambos campos');
      return false;
    }

    if (nuevopassword.length < 6) {
      this.presentToast('La contraseña debe tener al menos 6 caracteres');
      return false;
    }

    if (nuevopassword !== confirmarpassword) {
      this.presentToast('Las contraseñas no coinciden');
      return false;
    }

    const body = {
      id: this.usuario?._id,
      nuevopassword,
      confirmarpassword
    };

    this.http.put(`${API_URL}/actualizar-password`, body, this.getAuthHeaders()).subscribe({
      next: () => {
        this.presentToast('Contraseña actualizada correctamente');
      },
      error: err => {
        console.error(err);
        this.presentToast('Error al actualizar contraseña');
      }
    });

    return true;
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom'
    });
    await toast.present();
  }
}
