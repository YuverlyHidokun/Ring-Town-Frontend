import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/app/config/api';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PlaylistsService {
  private apiUrl = 'https://ring-town-backend.onrender.com/music/playlists'; // cambia según tu backend

  constructor(private http: HttpClient) { }

  getPlaylists() {
    return this.http.get(`${this.apiUrl}/`);
  }

  agregarCancion(playlistId: string, cancionId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const body = {
      playlistId,
      cancionId,
    };

    return this.http.post(`${this.apiUrl}/agregar`, body, { headers });
  }

}
