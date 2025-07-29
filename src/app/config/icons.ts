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
  heartOutline,
  heart,
  trashBinOutline,
  pencilOutline
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
  'heart-outline': heartOutline,             // Agregar a favoritos
  'heart': heart,                            // Ya en favoritos
  'trash-bin-outline': trashBinOutline,      // Eliminar
  'pencil-outline': pencilOutline            // Editar
});
