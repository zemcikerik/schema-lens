import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectObjectListComponent } from './project-object-list.component';

describe('ProjectObjectListComponent', () => {
  let component: ProjectObjectListComponent;
  let fixture: ComponentFixture<ProjectObjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectObjectListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectObjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
