import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../enviroment';
import id from '@angular/common/locales/id';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {}
  
  getTasks(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/getTasks`) ;
  }
  getTaskById(): Observable<any> {
    return this.http.get(`${environment.baseUrl}/getTaskById${id}`) ;
  }

  addTask(description: string): Observable<any> {
    return this.http.post(`${environment.baseUrl}/createTask`, { description });
  }

  updateTask(id: string, done: boolean): Observable<any> {
    return this.http.patch(`${environment.baseUrl}/updateTask${id}`, { done });
  }

  deleteTask(id: string): Observable<any> {
    return this.http.delete(`${environment.baseUrl}/deleteTask${id}`);
  }
}
