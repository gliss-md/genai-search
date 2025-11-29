import { Component, inject } from '@angular/core';
import { SessionService } from '../../../domain/session-service/session.service';
import { RouterLink } from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-session-list',
  imports: [RouterLink, NgOptimizedImage],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.scss',
})
export class SessionListComponent {
  protected sessionService = inject(SessionService);
}
