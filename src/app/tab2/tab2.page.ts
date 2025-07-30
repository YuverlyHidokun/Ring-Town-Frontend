import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  ToastController,
  AlertController,
  LoadingController,
  IonIcon,       // <--- Agregar
  IonButtons,
  IonImg 
} from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/config/api';
import { HttpClientModule,} from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton,  IonIcon, IonButtons, HttpClientModule, CommonModule, IonImg  ]
})
export class Tab2Page {
  playlists: any[] = [];
  backendUrl = `${API_URL}/music/playlists`;

  constructor(
    private http: HttpClient,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.cargarPlaylists();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  }

  cargarPlaylists() {
    this.http.get(this.backendUrl, this.getAuthHeaders()).subscribe({
      next: (res: any) => {
        this.playlists = res.playlists || res;
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Error al cargar playlists',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  async abrirModalCrearPlaylist() {
    const alert = await this.alertCtrl.create({
      header: 'Crear nueva playlist',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre de la playlist' },
        { name: 'descripcion', type: 'text', placeholder: 'Descripción' }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Crear',
          handler: (data) => {
            if (!data.nombre || data.nombre.trim().length === 0) {
              return false;
            }
            this.crearPlaylist(data.nombre, data.descripcion);
            return true;
          }
        }
      ]
    });
    await alert.present();
  }

  async crearPlaylist(nombre: string, descripcion: string) {
    const loading = await this.loadingCtrl.create({ message: 'Creando playlist...' });
    await loading.present();

    this.http.post(this.backendUrl, { nombre, descripcion }, this.getAuthHeaders()).subscribe({
      next: async (res: any) => {
        await loading.dismiss();
        this.cargarPlaylists();

        const toast = await this.toastCtrl.create({
          message: res.msg || 'Playlist creada',
          duration: 3000,
          color: 'success'
        });
        await toast.present();
      },
      error: async (err) => {
        await loading.dismiss();
        const toast = await this.toastCtrl.create({
          message: err.error?.msg || 'Error al crear playlist',
          duration: 3000,
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  async eliminarPlaylist(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar eliminación',
      message: '¿Seguro que quieres eliminar esta playlist?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingCtrl.create({ message: 'Eliminando...' });
            await loading.present();

            this.http.delete(`${this.backendUrl}/${id}`, this.getAuthHeaders()).subscribe({
              next: async () => {
                await loading.dismiss();
                this.cargarPlaylists();

                const toast = await this.toastCtrl.create({
                  message: 'Playlist eliminada',
                  duration: 3000,
                  color: 'success'
                });
                await toast.present();
              },
              error: async () => {
                await loading.dismiss();
                const toast = await this.toastCtrl.create({
                  message: 'Error al eliminar playlist',
                  duration: 3000,
                  color: 'danger'
                });
                await toast.present();
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  verPlaylist(playlist: any) {
    this.router.navigate(['/playlist', playlist._id]);
  }

    reproducirCancion(cancion: any) {
    this.router.navigate(['/reproductor'], {
      queryParams: {
        audioUrl: cancion.audioUrl,
        titulo: cancion.titulo,
        artista: cancion.artista,
        portadaUrl: cancion.portadaUrl,
        cancionId: cancion._id
      }
    });
  }
}
