import { Component, signal } from '@angular/core';
import { form, FormField, required, pattern, submit, disabled } from '@angular/forms/signals';

import { IHuffmanResult, GO_HUFFMAN_URL, TEXT_WITH_SPACES } from '@enc-vis-wasm-mfe/shared-types';

interface ICardInput {
  text: string;
  result: string;
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
    result: ''
  });

  cardInputForm = form(this.cardInputModel, (schemaPath) => {
    required(schemaPath.text);
    pattern(schemaPath.text, TEXT_WITH_SPACES);
    disabled(schemaPath.result);
  });

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
    const wasmResult = (window as any).huffmanEncrypt(this.cardInputForm.text().value());
    this.huffmanResults.set(wasmResult);
    this.cardInputModel.update((value: ICardInput) => ({...value, result: wasmResult.result}));
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
