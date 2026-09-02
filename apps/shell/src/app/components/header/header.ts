import { Component, output, signal } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { form, FormField, required } from '@angular/forms/signals';

import { Frameworks, Encryptions, IAddCardConfig } from '../../models';

@Component({
  selector: 'enc-vis-shell-header',
  imports: [KeyValuePipe, FormsModule, FormField],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  cardChoosen = output<IAddCardConfig>();

  frameworks = Frameworks;
  encryptions = Encryptions;

  cardConfigModel = signal<IAddCardConfig>({
    framework: Frameworks.None,
    encryption: Encryptions.None,
  });

  cardConfigForm = form(this.cardConfigModel, (schemaPath) => {
    required(schemaPath.framework);
    required(schemaPath.encryption);
  });

  addAlgorithm(): void {
    this.cardChoosen.emit(this.cardConfigModel());

    this.cardConfigModel.set({
      framework: Frameworks.None,
      encryption: Encryptions.None,
    });
  }
}
