import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment';
import id from '@angular/common/locales/id';

interface ITodo {
  id: string;
  description: string;
  done: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {}
  
  getTasks(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${environment.baseUrl}/task`) ;
  }
  getTaskById(): Observable<ITodo[]> {
    return this.http.get<ITodo[]>(`${environment.baseUrl}/task/${id}`) ;
  }

  addTask(task: ITodo): Observable<ITodo> {
    return this.http.post<ITodo>(`${environment.baseUrl}/task`, task)
  }

  updateTask(task: ITodo): Observable<ITodo> {
    const updateData = {
      description: task.description,
      done: task.done
    };
    
    return this.http.patch<ITodo>(
      `${environment.baseUrl}/task/${task.id}`,
      updateData
    );
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.baseUrl}/task/${id}`);
  }
}
