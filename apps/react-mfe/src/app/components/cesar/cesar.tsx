// import styles from './cesar.module.scss';
import React, { useEffect, useState, useRef } from 'react';

import { Encryptions, ICesarResponse, ICesarWithKeyResponse } from '@enc-vis-wasm-mfe/shared-types';

interface ICesarProps {
  algorithm: Encryptions;
  children?: React.ReactNode;
}

export function Cesar({ algorithm, children }: ICesarProps) {
  const [input, setInput] = useState('');
  const [key, setKey] = useState('');
  const [shift, setShift] = useState<number | null>(null);
  const [result, setResult] = useState('');
  const [cesarResults, setCesarResults] = useState<Array<ICesarResponse | ICesarWithKeyResponse>>([]);
  const teavm = useRef<any | null>(null);

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
      .load('assets/wasm/java_cesar/java_wasm_cesar/target/wasm-gc/classes.wasm')
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

  function encode(): void {
    const wasmResults: Array<ICesarResponse | ICesarWithKeyResponse> = JSON.parse(algorithm === Encryptions.Cesar ?
      teavm.current!.exports.cesarEncrypt(shift, input):
      teavm.current!.exports.cesarWithKeyEncrypt(key, input)
    );
    setCesarResults(wasmResults);

    if (algorithm === Encryptions.Cesar) {
      setResult(wasmResults[wasmResults.length - 1]?.encryptedText)
    } else {
      setResult((wasmResults as any).encryptedText)
    }
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
        {algorithm === Encryptions.Cesar ? (
          <input className="input" placeholder="Shift" type="number" min="0" onChange={e => setShift(Number(e.target.value))}/>
        ) : (
          <input className="input" placeholder="Input key" value={key} onChange={e => setKey(e.target.value)}/>
        )}
        <input className="input" placeholder="Result" value={result} disabled/>
        <button className="btn btn-primary" type="submit">Encode</button>
      </form>
      <div className="flex-1 overflow-y-auto">
        <table className="table table-xs bg-base-100 shadow-sm">
          <thead>
            <tr>
              <th>Step</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            {cesarResults.map((result, index) => (
              <tr className="hover:bg-base-200" key={index}>
                <td>Step {index}</td>
                <td>{ result.encryptedText }</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cesar;
