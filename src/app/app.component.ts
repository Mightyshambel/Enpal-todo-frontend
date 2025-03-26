import { Component, inject, OnInit } from '@angular/core';
import { TaskListComponent } from './task/components/task-list/task-list.component';
import { TaskService } from './task/services/task.service';

@Component({
  selector: 'app-root',
  imports: [TaskListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  title = 'enpal-angular';
}