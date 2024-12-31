import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router, RouterLinkWithHref } from "@angular/router";
import { clickElement, query, queryAllByDirective } from "src/testing";
import { routes } from "./app-routing.module";
import { AppModule } from './app.module'



fdescribe('App integration test', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppModule, // first import the module
        RouterTestingModule.withRoutes(routes) // then the router module with the routes to override the default routes
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  })

  beforeEach(fakeAsync(async () => {
    fixture = TestBed.createComponent(AppComponent);
    router = TestBed.inject(Router)
    component = fixture.componentInstance;
    router.initialNavigation();
    tick(); // wait for the router to finish navigating
    fixture.detectChanges(); // ngOnInit
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  })

  it('should be at least 7 links', async () => {
    const links = queryAllByDirective(fixture, RouterLinkWithHref)
    expect(links.length).toBeGreaterThan(6)
  })

  it('should render others on click', fakeAsync(async () => {
    clickElement(fixture, 'others-links', true)
    tick();
    fixture.detectChanges(); // ngOnInit of the others component
    expect(router.url).withContext('should be /others').toBe('/others')
    const othersDebugElement = query(fixture, 'app-others')
    expect(othersDebugElement).toBeTruthy()
  }));

  it('should render pico on click', fakeAsync(async () => {
    clickElement(fixture, 'pico-links', true)
    tick();
    fixture.detectChanges(); // ngOnInit of the pico component
    expect(router.url).withContext('should be /pico-preview').toBe('/pico-preview')
    const othersDebugElement = query(fixture, 'app-pico-preview')
    expect(othersDebugElement).toBeTruthy()
  }));


})
