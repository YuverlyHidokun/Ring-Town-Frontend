import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonButton, IonIcon, IonProgressBar, IonSelect, IonSelectOption, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Howl, Howler } from 'howler';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

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
  playlists: any[] = [];
  playlistSeleccionada: string = '';
  mostrarSelectorPlaylist: boolean = false;

  // Para navegación entre canciones de playlist
  playlistCanciones: any[] = [];
  currentIndex: number = -1;

  constructor(
    private playlistsService: PlaylistsService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Soporte para navegación desde playlist
    this.route.queryParams.subscribe(params => {
      if (params['playlistCanciones']) {
        this.playlistCanciones = JSON.parse(params['playlistCanciones']);
        this.currentIndex = +params['currentIndex'];
        if (this.currentIndex >= 0) {
          const c = this.playlistCanciones[this.currentIndex];
          this.audioUrl = c.audioUrl;
          this.titulo = c.titulo;
          this.artista = c.artista;
          this.portadaUrl = c.portadaUrl;
          this.cancionId = c.cancionId;
        }
      }
      this.initHowl();
    });

    this.cargarPlaylists();
  }

  initHowl() {
    if (this.sound) {
      this.sound.unload();
    }
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
    if (this.playlistCanciones.length > 0 && this.currentIndex > 0) {
      this.currentIndex--;
      this.cargarCancionActual();
    }
  }

  nextSong() {
    if (this.playlistCanciones.length > 0 && this.currentIndex < this.playlistCanciones.length - 1) {
      this.currentIndex++;
      this.cargarCancionActual();
    }
  }

  cargarCancionActual() {
    const c = this.playlistCanciones[this.currentIndex];
    this.audioUrl = c.audioUrl;
    this.titulo = c.titulo;
    this.artista = c.artista;
    this.portadaUrl = c.portadaUrl;
    this.cancionId = c.cancionId;
    this.initHowl();
    this.togglePlay();
  }

  agregarCancion(playlistId: string, cancionId: string) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(
      'https://ring-town-backend.onrender.com/music/playlists/agregar',
      { playlistId, cancionId },
      { headers }
    );
  }

  agregarCancionAPlaylist() {
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