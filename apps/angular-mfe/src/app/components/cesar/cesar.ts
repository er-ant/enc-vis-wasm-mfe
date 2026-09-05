import { Component, input } from '@angular/core';

import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';

@Component({
  selector: 'enc-vis-ng-mfe-cesar',
  imports: [],
  templateUrl: './cesar.html',
  styleUrl: './cesar.scss',
})
export class Cesar {
  algorithm = input.required<Encryptions>();

  encryptions = Encryptions;
}
