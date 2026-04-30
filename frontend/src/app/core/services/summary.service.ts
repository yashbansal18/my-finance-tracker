import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MonthlySummary, TrendData } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class SummaryService {
  private apiUrl = `${environment.apiUrl}/summary`;

  constructor(private http: HttpClient) {}

  getMonthlySummary(month: string): Observable<MonthlySummary> {
    return this.http.get<MonthlySummary>(`${this.apiUrl}/monthly`, { params: new HttpParams().set('month', month) });
  }

  getTrend(): Observable<TrendData[]> {
    return this.http.get<TrendData[]>(`${this.apiUrl}/trend`);
  }
}
