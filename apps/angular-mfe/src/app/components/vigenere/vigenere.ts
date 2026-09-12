import { Component, signal } from '@angular/core';
import { form, FormField, required, pattern, submit, disabled } from '@angular/forms/signals';

import { IVigenereResponse, GO_VIGENERE_URL, TEXT_WITH_SPACES, KEY_NO_SPACES } from '@enc-vis-wasm-mfe/shared-types';

interface ICardInput {
  text: string;
  key: string;
  isByCodes: boolean;
  result: string;
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
    isByCodes: false,
    result: ''
  });

  cardInputForm = form(this.cardInputModel, (schemaPath) => {
    required(schemaPath.text);
    pattern(schemaPath.text, TEXT_WITH_SPACES);
    required(schemaPath.key);
    pattern(schemaPath.key, KEY_NO_SPACES);
    disabled(schemaPath.result);
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
    const wasmResult = this.cardInputForm.isByCodes().value() ?
      (window as any).vigenereEncryptWithCodes(this.cardInputForm.key().value(), this.cardInputForm.text().value()):
      (window as any).vigenereEncrypt(this.cardInputForm.key().value(), this.cardInputForm.text().value());
    this.vigenereResults.set(wasmResult);
    this.cardInputModel.update((value: ICardInput) => ({...value, result: wasmResult[wasmResult.length - 1]?.encryptedText}));
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
