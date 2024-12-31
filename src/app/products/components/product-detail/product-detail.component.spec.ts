import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRouteStub, asyncData, getText, mockObservable } from './../../../../testing';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ProductsService } from '../../../services/product.service';
import { generateOneProduct } from '../../../models/product.mock';



describe('ProductDetailComponent', () => {

  async function _setup() {
    const _activatedRouterSpy = new ActivatedRouteStub();
    const _productsServiceSpy = jasmine.createSpyObj('ProductsService', ['getOne'])
    const _locationSpy = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      declarations: [ProductDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: _activatedRouterSpy },
        { provide: Location, useValue: _locationSpy },
        { provide: ProductsService, useValue: _productsServiceSpy }
      ]
    })
      .compileComponents();

    const fixture = TestBed.createComponent(ProductDetailComponent);
    const component = fixture.componentInstance;
    const activatedRouterSpy = TestBed.inject(ActivatedRoute) as unknown as jasmine.SpyObj<ActivatedRouteStub>
    const productsServiceSpy = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>
    const locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>

    return { fixture, component, activatedRouterSpy, productsServiceSpy, locationSpy }
  }

  it('should create', async () => {
    const { component, fixture } = await _setup();
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the product on the view', async () => {
    const mockProduct = generateOneProduct();
    const { productsServiceSpy, fixture, activatedRouterSpy } = await _setup();
    activatedRouterSpy.setParamMap({ id: mockProduct.id })
    productsServiceSpy.getOne.and.returnValue(mockObservable(mockProduct))
    fixture.detectChanges();
    const titleText = getText(fixture, 'title')
    const priceText = getText(fixture, 'price')
    expect(titleText).toContain(mockProduct.title);
    expect(priceText).toContain(mockProduct.price);
    expect(productsServiceSpy.getOne).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should change the status "loading" => "success"', fakeAsync(async () => {
    const mockProduct = generateOneProduct();
    const { fixture, activatedRouterSpy, component, productsServiceSpy } = await _setup();
    activatedRouterSpy.setParamMap({ id: mockProduct.id })
    productsServiceSpy.getOne.and.returnValue(asyncData(mockProduct));
    fixture.detectChanges();
    expect(component.status).toEqual('loading');
    tick();
    fixture.detectChanges();
    expect(component.status).toEqual('success');
  }));

  it('should go back when the product id is not sended', async () => {
    const { fixture, locationSpy, activatedRouterSpy } = await _setup();
    activatedRouterSpy.setParamMap({})
    locationSpy.back.and.callThrough();
    fixture.detectChanges();
    expect(locationSpy.back).toHaveBeenCalled();
  });
});
