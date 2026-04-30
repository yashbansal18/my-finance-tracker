import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-logo">💰</div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard">📊 Dashboard</a>
          <a class="nav-item" routerLink="/expenses">📋 Expenses</a>
          <a class="nav-item" routerLink="/goals">🎯 Goals</a>
          <a class="nav-item active" routerLink="/settings">⚙️ Settings</a>
        </nav>
        <div class="sidebar-user">
          <div class="user-name">{{ user?.name }}</div>
          <button class="logout-btn" (click)="logout()">Sign out</button>
        </div>
      </aside>
      <main class="main">
        <div class="page-title">Settings</div>

        <!-- PROFILE -->
        <div class="card">
          <div class="card-title">Profile</div>
          <div class="info-row"><span>Name</span><strong>{{ user?.name }}</strong></div>
          <div class="info-row"><span>Email</span><strong>{{ user?.email }}</strong></div>
          <div class="info-row"><span>Monthly salary</span><strong>₹{{ (user?.salary || 0).toLocaleString('en-IN') }}</strong></div>
        </div>

        <!-- CHANGE PIN -->
        <div class="card">
          <div class="card-title">Change PIN</div>
          <div class="form-group"><label>Current PIN</label><input type="password" [(ngModel)]="currentPin" placeholder="••••" class="fi" /></div>
          <div class="form-group"><label>New PIN</label><input type="password" [(ngModel)]="newPin" placeholder="••••" maxlength="8" class="fi" /></div>
          <div class="success" *ngIf="pinSuccess">{{ pinSuccess }}</div>
          <div class="error" *ngIf="pinError">{{ pinError }}</div>
          <button class="btn-primary" (click)="changePin()">Update PIN</button>
        </div>

        <!-- DANGER ZONE -->
        <div class="card danger-card">
          <div class="card-title red">Danger zone</div>
          <p style="font-size:13px;color:#888;margin-bottom:12px">Sign out of your account on this device.</p>
          <button class="btn-danger" (click)="logout()">Sign out</button>
        </div>
      </main>
    </div>
  `,
  styles: [`
    * { box-sizing:border-box; margin:0; padding:0; }
    .layout { display:flex; min-height:100vh; background:#0f0f0f; color:#f0f0f0; font-family:'DM Sans',sans-serif; }
    .sidebar { width:220px; background:#1a1a1a; border-right:1px solid #2e2e2e; display:flex; flex-direction:column; padding:24px 0; flex-shrink:0; }
    .sidebar-logo { font-size:28px; text-align:center; margin-bottom:28px; }
    .sidebar-nav { flex:1; display:flex; flex-direction:column; gap:4px; padding:0 12px; }
    .nav-item { display:block; padding:10px 14px; border-radius:8px; color:#888; font-size:14px; text-decoration:none; }
    .nav-item:hover, .nav-item.active { background:#242424; color:#f0f0f0; }
    .sidebar-user { padding:16px 20px; border-top:1px solid #2e2e2e; }
    .user-name { font-size:13px; font-weight:500; margin-bottom:8px; }
    .logout-btn { width:100%; padding:7px; background:none; border:1px solid #2e2e2e; border-radius:7px; color:#888; font-size:12px; cursor:pointer; }
    .main { flex:1; padding:24px 28px; max-width:560px; }
    .page-title { font-size:18px; font-weight:600; margin-bottom:20px; }
    .card { background:#1a1a1a; border:1px solid #2e2e2e; border-radius:12px; padding:20px; margin-bottom:16px; }
    .card-title { font-size:14px; font-weight:600; margin-bottom:14px; }
    .card-title.red { color:#ef4444; }
    .info-row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #242424; font-size:13px; color:#888; }
    .info-row:last-child { border-bottom:none; }
    .info-row strong { color:#f0f0f0; font-weight:500; }
    .form-group { margin-bottom:12px; }
    label { display:block; font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:5px; }
    .fi { width:100%; padding:9px 12px; background:#242424; border:1px solid #2e2e2e; border-radius:8px; color:#f0f0f0; font-size:14px; }
    .fi:focus { outline:none; border-color:#3b82f6; }
    .btn-primary { padding:10px 20px; background:#3b82f6; border:none; border-radius:8px; color:#fff; font-size:13px; font-weight:600; cursor:pointer; }
    .btn-danger { padding:10px 20px; background:none; border:1px solid #ef4444; border-radius:8px; color:#ef4444; font-size:13px; font-weight:500; cursor:pointer; }
    .success { font-size:12px; color:#22c55e; margin-bottom:10px; }
    .error { font-size:12px; color:#ef4444; margin-bottom:10px; }
    .danger-card { border-color:#2d1515; }
  `]
})
export class SettingsComponent {
  user = this.auth.currentUser;
  currentPin = ''; newPin = '';
  pinSuccess = ''; pinError = '';

  constructor(private auth: AuthService) {}

  changePin() {
    this.pinSuccess = ''; this.pinError = '';
    if (!this.currentPin || !this.newPin) { this.pinError = 'Both fields required'; return; }
    if (this.newPin.length < 4) { this.pinError = 'New PIN must be at least 4 digits'; return; }
    this.auth.updatePin(this.currentPin, this.newPin).subscribe({
      next: () => { this.pinSuccess = 'PIN updated!'; this.currentPin = ''; this.newPin = ''; },
      error: (e) => this.pinError = e.error?.message || 'Failed to update PIN'
    });
  }

  logout() { this.auth.logout(); }
}
