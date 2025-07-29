import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonImg} from '@ionic/angular/standalone';
import { API_URL } from 'src/app/config/api';

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonImg],
  templateUrl: './tab1.page.html',
  styleUrls: ['./tab1.page.scss']
})
export class Tab1Page implements OnInit {
  canciones: any[] = [];
  genero = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.obtenerCanciones();
  }

  obtenerCanciones() {
    this.http.get<any[]>(`${API_URL}/music/canciones`).subscribe(data => {
      this.canciones = data;
    });
  }

  buscarPorGenero() {
    if (this.genero.trim() === '') {
      this.obtenerCanciones();
      return;
    }

    this.http.get<any[]>(`${API_URL}/music/canciones/buscar/genero?genero=${this.genero}`).subscribe(data => {
      this.canciones = data;
    });
  }
}
