import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonProgressBar, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Howl, Howler } from 'howler';
import { PlaylistsService } from 'src/app/services/playlists.service'; // Ajusta ruta si es necesario
import { IonItem, IonLabel } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-reproductor-musica',
  standalone: true,
  imports: [CommonModule, IonButton, IonIcon, IonProgressBar, IonSelect, IonSelectOption, IonItem, IonLabel, FormsModule, HttpClientModule],
  templateUrl: './reproductor-musica.component.html',
  styleUrls: ['./reproductor-musica.component.scss']
})
export class ReproductorMusicaComponent implements OnInit, OnDestroy {
  @Input() audioUrl!: string;
  @Input() titulo: string = '';
  @Input() artista: string = '';
  @Input() portadaUrl: string = '';
  @Input() cancionId!: string;
  

  sound!: Howl;
  isPlaying = false;
  duration: number = 0;
  currentTime: number = 0;
  interval: any;
  repetir = false;
  playlists: any[] = [];  // Lista de playlists para el selector
  playlistSeleccionada: string = '';
  mostrarSelectorPlaylist: boolean = false;


  constructor(private playlistsService: PlaylistsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.sound = new Howl({
      src: [this.audioUrl],
      html5: true,
      onload: () => {
        this.duration = this.sound.duration();
      },
      onend: () => {
        this.isPlaying = false;
        this.currentTime = 0;
        clearInterval(this.interval);
      }
    });

    this.cargarPlaylists();
  }

cargarPlaylists() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('Token no encontrado en localStorage');
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  this.http.get<any[]>('https://ring-town-backend.onrender.com/music/playlists/', { headers })
    .subscribe({
      next: (res) => {
        this.playlists = res;
      },
      error: (err) => {
        console.error('Error cargando playlists', err);
      }
    });
}

  async togglePlay() {
    if (this.isPlaying) {
      this.sound.pause();
      this.isPlaying = false;
      clearInterval(this.interval);
    } else {
      await Howler.ctx.resume();
      this.sound.play();
      this.isPlaying = true;
      this.interval = setInterval(() => {
        this.currentTime = this.sound.seek() as number;
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this.sound.unload();
    clearInterval(this.interval);
  }

  toggleRepetir() {
    this.repetir = !this.repetir;
    this.sound.loop(this.repetir);
  }

  formatTime(sec: number): string {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  prevSong() {
    console.log('Reproducir canción anterior');
  }

  nextSong() {
    console.log('Reproducir siguiente canción');
  }

  agregarCancion(playlistId: string, cancionId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(
      'https://ring-town-backend.onrender.com/music/playlists/agregar',
      { playlistId, cancionId }, // <-- los nombres deben ser exactamente así
      { headers }
    );
  }
  agregarCancionAPlaylist() {
    console.log('playlistSeleccionada:', this.playlistSeleccionada, 'cancionId:', this.cancionId);
    if (!this.playlistSeleccionada || !this.cancionId) {
      alert('Selecciona una playlist y una canción');
      return;
    }
    this.agregarCancion(this.playlistSeleccionada, this.cancionId).subscribe({
      next: (res) => {
        alert('Canción agregada a la playlist');
        this.mostrarSelectorPlaylist = false;
      },
      error: (err) => {
        alert('Error al agregar canción: ' + (err.error?.msg || err.message));
      }
    });
  }
}
