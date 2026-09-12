import { Component, input, signal } from '@angular/core';
import { form, FormField, required, pattern, min, validate, submit } from '@angular/forms/signals';

import { Encryptions, ICesarResponse, ICesarWithKeyResponse, JAVA_CESAR_URL } from '@enc-vis-wasm-mfe/shared-types';

interface ICardInput {
  text: string;
  key: string;
  shift: number | null;
}

@Component({
  selector: 'enc-vis-ng-mfe-cesar',
  imports: [FormField],
  templateUrl: './cesar.html',
  styleUrl: './cesar.scss',
  host: {
    'class': 'flex w-full h-full bg-base-300 p-2 gap-2',
  }
})
export class Cesar {

  algorithm = input.required<Encryptions>();

  encryptions = Encryptions;

  cesarResults = signal<Array<ICesarResponse | ICesarWithKeyResponse>>([]);

  cardInputModel = signal<ICardInput>({
    text: '',
    key: '',
    shift: null
  });

  cardInputForm = form(this.cardInputModel, (schemaPath) => {
    required(schemaPath.text);
    pattern(schemaPath.text, /^[A-Za-z]+(?:\s[A-Za-z]+)*$/);
    pattern(schemaPath.key, /^[A-Za-z]+$/);
    min(schemaPath.shift, 0);
    validate(schemaPath.shift, ({ value }) => {
      if (this.algorithm() === this.encryptions.Cesar && !value()) {
        return { kind: 'required', message: 'Shift is required' };
      }
      return null;
    });
    validate(schemaPath.key, ({ value }) => {
      if (this.algorithm() !== this.encryptions.Cesar && !value()) {
        return { kind: 'required', message: 'Key is required' };
      }
      return null;
    });
  });

  result = '';

  private teavm: any;

  constructor() {
    this.initJavaWASM();
  }

  onSubmit($event: Event): void {
    $event.preventDefault();

    submit(this.cardInputForm, async () => {
      this.encode();
    });
  }

  private encode(): void {
    const wasmResults: Array<ICesarResponse | ICesarWithKeyResponse> = JSON.parse(this.algorithm() === this.encryptions.Cesar ?
      this.teavm.exports.cesarEncrypt(this.cardInputForm.shift().value(), this.cardInputForm.text().value()):
      this.teavm.exports.cesarWithKeyEncrypt(this.cardInputForm.key().value(), this.cardInputForm.text().value())
    );

    this.cesarResults.set(wasmResults);

    if (this.algorithm() === Encryptions.Cesar) {
      this.result = wasmResults[wasmResults.length - 1]?.encryptedText;
    } else {
      this.result = (wasmResults as any).encryptedText;
    }
  }

  private initJavaWASM(): void {
    const w = window as any;

    // Workaround to force TeaVM think he is in browser, not Node.JS
    // Otherwise it will use node:fs/promises instead of fetch in load
    const savedProcess = w.process;
    try {
      delete w.process;
    } catch {}

    w.TeaVM.wasmGC
      .load(JAVA_CESAR_URL)
      .then((teavm: any) => {
        this.teavm = teavm;
      })
      .catch((err: any) => console.error(err))
      .finally(() => {
        if (savedProcess !== undefined) {
          w.process = savedProcess;
        }
      });
  }
}
