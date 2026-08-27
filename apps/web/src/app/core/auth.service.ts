import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface AuthResponse {
  accessToken: string;
  user: { id: string; email: string; name: string | null };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'aether_token';
  private readonly userKey = 'aether_user';

  private _token = signal<string | null>(localStorage.getItem(this.tokenKey));
  private _user = signal<AuthResponse['user'] | null>(
    JSON.parse(localStorage.getItem(this.userKey) || 'null'),
  );

  isAuthenticated = computed(() => !!this._token());
  user = this._user.asReadonly();

  constructor(private http: HttpClient, private router: Router) {}

  register(email: string, password: string, name?: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/register`, { email, password, name })
      .pipe(tap((res) => this.persist(res)));
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((res) => this.persist(res)));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this._token.set(null);
    this._user.set(null);
    this.router.navigateByUrl('/login');
  }

  getToken() {
    return this._token();
  }

  private persist(res: AuthResponse) {
    localStorage.setItem(this.tokenKey, res.accessToken);
    localStorage.setItem(this.userKey, JSON.stringify(res.user));
    this._token.set(res.accessToken);
    this._user.set(res.user);
  }
}
