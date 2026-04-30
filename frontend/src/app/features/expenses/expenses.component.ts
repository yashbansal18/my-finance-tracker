import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../core/services/expense.service';
import { AuthService } from '../../core/services/auth.service';
import { Expense, CATEGORIES, CATEGORY_COLORS } from '../../shared/models/models';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="layout">
      <aside class="sidebar">
        <div class="sidebar-logo">💰</div>
        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/dashboard">📊 Dashboard</a>
          <a class="nav-item active" routerLink="/expenses">📋 Expenses</a>
          <a class="nav-item" routerLink="/goals">🎯 Goals</a>
          <a class="nav-item" routerLink="/settings">⚙️ Settings</a>
        </nav>
        <div class="sidebar-user">
          <div class="user-name">{{ user?.name }}</div>
          <button class="logout-btn" (click)="logout()">Sign out</button>
        </div>
      </aside>
      <main class="main">
        <div class="top-bar">
          <div class="page-title">Expenses</div>
          <div class="month-nav">
            <button class="nav-btn" (click)="changeMonth(-1)">&#8592;</button>
            <span class="month-label">{{ monthLabel }}</span>
            <button class="nav-btn" (click)="changeMonth(1)">&#8594;</button>
          </div>
        </div>

        <!-- ADD FORM -->
        <div class="add-card">
          <div class="section-title">Add expense</div>
          <div class="form-grid">
            <div class="form-group"><label>Date</label><input type="date" [(ngModel)]="newExp.date" class="fi" /></div>
            <div class="form-group"><label>Category</label>
              <select [(ngModel)]="newExp.category" class="fi">
                <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
              </select>
            </div>
            <div class="form-group"><label>Note</label><input type="text" [(ngModel)]="newExp.note" placeholder="e.g. Netflix, BSES bill" class="fi" /></div>
            <div class="form-group"><label>Amount (₹)</label><input type="number" [(ngModel)]="newExp.amount" placeholder="0" class="fi mono" /></div>
            <div class="form-group"><label style="opacity:0">.</label><button class="add-btn" (click)="addExpense()">+ Add</button></div>
          </div>
        </div>

        <!-- FILTER -->
        <div class="filter-row">
          <select [(ngModel)]="filterCat" (change)="applyFilter()" class="filter-select">
            <option value="">All categories</option>
            <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
          </select>
          <span class="total-label">Total: <strong>{{ fmt(filteredTotal) }}</strong> · {{ filtered.length }} entries</span>
        </div>

        <!-- TABLE -->
        <div class="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Category</th><th>Note</th><th style="text-align:right">Amount</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let e of filtered">
                <td class="mono small">{{ e.date | date:'dd MMM yyyy' }}</td>
                <td><span class="badge" [style.background]="getColor(e.category)+'22'" [style.color]="getColor(e.category)">{{ e.category }}</span></td>
                <td class="muted">{{ e.note || '—' }}</td>
                <td class="mono" style="text-align:right;font-weight:500">{{ fmt(e.amount) }}</td>
                <td><button class="del-btn" (click)="delete(e._id!)">Del</button></td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!filtered.length" class="empty">No expenses found.</div>
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
    .main { flex:1; padding:24px 28px; }
    .top-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .page-title { font-size:18px; font-weight:600; }
    .month-nav { display:flex; align-items:center; gap:8px; }
    .nav-btn { background:#1a1a1a; border:1px solid #2e2e2e; color:#888; padding:6px 12px; border-radius:8px; cursor:pointer; }
    .month-label { font-size:14px; min-width:130px; text-align:center; font-family:monospace; color:#888; }
    .add-card { background:#1a1a1a; border:1px solid #2e2e2e; border-radius:12px; padding:16px 18px; margin-bottom:16px; }
    .section-title { font-size:14px; font-weight:500; margin-bottom:12px; }
    .form-grid { display:grid; grid-template-columns:130px 1fr 1fr 140px auto; gap:10px; align-items:end; }
    .form-group { display:flex; flex-direction:column; gap:5px; }
    label { font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.4px; }
    .fi { padding:9px 12px; background:#242424; border:1px solid #2e2e2e; border-radius:8px; color:#f0f0f0; font-size:13px; width:100%; }
    .fi:focus { outline:none; border-color:#3b82f6; }
    .mono { font-family:monospace; }
    .add-btn { padding:9px 20px; background:#22c55e; border:none; border-radius:8px; color:#000; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; }
    .filter-row { display:flex; align-items:center; gap:12px; margin-bottom:12px; }
    .filter-select { padding:8px 12px; background:#1a1a1a; border:1px solid #2e2e2e; border-radius:8px; color:#f0f0f0; font-size:13px; }
    .total-label { font-size:13px; color:#888; margin-left:auto; }
    .table-wrap { overflow-x:auto; }
    table { width:100%; border-collapse:collapse; font-size:13px; }
    th { text-align:left; padding:8px 10px; font-size:11px; color:#555; text-transform:uppercase; letter-spacing:0.4px; border-bottom:1px solid #2e2e2e; font-weight:500; }
    td { padding:9px 10px; border-bottom:1px solid #1e1e1e; }
    tr:hover td { background:#1a1a1a; }
    .badge { display:inline-block; font-size:11px; padding:2px 8px; border-radius:20px; font-weight:500; }
    .small { font-size:12px; color:#888; }
    .muted { color:#888; }
    .del-btn { padding:3px 9px; background:none; border:1px solid #2e2e2e; border-radius:6px; color:#555; cursor:pointer; font-size:11px; }
    .del-btn:hover { background:#7f1d1d; border-color:#ef4444; color:#ef4444; }
    .empty { text-align:center; padding:28px; color:#555; font-size:13px; }
    input[type='date']::-webkit-calendar-picker-indicator { filter:invert(0.5); }
  `]
})
export class ExpensesComponent implements OnInit {
  user = this.auth.currentUser;
  expenses: Expense[] = [];
  filtered: Expense[] = [];
  categories = CATEGORIES;
  filterCat = '';
  currentMonth = new Date().toISOString().slice(0, 7);
  newExp = { date: new Date().toISOString().slice(0, 10), category: 'Groceries', note: '', amount: null as any };

  get filteredTotal() { return this.filtered.reduce((s, e) => s + e.amount, 0); }
  get monthLabel() {
    const [y, m] = this.currentMonth.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  constructor(private expService: ExpenseService, private auth: AuthService) {}
  ngOnInit() { this.load(); }

  load() { this.expService.getAll(this.currentMonth).subscribe(e => { this.expenses = e; this.applyFilter(); }); }
  applyFilter() { this.filtered = this.filterCat ? this.expenses.filter(e => e.category === this.filterCat) : [...this.expenses]; }
  changeMonth(d: number) {
    let [y, m] = this.currentMonth.split('-').map(Number);
    m += d; if (m > 12) { m = 1; y++; } if (m < 1) { m = 12; y--; }
    this.currentMonth = y + '-' + String(m).padStart(2, '0'); this.load();
  }
  addExpense() {
    if (!this.newExp.amount || this.newExp.amount <= 0) return;
    this.expService.create(this.newExp).subscribe(() => { this.newExp.amount = null; this.load(); });
  }
  delete(id: string) { this.expService.delete(id).subscribe(() => this.load()); }
  fmt(n: number) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  getColor(cat: string) { return CATEGORY_COLORS[cat] || '#888'; }
  logout() { this.auth.logout(); }
}
