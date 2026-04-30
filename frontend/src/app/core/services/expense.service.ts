import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Expense } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getAll(month?: string): Observable<Expense[]> {
    let params = new HttpParams();
    if (month) params = params.set('month', month);
    return this.http.get<Expense[]>(this.apiUrl, { params });
  }

  create(expense: Partial<Expense>): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, expense);
  }

  update(id: string, expense: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
