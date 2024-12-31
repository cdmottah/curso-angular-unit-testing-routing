import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: 'app-pico-preview'
})
class PicoPreviewComponent { }

@Component({
  selector: 'app-people'
})
class PeopleComponent { }

@Component({
  selector: 'app-others'
})
class OthersComponent { }

const routes = [
  {
    path: 'pico-preview',
    component: PicoPreviewComponent
  },
  {
    path: 'people',
    component: PeopleComponent
  },
  {
    path: 'others',
    component: OthersComponent
  },
];

fdescribe('App integration test', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        AppComponent,
        PicoPreviewComponent,
        PeopleComponent,
        OthersComponent
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  })

  beforeEach(fakeAsync(async () => {
    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router)
    component = fixture.componentInstance;
    router.initialNavigation();
    tick();
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  })




})
