import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';

@Component({
  imports: [RouterModule],
  selector: 'enc-vis-ng-mfe-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  algorithm = input.required<Encryptions>();

  onClose = output<boolean>();
}
