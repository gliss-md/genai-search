import { Component } from '@angular/core';
import {AddTask} from './add-task/add-task';

@Component({
  selector: 'app-weekly-dashboard',
  imports: [
    AddTask
  ],
  templateUrl: './weekly-dashboard.html',
  styleUrl: './weekly-dashboard.css',
})
export class WeeklyDashboard {

}
