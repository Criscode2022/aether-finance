import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/auth.service';
import { environment } from '../../../environments/environment';

interface Transaction {
  id: string;
  amount: string | number;
  type: 'INCOME' | 'EXPENSE';
  description?: string;
  date: string;
  category?: { name: string; color: string } | null;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen">
      <header class="border-b border-slate-200 bg-white">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <h1 class="text-xl font-bold text-brand-700">Aether Finance</h1>
          <nav class="flex items-center gap-4 text-sm">
            <a routerLink="/dashboard" class="text-slate-600 hover:text-brand-600">Dashboard</a>
            <a routerLink="/transactions" class="font-medium text-brand-600">Transactions</a>
            <button (click)="auth.logout()" class="text-slate-500 hover:text-red-600">Logout</button>
          </nav>
        </div>
      </header>

      <main class="mx-auto max-w-6xl px-4 py-8">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold">Transactions</h2>
          <button (click)="showForm.set(!showForm())" class="btn-primary">
            {{ showForm() ? 'Cancel' : 'Add transaction' }}
          </button>
        </div>

        @if (showForm()) {
          <form (ngSubmit)="create()" class="card mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium">Amount</label>
              <input type="number" step="0.01" [(ngModel)]="form.amount" name="amount" required class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div>
              <label class="block text-sm font-medium">Type</label>
              <select [(ngModel)]="form.type" name="type" class="mt-1 w-full rounded-lg border px-3 py-2">
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium">Description</label>
              <input type="text" [(ngModel)]="form.description" name="description" class="mt-1 w-full rounded-lg border px-3 py-2" />
            </div>
            <div class="sm:col-span-2">
              <button type="submit" class="btn-primary">Save</button>
            </div>
          </form>
        }

        <div class="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Date</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Description</th>
                <th class="px-4 py-3 text-left text-xs font-medium uppercase text-slate-500">Type</th>
                <th class="px-4 py-3 text-right text-xs font-medium uppercase text-slate-500">Amount</th>
                <th class="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (tx of transactions(); track tx.id) {
                <tr>
                  <td class="px-4 py-3 text-sm text-slate-600">{{ tx.date | date:'mediumDate' }}</td>
                  <td class="px-4 py-3 text-sm">{{ tx.description || '—' }}</td>
                  <td class="px-4 py-3">
                    <span
                      class="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                      [class.bg-emerald-100]="tx.type === 'INCOME'"
                      [class.text-emerald-800]="tx.type === 'INCOME'"
                      [class.bg-red-100]="tx.type === 'EXPENSE'"
                      [class.text-red-800]="tx.type === 'EXPENSE'"
                    >{{ tx.type }}</span>
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-medium" [class.text-emerald-600]="tx.type === 'INCOME'" [class.text-red-600]="tx.type === 'EXPENSE'">
                    {{ tx.type === 'INCOME' ? '+' : '-' }}{{ tx.amount | number:'1.2-2' }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <button (click)="remove(tx.id)" class="text-xs text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="px-4 py-8 text-center text-sm text-slate-400">No transactions yet</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  `,
})
export class TransactionsComponent implements OnInit {
  transactions = signal<Transaction[]>([]);
  showForm = signal(false);
  form = { amount: 0, type: 'EXPENSE' as 'INCOME' | 'EXPENSE', description: '' };

  constructor(public auth: AuthService, private http: HttpClient) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.http.get<Transaction[]>(`${environment.apiUrl}/transactions`).subscribe({
      next: (data) => this.transactions.set(data),
    });
  }

  create() {
    this.http.post(`${environment.apiUrl}/transactions`, this.form).subscribe({
      next: () => {
        this.showForm.set(false);
        this.form = { amount: 0, type: 'EXPENSE', description: '' };
        this.load();
      },
    });
  }

  remove(id: string) {
    this.http.delete(`${environment.apiUrl}/transactions/${id}`).subscribe({
      next: () => this.load(),
    });
  }
}
