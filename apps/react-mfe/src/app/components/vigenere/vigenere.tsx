import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { IVigenereResponse, GO_VIGENERE_URL, TEXT_WITH_SPACES, KEY_NO_SPACES } from '@enc-vis-wasm-mfe/shared-types';

interface IVigenereProps {
  children?: React.ReactNode;
}

interface ICardInput {
  text: string;
  key: string;
  isByCodes: boolean;
}

export function Vigenere({ children }: IVigenereProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields, isValid },
  } = useForm<ICardInput>({
    mode: 'onChange',
    defaultValues: { text: '', key: '', isByCodes: false },
  });

  const isByCodes = watch('isByCodes');

  const [vigenereResults, setVigenereResults] = React.useState<Array<IVigenereResponse>>([]);

  useEffect(() => {
    initGoWASM();
  }, []);

  function getEncryptedWord(code: number): string {
    return String.fromCharCode(code);
  }

  function initGoWASM(): void {
    const go = new (window as any).Go();
    WebAssembly
      .instantiateStreaming(fetch(GO_VIGENERE_URL), go.importObject)
      .then((result: any) => {
        go.run(result.instance);
      });
  }

  const onSubmit = (data: ICardInput) => {
    const wasmResults = data.isByCodes
      ? (window as any).vigenereEncryptWithCodes(data.key, data.text)
      : (window as any).vigenereEncrypt(data.key, data.text);

    setVigenereResults(wasmResults);
  };

  const lastResult = vigenereResults[vigenereResults.length - 1]?.encryptedText ?? '';

  return (
    <div className="flex w-full h-full bg-base-300 p-2 gap-2">
      <form
        className="flex-initial self-start flex flex-col bg-base-100 shadow-sm p-2 gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        {children}
        <input
          className={`input ${touchedFields.text && errors.text ? 'input-error' : ''}`}
          placeholder="Input text"
          {...register('text', {
            required: true,
            pattern: TEXT_WITH_SPACES,
          })}
        />

        <input
          className={`input ${touchedFields.key && errors.key ? 'input-error' : ''}`}
          placeholder="Input key"
          {...register('key', {
            required: true,
            pattern: KEY_NO_SPACES,
          })}
        />

        <label className="label">
          <input
            className="toggle"
            type="checkbox"
            {...register('isByCodes')}
          />
          By character codes
        </label>

        <input className="input" placeholder="Result" value={lastResult} disabled />

        <button className="btn btn-primary" type="submit" disabled={!isValid}>
          Encode
        </button>
      </form>

      <div className="flex-1 overflow-y-auto">
        <table className="table table-xs bg-base-100 shadow-sm">
          <thead>
            <tr>
              <th>Step</th>
              <th>Letter</th>
              <th>Key's Letter</th>
              <th>Enc Letter</th>
              <th>Enc Text</th>
            </tr>
          </thead>
          <tbody>
            {vigenereResults.map((result, index) => (
              <tr className="hover:bg-base-200" key={index}>
                <td>Step {index}</td>
                <td>{result.originalLetter.word}({result.originalLetter.number})</td>
                <td>{result.keyLetter.word}({result.keyLetter.number})</td>
                <td>
                  {isByCodes
                    ? getEncryptedWord(result.encryptedLetter.number)
                    : result.encryptedLetter.word}
                  ({result.encryptedLetter.number})
                </td>
                <td>{result.encryptedText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Vigenere;