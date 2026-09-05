import { Component, input } from '@angular/core';

import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';

@Component({
  selector: 'enc-vis-ng-mfe-cesar',
  templateUrl: './cesar.html',
  styleUrl: './cesar.scss',
  host: {
    'class': 'flex w-full h-full bg-base-300 p-2 gap-2',
  }
})
export class Cesar {
  algorithm = input.required<Encryptions>();

  encryptions = Encryptions;
}
