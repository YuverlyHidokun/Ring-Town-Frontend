import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCard,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail,
  IonImg,
  IonSpinner,
  IonBackButton,
  IonButtons,
  IonCardHeader,
  IonButton,   // <-- AGREGA ESTO
  IonIcon  
} from '@ionic/angular/standalone';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

const API_URL = 'https://ring-town-backend.onrender.com';

@Component({
  selector: 'app-playlist-detalle',
  templateUrl: './playlist-detalle.page.html',
  styleUrls: ['./playlist-detalle.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonCard,
    IonCardTitle,
    IonCardSubtitle,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonImg,
    IonSpinner,
    IonBackButton,
    IonButtons,
    IonCardHeader,
    IonButton,   // <-- AGREGA ESTO
    IonIcon  
  ]
})
export class PlaylistDetallePage implements OnInit {

  playlist: any = null;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    const token = localStorage.getItem('token') || '';

    if (id) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      this.http.get(`${API_URL}/music/playlists/${id}`, { headers }).subscribe({
        next: (data) => {
          this.playlist = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar playlist:', err);
          this.cargando = false;
        }
      });
    }
  }
    reproducirCancion(cancion: any, index: number) {
      this.router.navigate(['/reproductor'], {
        queryParams: {
          audioUrl: cancion.audioUrl,
          titulo: cancion.titulo,
          artista: cancion.artista,
          portadaUrl: cancion.portadaUrl,
          cancionId: cancion._id,
          playlistCanciones: JSON.stringify(this.playlist.canciones.map((c: any) => ({
            audioUrl: c.audioUrl,
            titulo: c.titulo,
            artista: c.artista,
            portadaUrl: c.portadaUrl,
            cancionId: c._id
          }))),
          currentIndex: index
        }
      });
    }
}

