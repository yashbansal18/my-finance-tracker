import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ExpenseService } from '../../core/services/expense.service';
import { SummaryService } from '../../core/services/summary.service';
import { GoalService } from '../../core/services/goal.service';
import { Expense, Goal, MonthlySummary, TrendData, CATEGORY_COLORS, CATEGORIES } from '../../shared/models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="layout">
      <!-- SIDEBAR -->
      <aside class="sidebar">
        <div class="sidebar-logo">💰</div>
        <nav class="sidebar-nav">
          <a class="nav-item active" routerLink="/dashboard">📊 Dashboard</a>
          <a class="nav-item" routerLink="/expenses">📋 Expenses</a>
          <a class="nav-item" routerLink="/goals">🎯 Goals</a>
          <a class="nav-item" routerLink="/settings">⚙️ Settings</a>
        </nav>
        <div class="sidebar-user">
          <div class="user-name">{{ user?.name }}</div>
          <div class="user-email">{{ user?.email }}</div>
          <button class="logout-btn" (click)="logout()">Sign out</button>
        </div>
      </aside>

      <!-- MAIN -->
      <main class="main">
        <div class="top-bar">
          <div class="page-title">Dashboard</div>
          <div class="month-nav">
            <button class="nav-btn" (click)="changeMonth(-1)">&#8592;</button>
            <span class="month-label">{{ monthLabel }}</span>
            <button class="nav-btn" (click)="changeMonth(1)">&#8594;</button>
          </div>
        </div>

        <!-- SALARY ROW -->
        <div class="salary-bar">
          <span class="salary-label">Monthly in-hand salary</span>
          <div class="salary-input-wrap">
            <span class="rupee">₹</span>
            <input type="number" [(ngModel)]="salaryInput" (change)="updateSalary()" class="salary-input" placeholder="55000" />
            <button class="nav-btn" (click)="updateSalary()">Add</button>
          </div>
        </div>

        <!-- METRICS -->
        <div class="metrics">
          <div class="metric-card">
            <div class="metric-label">In-hand salary</div>
            <div class="metric-value blue">{{ fmt(user?.salary || 0) }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Total spent</div>
            <div class="metric-value red">{{ fmt(summary?.totalSpent || 0) }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Balance left</div>
            <div class="metric-value" [class.green]="balance >= 0" [class.red]="balance < 0">{{ fmt(balance) }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Saved this month</div>
            <div class="metric-value amber">{{ savingsPct }}%</div>
          </div>
        </div>

        <!-- PROGRESS -->
        <div class="progress-card">
          <div class="progress-header">
            <span>Budget used</span>
            <span class="mono">{{ budgetPct }}%</span>
          </div>
          <div class="progress-bg">
            <div class="progress-fill" [style.width.%]="budgetPct"
              [style.background]="budgetPct > 90 ? '#ef4444' : budgetPct > 70 ? '#f59e0b' : '#22c55e'"></div>
          </div>
        </div>

        <!-- QUICK ADD -->
        <div class="quick-add-card">
          <div class="section-title">Quick add expense</div>
          <div class="quick-form">
            <input type="date" [(ngModel)]="newExp.date" class="fi" />
            <select [(ngModel)]="newExp.category" class="fi">
              <option *ngFor="let c of categories" [value]="c">{{ c }}</option>
            </select>
            <input type="text" [(ngModel)]="newExp.note" placeholder="Note (optional)" class="fi" />
            <input type="number" [(ngModel)]="newExp.amount" placeholder="₹ Amount" class="fi mono" />
            <button class="add-btn" (click)="addExpense()">+ Add</button>
          </div>
        </div>

        <!-- CATEGORY BREAKDOWN -->
        <div class="section-title" style="margin-bottom:12px">Spending by category</div>
        <div class="cat-grid">
          <div class="cat-card" *ngFor="let item of summary?.breakdown">
            <div class="cat-header">
              <span class="cat-name">{{ item._id }}</span>
              <span class="cat-total">{{ fmt(item.total) }}</span>
            </div>
            <div class="cat-bar-bg">
              <div class="cat-bar" [style.width.%]="catPct(item.total)"
                [style.background]="getColor(item._id)"></div>
            </div>
            <div class="cat-meta">{{ catPct(item.total) }}% · {{ item.count }} entries</div>
          </div>
        </div>

        <!-- RECENT EXPENSES -->
        <div class="section-title" style="margin:20px 0 12px">Recent expenses</div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Date</th><th>Category</th><th>Note</th><th style="text-align:right">Amount</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let e of recentExpenses">
                <td class="mono small">{{ e.date | date:'dd MMM' }}</td>
                <td><span class="badge" [style.background]="getColor(e.category)+'22'" [style.color]="getColor(e.category)">{{ e.category }}</span></td>
                <td class="muted">{{ e.note || '—' }}</td>
                <td class="mono" style="text-align:right;font-weight:500">{{ fmt(e.amount) }}</td>
                <td><button class="del-btn" (click)="deleteExpense(e._id!)">Del</button></td>
              </tr>
            </tbody>
          </table>
          <div *ngIf="!recentExpenses.length" class="empty">No expenses this month yet.</div>
        </div>

        <!-- GOALS -->
        <div class="section-title" style="margin:20px 0 12px">Savings goals</div>
        <div class="goals-list">
          <div class="goal-item" *ngFor="let g of goals">
            <div class="goal-header">
              <span class="goal-name">{{ g.emoji }} {{ g.name }}</span>
              <span class="goal-amounts mono">{{ fmt(g.savedAmount) }} / {{ fmt(g.targetAmount) }}</span>
            </div>
            <div class="goal-bar-bg">
              <div class="goal-bar" [style.width.%]="goalPct(g)"></div>
            </div>
            <div class="goal-pct">{{ goalPct(g) }}% complete</div>
          </div>
          <div *ngIf="!goals.length" class="empty">No goals yet. <a routerLink="/goals">Add one →</a></div>
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
    .nav-item { display:block; padding:10px 14px; border-radius:8px; color:#888; font-size:14px; text-decoration:none; transition:all 0.15s; }
    .nav-item:hover, .nav-item.active { background:#242424; color:#f0f0f0; }
    .sidebar-user { padding:16px 20px; border-top:1px solid #2e2e2e; }
    .user-name { font-size:13px; font-weight:500; }
    .user-email { font-size:12px; color:#888; margin-bottom:10px; }
    .logout-btn { width:100%; padding:7px; background:none; border:1px solid #2e2e2e; border-radius:7px; color:#888; font-size:12px; cursor:pointer; }
    .logout-btn:hover { color:#ef4444; border-color:#ef4444; }
    .main { flex:1; padding:24px 28px; overflow-y:auto; }
    .top-bar { display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; }
    .page-title { font-size:18px; font-weight:600; }
    .month-nav { display:flex; align-items:center; gap:8px; }
    .nav-btn { background:#1a1a1a; border:1px solid #2e2e2e; color:#888; padding:6px 12px; border-radius:8px; cursor:pointer; }
    .month-label { font-size:14px; font-weight:500; min-width:130px; text-align:center; font-family:monospace; color:#888; }
    .salary-bar { display:flex; align-items:center; gap:16px; background:#1a1a1a; border:1px solid #2e2e2e; border-radius:12px; padding:14px 18px; margin-bottom:16px; flex-wrap:wrap; }
    .salary-label { font-size:13px; color:#888; }
    .salary-input-wrap { display:flex; align-items:center; gap:6px; }
    .rupee { color:#888; font-size:15px; }
    .salary-input { background:#242424; border:1px solid #2e2e2e; border-radius:8px; color:#f0f0f0; font-size:15px; padding:7px 12px; width:160px; font-family:monospace; }
    .salary-input:focus { outline:none; border-color:#3b82f6; }
    .metrics { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; margin-bottom:16px; }
    .metric-card { background:#1a1a1a; border:1px solid #2e2e2e; border-radius:12px; padding:16px; }
    .metric-label { font-size:11px; color:#888; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:8px; }
    .metric-value { font-size:20px; font-weight:600; font-family:monospace; }
    .metric-value.blue { color:#3b82f6; } .metric-value.red { color:#ef4444; }
    .metric-value.green { color:#22c55e; } .metric-value.amber { color:#f59e0b; }
    .progress-card { background:#1a1a1a; border:1px solid #2e2e2e; border-radius:12px; padding:14px 18px; margin-bottom:16px; }
    .progress-header { display:flex; justify-content:space-between; font-size:13px; margin-bottom:10px; }
    .progress-bg { height:6px; background:#242424; border-radius:3px; overflow:hidden; }
    .progress-fill { height:6px; border-radius:3px; transition:width 0.4s; }
    .quick-add-card { background:#1a1a1a; border:1px solid #2e2e2e; border-radius:12px; padding:16px 18px; margin-bottom:20px; }
    .section-title { font-size:14px; font-weight:500; margin-bottom:10px; }
    .quick-form { display:flex; gap:8px; flex-wrap:wrap; margin-top:12px; }
    .fi { flex:1; min-width:120px; padding:8px 12px; background:#242424; border:1px solid #2e2e2e; border-radius:8px; color:#f0f0f0; font-size:13px; }
    .fi:focus { outline:none; border-color:#3b82f6; }
    .mono { font-family:monospace; }
    .add-btn { padding:8px 18px; background:#22c55e; border:none; border-radius:8px; color:#000; font-size:13px; font-weight:600; cursor:pointer; }
    .cat-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:10px; margin-bottom:8px; }
    .cat-card { background:#1a1a1a; border:1px solid #2e2e2e; border-radius:12px; padding:12px 14px; }
    .cat-header { display:flex; justify-content:space-between; margin-bottom:8px; }
    .cat-name { font-size:12px; font-weight:500; }
    .cat-total { font-size:13px; font-weight:600; font-family:monospace; color:#ef4444; }
    .cat-bar-bg { height:3px; background:#242424; border-radius:2px; margin-bottom:6px; }
    .cat-bar { height:3px; border-radius:2px; }
    .cat-meta { font-size:11px; color:#555; }
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
    .empty a { color:#3b82f6; text-decoration:none; }
    .goals-list { display:flex; flex-direction:column; gap:8px; }
    .goal-item { background:#1a1a1a; border:1px solid #2e2e2e; border-radius:10px; padding:12px 14px; }
    .goal-header { display:flex; justify-content:space-between; margin-bottom:8px; }
    .goal-name { font-size:13px; font-weight:500; }
    .goal-amounts { font-size:12px; color:#888; }
    .goal-bar-bg { height:4px; background:#242424; border-radius:2px; margin-bottom:5px; }
    .goal-bar { height:4px; border-radius:2px; background:#a855f7; }
    .goal-pct { font-size:11px; color:#555; }
    input[type='date']::-webkit-calendar-picker-indicator { filter:invert(0.5); }
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
  `]
})
export class DashboardComponent implements OnInit {
  user = this.auth.currentUser;
  salaryInput = this.user?.salary || 0;
  summary: MonthlySummary | null = null;
  recentExpenses: Expense[] = [];
  goals: Goal[] = [];
  categories = CATEGORIES;
  currentMonth = new Date().toISOString().slice(0, 7);
  newExp = { date: new Date().toISOString().slice(0, 10), category: 'Groceries', note: '', amount: null as any };

  get balance() { return (this.user?.salary || 0) - (this.summary?.totalSpent || 0); }
  get savingsPct() { const s = this.user?.salary || 0; return s > 0 ? Math.max(0, Math.round(this.balance / s * 100)) : 0; }
  get budgetPct() { const s = this.user?.salary || 0; return s > 0 ? Math.min(Math.round((this.summary?.totalSpent || 0) / s * 100), 100) : 0; }
  get monthLabel() {
    const [y, m] = this.currentMonth.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  constructor(private auth: AuthService, private expService: ExpenseService,
    private summaryService: SummaryService, private goalService: GoalService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    this.summaryService.getMonthlySummary(this.currentMonth).subscribe(s => this.summary = s);
    this.expService.getAll(this.currentMonth).subscribe(e => this.recentExpenses = e.slice(0, 10));
    this.goalService.getAll().subscribe(g => this.goals = g);
  }

  changeMonth(d: number) {
    let [y, m] = this.currentMonth.split('-').map(Number);
    m += d; if (m > 12) { m = 1; y++; } if (m < 1) { m = 12; y--; }
    this.currentMonth = y + '-' + String(m).padStart(2, '0');
    this.loadData();
  }

  updateSalary() { this.auth.updateSalary(this.salaryInput).subscribe(); }

  addExpense() {
    if (!this.newExp.amount || this.newExp.amount <= 0) return;
    this.expService.create(this.newExp).subscribe(() => { this.newExp.amount = null; this.loadData(); });
  }

  deleteExpense(id: string) {
    this.expService.delete(id).subscribe(() => this.loadData());
  }

  fmt(n: number) { return '₹' + Math.round(n).toLocaleString('en-IN'); }
  getColor(cat: string) { return CATEGORY_COLORS[cat] || '#888'; }
  catPct(total: number) { return this.summary?.totalSpent ? Math.round(total / this.summary.totalSpent * 100) : 0; }
  goalPct(g: Goal) { return Math.min(Math.round(g.savedAmount / g.targetAmount * 100), 100); }
  logout() { this.auth.logout(); }
}
