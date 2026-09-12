import React, { useEffect, useState } from 'react';
import { useForm, useStore } from '@tanstack/react-form';

import { IHuffmanResult, GO_HUFFMAN_URL, TEXT_WITH_SPACES } from '@enc-vis-wasm-mfe/shared-types';

interface IHuffmanProps {
  children?: React.ReactNode;
}

interface ICardInput {
  text: string;
}

export function Huffman({ children }: IHuffmanProps) {
  const [huffmanResults, setHuffmanResults] = useState<IHuffmanResult>({} as IHuffmanResult);
  const [result, setResult] = useState('');

  const form = useForm({
    defaultValues: { text: '' } as ICardInput,
    onSubmit: ({ value }) => {
      encode(value);
    },
  });

  useEffect(() => {
    initGoWASM();
  }, []);

  function initGoWASM(): void {
    const go = new (window as any).Go();

    WebAssembly
      .instantiateStreaming(fetch(GO_HUFFMAN_URL), go.importObject)
      .then((res: any) => {
        go.run(res.instance);
      });
  }

  function encode(data: ICardInput): void {
    const wasmResults = (window as any).huffmanEncrypt(data.text);
    setHuffmanResults(wasmResults);
    setResult(wasmResults.result);
  }

  return (
    <div className="flex flex-col w-full h-full bg-base-300 p-2 gap-4">
      <div className="flex gap-2 min-h-0 flex-1">
        <form
          className="flex-initial flex flex-col bg-base-100 shadow-sm p-2 gap-3 max-h-full"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {children}

          <form.Field
            name="text"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'required';
                if (!TEXT_WITH_SPACES.test(value)) return 'pattern';
                return undefined;
              },
            }}
          >
            {(field) => (
              <input
                className={`input w-full ${field.state.meta.isDirty && field.state.meta.errors.length ? 'input-error' : ''}`}
                placeholder="Input text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>

          <input className="input w-full" placeholder="Result" value={result} disabled />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting, state.isPristine] as const}
          >
            {([canSubmit, isSubmitting, isPristine]) => (
              <button
                className="btn btn-primary w-full"
                type="submit"
                disabled={isPristine || !canSubmit || isSubmitting}
              >
                Encode
              </button>
            )}
          </form.Subscribe>
        </form>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <table className="table table-xs bg-base-100 shadow-sm">
            <thead>
              <tr>
                <th>Letter</th>
                <th>Frequency</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {huffmanResults.table?.map((row, index) => (
                <tr className="hover:bg-base-200" key={index}>
                  <td>{row.id}</td>
                  <td>{row.freq}</td>
                  <td>{row.isLeaf ? row.code : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-auto">
        <table className="table table-xs bg-base-100 shadow-sm">
          <thead>
            <tr>
              <th>Step</th>
              <th>Letter</th>
              <th>Code</th>
              <th>Enc Text</th>
            </tr>
          </thead>
          <tbody>
            {huffmanResults.steps?.map((row, index) => (
              <tr className="hover:bg-base-200" key={index}>
                <td>Step {index}</td>
                <td>{row.symbol}</td>
                <td>{row.code}</td>
                <td>{row.text}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Huffman;