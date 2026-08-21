import { Component } from '@angular/core';
import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'shell';
}
