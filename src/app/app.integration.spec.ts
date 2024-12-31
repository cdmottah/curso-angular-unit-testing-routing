import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router, RouterLinkWithHref } from "@angular/router";
import { asyncData, clickElement, getText, query, queryAllByDirective } from "src/testing";
import { routes } from "./app-routing.module";
import { AppModule } from './app.module'
import { ProductsService } from "./services/product.service";
import { generateManyProducts } from "./models/product.mock";
import { AuthService } from "./services/auth.service";
import { User } from "./models/user.model";
import { generateOneUser } from "./models/user.mock";



describe('App integration test', () => {

  async function setup(data?: { user?: User | null }) {
    if (!data) data = {}
    const { user = null } = data
    const productsServiceSpyObj = jasmine.createSpyObj('ProductsService', ['getAll']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', [], { user$: asyncData(user) });
    await TestBed.configureTestingModule({
      imports: [
        AppModule, // first import the module
        RouterTestingModule.withRoutes(routes) // then the router module with the routes to override the default routes
      ],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpyObj },
        { provide: AuthService, useValue: authServiceSpyObj }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router)
    const component = fixture.componentInstance;
    const productsServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    const authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router.initialNavigation();
    tick(); // wait for the router to finish navigating
    fixture.detectChanges(); // ngOnInit
    return { fixture, component, router, productsServiceSpy, authServiceSpy }
  }

  it('should create the component', fakeAsync(async () => {
    const { component } = await setup()
    expect(component).toBeTruthy();
  }))

  it('should be at least 7 links', fakeAsync(async () => {
    const { fixture } = await setup()
    const links = queryAllByDirective(fixture, RouterLinkWithHref)
    expect(links.length).toBeGreaterThan(6)
  }))

  it('should render others on click with sesion', fakeAsync(async () => {
    const mockUser = generateOneUser();
    const { fixture, router, productsServiceSpy } = await setup({ user: mockUser })
    const productsMock = generateManyProducts(10)
    productsServiceSpy.getAll.and.returnValue(asyncData(productsMock))

    clickElement(fixture, 'others-links', true)

    tick(); // wait for the router to finish navigating
    fixture.detectChanges(); // ngOnInit of the others component

    tick(); // wait for the others component to finish loading the products
    fixture.detectChanges(); // render the products

    expect(router.url).withContext('should be /others').toBe('/others')
    const othersDebugElement = query(fixture, 'app-others')
    expect(othersDebugElement).withContext('should render others').toBeTruthy()
    const text = getText(fixture, 'products-length')
    expect(text).toContain(productsMock.length)
  }));

  it('should render others on click without sesion', fakeAsync(async () => {
    const { fixture, router } = await setup()
    clickElement(fixture, 'others-links', true)
    tick(); // wait for the router to finish navigating
    fixture.detectChanges(); // ngOnInit of the others component
    expect(router.url).withContext('should be /').toBe('/')
  }))

  it('should render pico on click', fakeAsync(async () => {
    const { fixture, router } = await setup()
    clickElement(fixture, 'pico-links', true)
    tick();
    fixture.detectChanges(); // ngOnInit of the pico component
    expect(router.url).withContext('should be /pico-preview').toBe('/pico-preview')
    const othersDebugElement = query(fixture, 'app-pico-preview')
    expect(othersDebugElement).toBeTruthy()
  }));


})
