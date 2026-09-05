import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';

import { Cesar } from './components/cesar/cesar';
import { Vigenere } from './components/vigenere/vigenere';

@Component({
  imports: [RouterModule, Cesar, Vigenere],
  selector: 'enc-vis-ng-mfe-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  algorithm = input.required<Encryptions>();
  encryptions = Encryptions;

  onClose = output<boolean>();
}
