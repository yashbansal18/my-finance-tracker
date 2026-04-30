import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GoalService } from '../../core/services/goal.service';
import { AuthService } from '../../core/services/auth.service';
import { Goal } from '../../shared/models/models';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-logo">💰</div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard">📊 Dashboard</a>
          <a class="nav-item" routerLink="/expenses">📋 Expenses</a>
          <a class="nav-item active" routerLink="/goals">🎯 Goals</a>
          <a class="nav-item" routerLink="/settings">⚙️ Settings</a>
        </nav>
        <div class="sidebar-user">
          <div class="user-name">{{ user?.name }}</div>
          <button class="logout-btn" (click)="logout()">Sign out</button>
        </div>
      </aside>
      <main class="main">
        <div class="page-title">Savings Goals</div>

        <div class="add-card">
          <div class="section-title">Add new goal</div>
          <div class="form-row">
            <input type="text" [(ngModel)]="newGoal.name" placeholder="Goal name (e.g. Bike, iPhone, Trip)" class="fi" />
            <input type="text" [(ngModel)]="newGoal.emoji" placeholder="Emoji" class="fi emoji-input" maxlength="2" />
            <input type="number" [(ngModel)]="newGoal.savedAmount" placeholder="Already saved ₹" class="fi mono" />
            <input type="number" [(ngModel)]="newGoal.targetAmount" placeholder="Target ₹" class="fi mono" />
            <button class="add-btn" (click)="addGoal()">+ Add Goal</button>
          </div>
        </div>

        <div class="goals-grid">
          <div class="goal-card" *ngFor="let g of goals">
            <div class="goal-top">
              <div class="goal-emoji">{{ g.emoji || '🎯' }}</div>
              <div class="goal-info">
                <div class="goal-name">{{ g.name }}</div>
                <div class="goal-amounts">{{ fmt(g.savedAmount) }} saved of {{ fmt(g.targetAmount) }}</div>
              </div>
              <button class="del-btn" (click)="delete(g._id!)">✕</button>
            </div>
            <div class="goal-bar-bg">
              <div class="goal-bar" [style.width.%]="pct(g)" [class.complete]="pct(g) >= 100"></div>
            </div>
            <div class="goal-footer">
              <span class="pct-label" [class.done]="pct(g) >= 100">{{ pct(g) >= 100 ? '🎉 Complete!' : pct(g) + '% done' }}</span>
              <span class="remaining" *ngIf="pct(g) < 100">{{ fmt(g.targetAmount - g.savedAmount) }} to go</span>
            </div>
            <!-- Update saved amount -->
            <div class="update-row">
              <input type="number" [(ngModel)]="updateAmount" placeholder="Update saved ₹" class="fi mono small-input" />
              <button class="update-btn" (click)="updateSaved(g)">Update</button>
            </div>
          </div>
        </div>
        <div *ngIf="!goals.length" class="empty">No goals yet. Add one above to start tracking your savings! 🚀</div>
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
    .main { flex:1; padding:24px 28px; }
    .page-title { font-size:18px; font-weight:600; margin-bottom:20px; }
    .section-title { font-size:14px; font-weight:500; margin-bottom:12px; }
    .add-card { background:#1a1a1a; border:1px solid #2e2e2e; border-radius:12px; padding:16px 18px; margin-bottom:20px; }
    .form-row { display:flex; gap:8px; flex-wrap:wrap; align-items:center; }
    .fi { flex:1; min-width:120px; padding:9px 12px; background:#242424; border:1px solid #2e2e2e; border-radius:8px; color:#f0f0f0; font-size:13px; }
    .fi:focus { outline:none; border-color:#a855f7; }
    .emoji-input { max-width:70px; flex:none; text-align:center; font-size:18px; }
    .mono { font-family:monospace; }
    .add-btn { padding:9px 20px; background:#a855f7; border:none; border-radius:8px; color:#fff; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; }
    .goals-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:14px; }
    .goal-card { background:#1a1a1a; border:1px solid #2e2e2e; border-radius:12px; padding:16px; }
    .goal-top { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
    .goal-emoji { font-size:28px; }
    .goal-info { flex:1; }
    .goal-name { font-size:14px; font-weight:600; }
    .goal-amounts { font-size:12px; color:#888; font-family:monospace; margin-top:2px; }
    .del-btn { padding:4px 8px; background:none; border:1px solid #2e2e2e; border-radius:6px; color:#555; cursor:pointer; font-size:12px; }
    .del-btn:hover { color:#ef4444; border-color:#ef4444; }
    .goal-bar-bg { height:6px; background:#242424; border-radius:3px; margin-bottom:8px; overflow:hidden; }
    .goal-bar { height:6px; border-radius:3px; background:#a855f7; transition:width 0.4s; }
    .goal-bar.complete { background:#22c55e; }
    .goal-footer { display:flex; justify-content:space-between; margin-bottom:10px; }
    .pct-label { font-size:12px; color:#a855f7; font-weight:500; }
    .pct-label.done { color:#22c55e; }
    .remaining { font-size:12px; color:#555; }
    .update-row { display:flex; gap:6px; }
    .small-input { flex:1; font-size:12px; padding:6px 10px; }
    .update-btn { padding:6px 12px; background:#242424; border:1px solid #2e2e2e; border-radius:7px; color:#888; font-size:12px; cursor:pointer; }
    .update-btn:hover { background:#a855f722; border-color:#a855f7; color:#a855f7; }
    .empty { text-align:center; padding:40px; color:#555; font-size:14px; }
  `]
})
export class GoalsComponent implements OnInit {
  user = this.auth.currentUser;
  goals: Goal[] = [];
  newGoal = { name: '', emoji: '🎯', savedAmount: null as any, targetAmount: null as any };
  updateAmount: any;

  constructor(private goalService: GoalService, private auth: AuthService) {}
  ngOnInit() { this.load(); }
  load() { this.goalService.getAll().subscribe(g => this.goals = g); }

  addGoal() {
    if (!this.newGoal.name || !this.newGoal.targetAmount) return;
    this.goalService.create(this.newGoal).subscribe(() => {
      this.newGoal = { name: '', emoji: '🎯', savedAmount: null, targetAmount: null };
      this.load();
    });
  }

  updateSaved(g: Goal) {
    const amt = (g as any)['updateAmount'];
    if (!amt) return;
    this.goalService.update(g._id!, { savedAmount: Number(amt) }).subscribe(() => this.load());
  }

  delete(id: string) { this.goalService.delete(id).subscribe(() => this.load()); }
  pct(g: Goal) { return Math.min(Math.round(g.savedAmount / g.targetAmount * 100), 100); }
  fmt(n: number) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  logout() { this.auth.logout(); }
}
