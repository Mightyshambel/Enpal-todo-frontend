import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { TaskService } from '../../services/task.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

interface ITodo {
  id: string;
  description: string;
  done: boolean;
}

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule,
    MatCardModule, MatCheckboxModule, CommonModule, MatDialogModule,
    ReactiveFormsModule
  ]
})
export class TaskListComponent {
  todoList: ITodo[] = [];
  description = new FormControl('');
  selectedIndex: number = -1;

  constructor(private taskService: TaskService) {}
  dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadAllTasks();
  }

  loadAllTasks() {
    this.taskService.getTasks().subscribe({
      next: (data: ITodo[]) => this.todoList = data,
      error: (err) => console.error('Error loading tasks', err)
    });
  }

  save(): void {
    const taskDescription = this.description.value?.trim();
    if (!taskDescription) return;

    const newTask: ITodo = {
      id: crypto.randomUUID(),
      description: taskDescription,
      done: false
    };

    this.taskService.addTask(newTask).subscribe({
      next: (task) => {
        this.todoList.push(task);
        this.description.reset();
      },
      error: (err) => console.error('Save error:', err)
    });
  }

  checkmarkChanged(task: ITodo): void {
    this.taskService.updateTask(task).subscribe({
      next: () => task.done = !task.done,
      error: (err) => console.error('Update error:', err)
    });
  }

  deleteConfirmation(index: number): void {
    const task = this.todoList[index];
    this.dialog.open(ConfirmationDialogComponent, { width: '250px' })
      .afterClosed().subscribe((res: any) => {
        if (res === 'YES') {
          this.taskService.deleteTask(task.id).subscribe({
            next: () => this.todoList.splice(index, 1),
            error: (err) => console.error('Delete error:', err)
          });
        }
      });
  }

  editItem(index: number, item: ITodo): void {
    this.selectedIndex = index;
    this.description.setValue(item.description);
  }

  updateItem(): void {
    if (this.selectedIndex >= 0) {
      const updatedDescription = this.description.value?.trim();
      if (!updatedDescription) return;
  
      const originalTask = this.todoList[this.selectedIndex];
      
      // Create update payload
      const updatePayload = {
        ...originalTask,
        description: updatedDescription
      };
  
      this.taskService.updateTask(updatePayload).subscribe({
        next: (updatedTask) => {
          this.todoList[this.selectedIndex] = updatedTask;
          this.description.reset();
          this.selectedIndex = -1;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.todoList[this.selectedIndex] = originalTask;
        }
      });
    }
  }
}