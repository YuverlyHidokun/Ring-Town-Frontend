import { addIcons } from 'ionicons';
import {
  homeOutline,
  searchOutline,
  musicalNotesOutline,
  libraryOutline,
  personOutline,
  logOutOutline,
  addCircleOutline,
  albumsOutline,
  playCircleOutline,
  pauseCircleOutline,
  play,          // <-- agregar aquí
  pause,         // <-- agregar aquí
  heartOutline,
  heart,
  trashBinOutline,
  pencilOutline,
  playSkipForwardOutline,
  playSkipBackOutline,
  repeatOutline,
  repeat

} from 'ionicons/icons';

addIcons({
  'home-outline': homeOutline,               // Para la página principal (Tab 1)
  'search-outline': searchOutline,           // Para buscador
  'musical-notes-outline': musicalNotesOutline, // Icono musical general
  'library-outline': libraryOutline,         // Para las playlists
  'person-outline': personOutline,           // Perfil del usuario
  'log-out-outline': logOutOutline,          // Cerrar sesión
  'add-circle-outline': addCircleOutline,    // Crear playlist o subir canción
  'albums-outline': albumsOutline,           // Para álbumes o colecciones
  'play-circle-outline': playCircleOutline,  // Reproducir canción
  'pause-circle-outline': pauseCircleOutline,// Pausar canción
  'play': play,                              // <-- agregar aquí
  'pause': pause,                            // <-- agregar aquí
  'heart-outline': heartOutline,             // Agregar a favoritos
  'heart': heart,                            // Ya en favoritos
  'trash-bin-outline': trashBinOutline,      // Eliminar
  'pencil-outline': pencilOutline,
  'play-skip-forward': playSkipForwardOutline,
  'play-skip-back': playSkipBackOutline,
  'repeat-outline': repeatOutline,     
  'repeat': repeat // <-- agregar aquí
});
