import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen">
      <header class="border-b border-slate-200 bg-white">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 class="text-xl font-bold text-brand-700">Aether Finance</h1>
          <nav class="flex items-center gap-4 text-sm">
            <a routerLink="/dashboard" class="font-medium text-brand-600">Dashboard</a>
            <a routerLink="/transactions" class="text-slate-600 hover:text-brand-600">Transactions</a>
            <button (click)="auth.logout()" class="text-slate-500 hover:text-red-600">Logout</button>
          </nav>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 py-8">
        <h2 class="text-2xl font-semibold">Welcome{{ auth.user()?.name ? ', ' + auth.user()!.name : '' }}</h2>
        <p class="mt-1 text-slate-500">Here's your financial overview</p>

        <div class="mt-8 grid gap-6 sm:grid-cols-3">
          <div class="card">
            <p class="text-sm font-medium text-slate-500">Total Income</p>
            <p class="mt-2 text-3xl font-bold text-emerald-600">{{ summary()?.totalIncome | number:'1.2-2' }}</p>
          </div>
          <div class="card">
            <p class="text-sm font-medium text-slate-500">Total Expenses</p>
            <p class="mt-2 text-3xl font-bold text-red-600">{{ summary()?.totalExpense | number:'1.2-2' }}</p>
          </div>
          <div class="card">
            <p class="text-sm font-medium text-slate-500">Balance</p>
            <p class="mt-2 text-3xl font-bold" [class.text-emerald-600]="(summary()?.balance ?? 0) >= 0" [class.text-red-600]="(summary()?.balance ?? 0) < 0">
              {{ summary()?.balance | number:'1.2-2' }}
            </p>
          </div>
        </div>

        <div class="mt-8">
          <a routerLink="/transactions" class="btn-primary">Manage transactions</a>
        </div>
      </main>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  summary = signal<{ totalIncome: number; totalExpense: number; balance: number } | null>(null);

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/transactions/summary`).subscribe({
      next: (data) => this.summary.set(data),
      error: () => this.summary.set({ totalIncome: 0, totalExpense: 0, balance: 0 }),
    });
  }
}
