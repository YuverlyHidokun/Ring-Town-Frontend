import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaylistDetallePage } from './playlist-detalle.page';

describe('PlaylistDetallePage', () => {
  let component: PlaylistDetallePage;
  let fixture: ComponentFixture<PlaylistDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
