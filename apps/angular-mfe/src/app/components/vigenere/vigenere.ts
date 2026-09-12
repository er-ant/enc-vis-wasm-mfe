import { Component, signal } from '@angular/core';
import { form, FormField, required, pattern, submit } from '@angular/forms/signals';

import { IVigenereResponse, GO_VIGENERE_URL } from '@enc-vis-wasm-mfe/shared-types';

interface ICardInput {
  text: string;
  key: string;
  isByCodes: boolean;
}

@Component({
  selector: 'enc-vis-ng-mfe-vigenere',
  imports: [FormField],
  templateUrl: './vigenere.html',
  styleUrl: './vigenere.scss',
  host: {
    'class': 'flex w-full h-full bg-base-300 p-2 gap-2',
  }
})
export class Vigenere {

  vigenereResults = signal<Array<IVigenereResponse>>([]);

  cardInputModel = signal<ICardInput>({
    text: '',
    key: '',
    isByCodes: false
  });

  cardInputForm = form(this.cardInputModel, (schemaPath) => {
    required(schemaPath.text);
    pattern(schemaPath.text, /^[A-Za-z]+$/);
    required(schemaPath.key);
    pattern(schemaPath.key, /^[A-Za-z]+$/);
  });

  constructor() {
    this.initGoWASM();
  }

  getEncryptedWord(code: number): string {
    return String.fromCharCode(code);
  }

  onSubmit($event: Event): void {
    $event.preventDefault();

    submit(this.cardInputForm, async () => {
      this.encode();
    });
  }

  private encode(): void {
    this.vigenereResults.set(this.cardInputForm.isByCodes().value() ?
      (window as any).vigenereEncryptWithCodes(this.cardInputForm.key().value(), this.cardInputForm.text().value()):
      (window as any).vigenereEncrypt(this.cardInputForm.key().value(), this.cardInputForm.text().value())
    );
  }

  private initGoWASM(): void {
    const go = new (window as any).Go();

    WebAssembly
      .instantiateStreaming(fetch(GO_VIGENERE_URL), go.importObject)
      .then(
        (result: any) => {
          // functions from WASM are available after go.run()
          go.run(result.instance);
        }
      );
  }
}
