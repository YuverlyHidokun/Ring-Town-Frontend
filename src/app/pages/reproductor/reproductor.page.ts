import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { ReproductorMusicaComponent } from 'src/app/components/reproductor-musica/reproductor-musica.component'; // 👈 Importa el componente

@Component({
  selector: 'app-reproductor',
  templateUrl: './reproductor.page.html',
  styleUrls: ['./reproductor.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReproductorMusicaComponent  // 👈 Agrégalo aquí
  ]
})
export class ReproductorPage {
  cancionActual: any = {
    audioUrl: '',
    titulo: '',
    artista: '',
    portadaUrl: '',
    cancionId: '' // Agrega el ID de la canción si es necesario
  };

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.cancionActual.audioUrl = params['audioUrl'];
      this.cancionActual.titulo = params['titulo'];
      this.cancionActual.artista = params['artista'];
      this.cancionActual.portadaUrl = params['portadaUrl'];
      this.cancionActual.cancionId = params['cancionId'] || '';
    });
  }

  reproducirSiguiente() {
    console.log('Siguiente canción');
    // Aquí puedes cambiar `cancionActual` si tienes una lista
  }

  reproducirAnterior() {
    console.log('Canción anterior');
    // Aquí también puedes hacer lógica
  }
}
