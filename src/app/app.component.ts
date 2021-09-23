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
  public title2: string = 'Minhas Tarefas';
  public form: FormGroup;
  public todo!: Todo;
  public isInvalid: boolean = false;
  public id !: number;


  constructor(private formBuilder: FormBuilder, private todoService: AppService, private route: ActivatedRoute,
    private router: Router) {

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
    this.id = this.route.snapshot.params['id'];
    this.todo = new Todo(this.id, "", false);
    if (this.id != -1) {
      this.todoService.findById(this.id).subscribe(
        response => { this.todo = response }
      );
    }
  }

  addTodo(todoForm: any) {
    if (todoForm.invalid) {
      this.isInvalid = true;
    } else {
      this.isInvalid = false;
    }

    if (this.id == undefined) {
      this.todoService.create(this.todo).subscribe((data: any) => {
        console.log(data);
        this.load();
      });
    } else {
      this.todoService.update(this.todo).subscribe((data: any) => {
        console.log(data);
        this.load();
        this.clear();
      });
    }
  }

  clear() {
    this.form.reset();
  }

  remove(todo: Todo) {
    this.todoService.delete(todo.id!).subscribe(data => {
      this.load();
    });
  }

  markAsDone(todo: Todo) {
    todo.done = true;
    this.todo = todo;
    this.todoService.update(this.todo).subscribe((data: any) => {
      console.log(data);
    });
  }

  markAsUndone(todo: Todo) {
    todo.done = false;
    this.todo = todo;
    this.todoService.update(this.todo).subscribe((data: any) => {
      console.log(data);
    });
  }

  load() {
    this.todoService.findAll().subscribe(
      response => {
        console.log(response);
        this.todos = response;
      }
    );
  }

  setForm(todo: Todo) {
    this.form.patchValue({ title: todo.title });
    this.todo = todo;
  }
}
