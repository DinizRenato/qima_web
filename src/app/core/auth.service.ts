import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiAuthUrl = 'http://localhost:8080/auth/login';
  private apiCreateUserUrl = 'http://localhost:8080/users';


  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.loadUser();
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(this.apiAuthUrl, { username, password }).pipe(
      map(response => response.token),
      catchError(() => throwError(() => new Error('Invalid credentials')))
    );
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user).token : null;
  }

  private loadUser() {
    const user = localStorage.getItem('user');
    if (user) this.userSubject.next(JSON.parse(user));
  }

  register(userData: any) {
    return this.http.post(this.apiCreateUserUrl, userData);
  }
}
