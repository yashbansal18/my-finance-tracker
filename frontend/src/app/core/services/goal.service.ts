import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Goal } from '../../shared/models/models';

@Injectable({ providedIn: 'root' })
export class GoalService {
  private apiUrl = `${environment.apiUrl}/goals`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Goal[]> { return this.http.get<Goal[]>(this.apiUrl); }

  create(goal: Partial<Goal>): Observable<Goal> { return this.http.post<Goal>(this.apiUrl, goal); }

  update(id: string, goal: Partial<Goal>): Observable<Goal> {
    return this.http.put<Goal>(`${this.apiUrl}/${id}`, goal);
  }

  delete(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}
