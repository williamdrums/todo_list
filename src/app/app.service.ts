import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from 'src/models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  baseUrl = 'http://localhost:8080/todo-list';

  constructor(private http: HttpClient) { }

  create(todo: Todo): Observable<Todo> {
    return this.http.post<Todo>(this.baseUrl, todo);
  }

  findAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  findById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/${id}`);
  }

  update(todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.baseUrl}/` + todo.id, todo);
  }

  delete(id: number): Observable<Todo> {
    return this.http.delete<Todo>(`${this.baseUrl}/` + id);
  }
}
