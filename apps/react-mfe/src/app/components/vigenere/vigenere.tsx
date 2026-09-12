// import styles from './vigenere.module.scss';
import React, { useEffect, useState } from 'react';

import { IVigenereResponse } from '@enc-vis-wasm-mfe/shared-types';

interface IVigenereProps {
  children?: React.ReactNode;
}

export function Vigenere({ children }: IVigenereProps) {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [isByCodes, setIsByCodes] = useState(false);
  const [result, setResult] = useState('');
  const [vigenereResults, setVigenereResults] = useState<Array<IVigenereResponse>>([]);

  useEffect(() => {
    initGoWASM();
  }, []);

  function getEncryptedWord(code: number): string {
    return String.fromCharCode(code);
  }

  function initGoWASM(): void {
    const go = new (window as any).Go();

    WebAssembly
      .instantiateStreaming(fetch('/assets/wasm/go_vigenere/vigenere_go.wasm'), go.importObject)
      .then(
        (result: any) => {
          // functions from WASM are available after go.run()
          go.run(result.instance);
        }
      );
  }

  function encode(): void {
    const wasmResults = isByCodes ?
      (window as any).vigenereEncryptWithCodes(key, input):
      (window as any).vigenereEncrypt(key, input);

    setResult(wasmResults[wasmResults.length - 1]?.encryptedText)
    setVigenereResults(wasmResults);
  }

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    encode();
  }

  return (
    <div className="flex w-full h-full bg-base-300 p-2 gap-2">
      <form className="flex-initial self-start flex flex-col bg-base-100 shadow-sm p-2 gap-3" onSubmit={handleSubmit}>
        {children}
        <input className="input" placeholder="Input text" value={input} onChange={e => setInput(e.target.value)}/>
        <input className="input" placeholder="Input key" value={key} onChange={e => setKey(e.target.value)}/>
        <label className="label">
          <input className="toggle" type="checkbox" checked={isByCodes} onChange={e => setIsByCodes(e.target.checked)}/>
          By character codes
        </label>
        <input className="input" placeholder="Result" value={result} disabled/>
        <button className="btn btn-primary" type="submit">Encode</button>
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
                <td>{ result.originalLetter.word }({ result.originalLetter.number })</td>
                <td>{ result.keyLetter.word }({ result.keyLetter.number })</td>
                <td>
                  {isByCodes ? getEncryptedWord(result.encryptedLetter.number) : result.encryptedLetter.word}
                  ({result.encryptedLetter.number})
                </td>
                <td>{ result.encryptedText }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Vigenere;
