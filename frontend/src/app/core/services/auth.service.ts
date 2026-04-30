import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const stored = localStorage.getItem('ft_user');
    if (stored) this.currentUserSubject.next(JSON.parse(stored));
  }

  get currentUser(): User | null { return this.currentUserSubject.value; }
  get token(): string | null { return localStorage.getItem('ft_token'); }
  get isLoggedIn(): boolean { return !!this.token; }

  register(name: string, email: string, pin: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, { name, email, pin }).pipe(
      tap((res: any) => this.setSession(res))
    );
  }

  login(email: string, pin: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, { email, pin }).pipe(
      tap((res: any) => this.setSession(res))
    );
  }

  updateSalary(salary: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/salary`, { salary }).pipe(
      tap((res: any) => {
        const user = { ...this.currentUser!, salary: res.salary };
        this.currentUserSubject.next(user);
        localStorage.setItem('ft_user', JSON.stringify(user));
      })
    );
  }

  updatePin(currentPin: string, newPin: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/pin`, { currentPin, newPin });
  }

  logout() {
    localStorage.removeItem('ft_token');
    localStorage.removeItem('ft_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private setSession(res: any) {
    localStorage.setItem('ft_token', res.token);
    localStorage.setItem('ft_user', JSON.stringify(res.user));
    this.currentUserSubject.next(res.user);
  }
}
