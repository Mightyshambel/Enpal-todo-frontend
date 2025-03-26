import { Component, inject, model, signal, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { TaskService } from '../../services/task.service';

interface ITodo {
  id: string;
  description: string;
  done: boolean;
}

@Component({
  selector: 'app-task-list',
  templateUrl: '../task-list/task-list.component.html',
  styleUrl: '../task-list/task-list.component.scss',
  imports: [
    MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatCardModule, MatCheckboxModule, FormsModule, CommonModule, MatDialogModule
  ]
})
export class TaskListComponent {
  todoList = signal<ITodo[]>([]);
  description = model('');
  selectedIndex: number = -1;
  taskService = inject(TaskService);
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadAllTasks();
  }

  loadAllTasks(): void {
    this.taskService.getTasks().subscribe((res: any) => {
      this.todoList.set(res.data);
    });
  }

  save(): void {
    if (!this.description().trim()) {
      return;
    }
    
    this.taskService.addTask(this.description()).subscribe((res: any) => {
      this.todoList.update(list => [...list, res.data]);
      this.description.set('');
    });
  }

  checkmarkChanged(index: number): void {
    const task = this.todoList()[index];
    this.taskService.updateTask(task.id, !task.done).subscribe(() => {
      this.todoList.update(list => {
        list[index].done = !task.done;
        return list;
      });
    });
  }

  deleteConfirmation(index: number): void {
    const task = this.todoList()[index];
    this.dialog.open(ConfirmationDialogComponent, { width: '250px' })
      .afterClosed().subscribe((res: any) => {
        if (res === 'YES') {
          this.taskService.deleteTask(task.id).subscribe(() => {
            this.todoList.update(list => list.filter((_, i) => i !== index));
          });
        }
      });
  }

  editItem(index: number, item: ITodo): void {
    this.selectedIndex = index;
    this.description.set(item.description);
  }

  updateItem(): void {
    if (this.selectedIndex >= 0) {
      const task = this.todoList()[this.selectedIndex];
      
      this.taskService.updateTask(task.id, task.done).subscribe(() => {
        this.todoList.update(list => {
          list[this.selectedIndex].description = this.description();
          return list;
        });
        this.description.set('');
        this.selectedIndex = -1;
      });
    }
  }
}
