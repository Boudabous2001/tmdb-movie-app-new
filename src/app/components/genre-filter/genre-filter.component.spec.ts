import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenreFilterComponent } from './genre-filter.component';

describe('GenreFilterComponent', () => {
  let component: GenreFilterComponent;
  let fixture: ComponentFixture<GenreFilterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GenreFilterComponent]
    });
    fixture = TestBed.createComponent(GenreFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
