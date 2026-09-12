import React, { useEffect, useRef, useState } from 'react';
import { useForm } from '@tanstack/react-form';

import { Encryptions, ICesarResponse, ICesarWithKeyResponse, JAVA_CESAR_URL, TEXT_WITH_SPACES, KEY_NO_SPACES } from '@enc-vis-wasm-mfe/shared-types';

interface ICesarProps {
  algorithm: Encryptions;
  children?: React.ReactNode;
}

interface ICardInput {
  text: string;
  key: string;
  shift: number | null;
}

export function Cesar({ algorithm, children }: ICesarProps) {
  const [cesarResults, setCesarResults] = useState<Array<ICesarResponse | ICesarWithKeyResponse>>([]);
  const [result, setResult] = useState('');
  const teavm = useRef<any | null>(null);

  const form = useForm({
    defaultValues: {
      text: '',
      key: '',
      shift: null,
    } as ICardInput,
    onSubmit: ({ value }) => {
      encode(value);
    },
  });

  useEffect(() => {
    initJavaWASM();
  }, []);

  function initJavaWASM(): void {
    const w = window as any;

    // Workaround to force TeaVM think he is in browser, not Node.JS
    // Otherwise it will use node:fs/promises instead of fetch in load
    const savedProcess = w.process;
    try {
      delete w.process;
    } catch {}

    w.TeaVM.wasmGC
      .load(JAVA_CESAR_URL)
      .then((teavmWasm: any) => {
        teavm.current = teavmWasm;
      })
      .catch((err: any) => console.error(err))
      .finally(() => {
        if (savedProcess !== undefined) {
          w.process = savedProcess;
        }
      });
  }

  function encode(data: ICardInput): void {
    const wasmResults: Array<ICesarResponse | ICesarWithKeyResponse> =
      JSON.parse(algorithm === Encryptions.Cesar ?
        teavm.current!.exports.cesarEncrypt(data.shift, data.text) :
        teavm.current!.exports.cesarWithKeyEncrypt(data.key, data.text)
      );
    setCesarResults(wasmResults);

    if (algorithm === Encryptions.Cesar) {
      setResult(wasmResults[wasmResults.length - 1]?.encryptedText);
    } else {
      setResult((wasmResults as any).encryptedText);
    }
  }

  const isCesar = algorithm === Encryptions.Cesar;

  return (
    <div className="flex w-full h-full bg-base-300 p-2 gap-2">
      <form
        className={`self-start flex flex-col bg-base-100 shadow-sm p-2 gap-3
          ${algorithm === Encryptions.CesarKey ? 'flex-1' : isCesar ? 'flex-initial' : ''}`}
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

        {isCesar && (
          <form.Field
            name="shift"
            validators={{
              onChange: ({ value }) => {
                if (value === null || value === undefined) return 'Shift is required';
                if (value < 0) return 'min';
                return undefined;
              },
            }}
          >
            {(field) => (
              <input
                className={`input w-full ${field.state.meta.isDirty && field.state.meta.errors.length ? 'input-error' : ''}`}
                placeholder="Shift"
                type="number"
                min={0}
                value={field.state.value ?? ''}
                onChange={(e) =>
                  field.handleChange(e.target.value === '' ? null : Number(e.target.value))
                }
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>
        )}

        {!isCesar && (
          <form.Field
            name="key"
            validators={{
              onChange: ({ value }) => {
                if (!value) return 'required';
                if (!KEY_NO_SPACES.test(value)) return 'pattern';
                return undefined;
              },
            }}
          >
            {(field) => (
              <input
                className={`input w-full ${field.state.meta.isDirty && field.state.meta.errors.length ? 'input-error' : ''}`}
                placeholder="Input key"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
              />
            )}
          </form.Field>
        )}

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

      {isCesar && (
        <div className="flex-1 overflow-y-auto">
          <table className="table table-xs bg-base-100 shadow-sm">
            <thead>
              <tr>
                <th>Step</th>
                <th>Text</th>
              </tr>
            </thead>
            <tbody>
              {cesarResults.map((row, index) => (
                <tr className="hover:bg-base-200" key={index}>
                  <td>Step {index}</td>
                  <td>{row.encryptedText}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Cesar;