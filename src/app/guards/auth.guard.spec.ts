import { TestBed } from "@angular/core/testing"
import { AuthGuard } from "./auth.guard"
import { TokenService } from "../services/token.service"
import { AuthService } from "../services/auth.service"
import { Router } from "@angular/router"
import { mockObservable, fakeRouterStateSnapshot, fakeActivatedRouteSnapshot, fakeParamMap, } from "src/testing"
import { User } from "../models/user.model"
import { generateOneUser } from "../models/user.mock"

describe('tests for AuthGuard', () => {
  const _setup = (data?: { user?: User | null }) => {
    if (!data) data = {}
    const { user = null } = data
    const _tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken'])
    const _authServiceSpy = jasmine.createSpyObj('AuthService', [], { user$: mockObservable(user) })
    const _routerSpy = jasmine.createSpyObj('Router', ['navigate'])
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: TokenService, useValue: _tokenServiceSpy },
        { provide: AuthService, useValue: _authServiceSpy },
        { provide: Router, useValue: _routerSpy },
      ]
    })
    const guard = TestBed.inject(AuthGuard)
    const tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>
    const authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>
    const router = TestBed.inject(Router) as jasmine.SpyObj<Router>
    return { guard, tokenService, authService, router }
  }

  it('should be create', () => {
    const { guard } = _setup()
    expect(guard).toBeTruthy()
  })

  it('should return true if user is logged', (doneFn) => {
    const _fakeRouterStateSnapshot = fakeRouterStateSnapshot({})
    const _fakeActivatedRouteSnapshot = fakeActivatedRouteSnapshot({ paramMap: fakeParamMap({ productId: '1' }) })
    const mockUser = generateOneUser()
    const { guard } = _setup({ user: mockUser })
    guard.canActivate(_fakeActivatedRouteSnapshot, _fakeRouterStateSnapshot).subscribe((result) => {
      expect(result).toBeTrue()
      doneFn()
    })
  })

  it('should return false if user is not logged', (doneFn) => {
    const _fakeRouterStateSnapshot = fakeRouterStateSnapshot({})
    const _fakeActivatedRouteSnapshot = fakeActivatedRouteSnapshot({ paramMap: fakeParamMap({ productId: '1' }) })
    const { guard, router } = _setup()
    guard.canActivate(_fakeActivatedRouteSnapshot, _fakeRouterStateSnapshot).subscribe((result) => {
      expect(result).toBeFalse()
      expect(router.navigate).toHaveBeenCalledWith(['/'])
      doneFn()
    })
  })

})
