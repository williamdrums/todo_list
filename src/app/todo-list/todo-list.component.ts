import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Todo } from 'src/models/todo.model';
import { AppService } from '../app.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {

  public mode = 'list';
  public todos: Todo[] = [];
  public titleApp: string = 'Minhas Tarefas';
  public form: FormGroup;
  public todo!: Todo;


  constructor(private formBuilder: FormBuilder, private todoService: AppService, private toastr: ToastrService) {

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
        this.toastr.success('Tarefa Cadastrada!')
        this.mode = 'list';
        this.load();
        this.clear();
      });
    } else {
      this.update(this.todo);
    }
  }

  update(todo: Todo) {
    this.todoService.update(this.todo!).subscribe((response: any) => {

      this.toastr.success('Tarefa Atualizada!')
      //resetando objeto 
      this.todo = { id: undefined, title: '', done: false };
      this.load();
      this.clear();
    });
  }

  remove(todo: Todo) {
    this.todoService.delete(todo.id!).subscribe(response => {
      this.toastr.success('Tarefa Excluida com sucesso!')
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

  clear() {
    this.form.reset();
  }

  changeMode(mode: string) {
    this.mode = mode;
  }

}
