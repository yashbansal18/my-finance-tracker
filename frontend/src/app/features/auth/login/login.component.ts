import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-logo">💰</div>
        <h1 class="auth-title">Finance Tracker</h1>
        <p class="auth-sub">Sign in to your account</p>

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="you@example.com" (keyup.enter)="login()" />
        </div>
        <div class="form-group">
          <label>PIN</label>
          <input type="password" [(ngModel)]="pin" placeholder="••••" maxlength="8" (keyup.enter)="login()" />
        </div>

        <div class="error" *ngIf="error">{{ error }}</div>

        <button class="btn-primary" (click)="login()" [disabled]="loading">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>

        <p class="auth-link">Don't have an account? <a routerLink="/auth/register">Register</a></p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:#0f0f0f; }
    .auth-card { background:#1a1a1a; border:1px solid #2e2e2e; border-radius:14px; padding:40px 44px; width:360px; text-align:center; }
    .auth-logo { font-size:36px; margin-bottom:12px; }
    .auth-title { font-size:20px; font-weight:600; color:#f0f0f0; margin-bottom:6px; }
    .auth-sub { font-size:13px; color:#888; margin-bottom:28px; }
    .form-group { text-align:left; margin-bottom:14px; }
    label { display:block; font-size:12px; color:#888; margin-bottom:5px; text-transform:uppercase; letter-spacing:0.4px; }
    input { width:100%; padding:10px 14px; background:#242424; border:1px solid #2e2e2e; border-radius:8px; color:#f0f0f0; font-size:14px; }
    input:focus { outline:none; border-color:#3b82f6; }
    .error { color:#ef4444; font-size:12px; margin-bottom:12px; }
    .btn-primary { width:100%; padding:12px; background:#3b82f6; border:none; border-radius:8px; color:#fff; font-size:14px; font-weight:600; cursor:pointer; margin-bottom:16px; }
    .btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
    .auth-link { font-size:13px; color:#888; }
    .auth-link a { color:#3b82f6; text-decoration:none; }
  `]
})
export class LoginComponent {
  email = '';
  pin = '';
  error = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.error = '';
    if (!this.email || !this.pin) { this.error = 'Please enter email and PIN'; return; }
    this.loading = true;
    this.auth.login(this.email, this.pin).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => { this.error = err.error?.message || 'Login failed'; this.loading = false; }
    });
  }
}
