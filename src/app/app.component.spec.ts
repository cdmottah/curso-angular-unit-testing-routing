import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { queryAllByDirective, RouterLinkDirectiveStub } from '../testing'
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-banner'
})
class BannerComponentStub {}

@Component({
  selector: 'app-footer'
})
class FooterComponentStub {}


describe('AppComponent', () => {

  async function _setup() {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        RouterLinkDirectiveStub,
        BannerComponentStub,
        FooterComponentStub
      ],
      // schemas:[NO_ERRORS_SCHEMA]
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
    return { fixture }
  }


  it('should create the app', async () => {
    const { fixture } = await _setup();
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ng-testing-services'`, async () => {
    const { fixture } = await _setup();
    const app = fixture.componentInstance;
    expect(app.title).toEqual('ng-testing-services');
  });

  it('should be at least 7 links', async () => {
    const { fixture } = await _setup();
    const links = queryAllByDirective(fixture, RouterLinkDirectiveStub)
    expect(links.length).toBeGreaterThan(6)
  })

  it('should be match de links routes', async () => {
    const { fixture } = await _setup();
    const links = queryAllByDirective(fixture, RouterLinkDirectiveStub)
    const routerLinks = links.map(link => link.injector.get(RouterLinkDirectiveStub));
    expect(routerLinks[0].linkParams).toEqual('/')
    expect(routerLinks[1].linkParams).toEqual('/auth/register')
  })

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('.content span')?.textContent).toContain('ng-testing-services app is running!');
  // });
});
