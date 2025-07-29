import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReproductorMusicaComponent } from './reproductor-musica.component';

describe('ReproductorMusicaComponent', () => {
  let component: ReproductorMusicaComponent;
  let fixture: ComponentFixture<ReproductorMusicaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReproductorMusicaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReproductorMusicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
