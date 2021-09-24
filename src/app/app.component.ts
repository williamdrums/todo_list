import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from 'src/models/todo.model';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public todos: Todo[] = [];
  public titleApp: string = 'Minhas Tarefas';
  public form: FormGroup;
  public todo!: Todo;


  constructor(private formBuilder: FormBuilder, private todoService: AppService) {

    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.required
      ])]
    });
    this.load();
  }

  ngOnInit(): void {
    this.todo = new Todo();
  }

  addTodo() {
    this.todo.title = this.form.controls['title'].value;
    this.todo.done = false;

    if (!this.todo.id) {
      this.todoService.create(this.todo!).subscribe((response: any) => {
        this.load();
        this.clear();
      });
    } else {
      this.update(this.todo);
    }
  }

  update(todo: Todo) {
    this.todoService.update(this.todo!).subscribe((response: any) => {
      //resetando objeto 
      this.todo = { id: undefined, title: '', done: false };
      this.load();
      this.clear();
    });
  }

  clear() {
    this.form.reset();
  }

  remove(todo: Todo) {
    this.todoService.delete(todo.id!).subscribe(response => {
      this.load();
    });
  }

  markAsDone(todo: Todo) {
    todo.done = true;
    this.todo = todo;
    this.update(this.todo);
  }

  markAsUndone(todo: Todo) {
    todo.done = false;
    this.todo = todo;
    this.update(this.todo);
  }

  load() {
    this.todoService.findAll().subscribe(
      response => {
        this.todos = response;
      }
    );
  }

  setForm(todo: Todo) {
    this.form.patchValue({ title: todo.title });
    this.todo = todo;
  }
}
