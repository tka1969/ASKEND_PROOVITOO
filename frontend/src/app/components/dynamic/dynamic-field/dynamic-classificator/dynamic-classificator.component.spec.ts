import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicClassificatorComponent } from './dynamic-classificator.component';

describe('DynamicClassificatorComponent', () => {
  let component: DynamicClassificatorComponent;
  let fixture: ComponentFixture<DynamicClassificatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicClassificatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicClassificatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
