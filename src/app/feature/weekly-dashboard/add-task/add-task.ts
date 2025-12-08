import {Component, signal} from '@angular/core';
import {Field, form} from '@angular/forms/signals';

export interface Task {
  name: string;
  type: 'duration' | 'count' | 'sum' ;
  goal: string;
}

@Component({
  selector: 'app-add-task',
  imports: [
    Field
  ],
  templateUrl: './add-task.html',
  styleUrl: './add-task.scss',
})
export class AddTask {
  private taskModel = signal<Task>({
    name: '',
    type: 'sum',
    goal: '',
  });

  public taskForm = form(this.taskModel);

  public submitTask(event: Event) {
    event.preventDefault();
    console.log(this.taskForm().value());
  }
}
