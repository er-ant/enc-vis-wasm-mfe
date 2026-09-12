import { Component, input, signal } from '@angular/core';
import { form, FormField, required, pattern, min, validate, submit } from '@angular/forms/signals';

import { IHuffmanResult, GO_HUFFMAN_URL } from '@enc-vis-wasm-mfe/shared-types';

interface ICardInput {
  text: string;
}

@Component({
  selector: 'enc-vis-ng-mfe-huffman',
  imports: [FormField],
  templateUrl: './huffman.html',
  styleUrl: './huffman.scss',
  host: {
    'class': 'flex flex-col w-full h-full bg-base-300 p-2 gap-4',
  }
})
export class Huffman {

  huffmanResults = signal<IHuffmanResult>({} as IHuffmanResult);

  cardInputModel = signal<ICardInput>({
    text: '',
  });

  cardInputForm = form(this.cardInputModel, (schemaPath) => {
    required(schemaPath.text);
    pattern(schemaPath.text, /^[A-Za-z]+(?:\s[A-Za-z]+)*$/);
  });

  result = '';

  constructor() {
    this.initGoWASM();
  }

  onSubmit($event: Event): void {
    $event.preventDefault();

    submit(this.cardInputForm, async () => {
      this.encode();
    });
  }

  private encode(): void {
    this.huffmanResults.set((window as any).huffmanEncrypt(this.cardInputForm.text().value()));
    this.result = this.huffmanResults().result;
  }

  private initGoWASM(): void {
    const go = new (window as any).Go();

    WebAssembly
      .instantiateStreaming(fetch(GO_HUFFMAN_URL), go.importObject)
      .then(
        (result: any) => {
          // functions from WASM are available after go.run()
          go.run(result.instance);
        }
      );
  }
}
