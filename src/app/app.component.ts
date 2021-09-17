import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from 'src/models/todo.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos: Todo[] = [];
  public title: string = 'Minhas Tarefas';
  public form: FormGroup;
  public todo!: Todo;

  constructor(private formBuilder: FormBuilder) {

    this.form = this.formBuilder.group({
      title: ['', Validators.compose([
        Validators.minLength(3),
        Validators.maxLength(60),
        Validators.required
      ])]
    });

    this.load();
  }

  add() {
    const title = this.form.controls['title'].value;
    const index = this.todos.indexOf(this.todo)
  
    if (index == -1) {
      const id = this.todos.length + 1;
      this.todos.push(new Todo(id, title, false));
      this.save();
      this.clear();
    } else {
      this.todos[index].title = title;
      this.save();
      this.clear();
    }
  }

  clear() {
    this.form.reset();
  }

  remove(todo: Todo) {
    const index = this.todos.indexOf(todo);
    if (index !== -1) {
      //deletar item(indice e 1 quantidade a ser deletado)
      this.todos.splice(index, 1);
    }
    this.save();
  }

  markAsDone(todo: Todo) {
    todo.done = true;
    this.save();
  }

  markAsUndone(todo: Todo) {
    todo.done = false;
    this.save();
  }

  save() {
    //convertendo JSON pra string
    const data = JSON.stringify(this.todos);
    localStorage.setItem('todos', data);
  }

  load() {
    const data = localStorage.getItem('todos');
    //convertentdo os dados pra json
    this.todos = JSON.parse(data!);
  }

  update(todo: Todo) {
    this.form.patchValue({ title: todo.title });
    this.todo = todo;
  }
}
