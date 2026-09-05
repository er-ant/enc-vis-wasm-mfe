// import styles from './cesar.module.scss';

import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';
import React from 'react';

interface ICesarProps {
  algorithm: Encryptions;
  children?: React.ReactNode;
}

export function Cesar({ algorithm, children }: ICesarProps) {
  return (
    <div className="flex w-full h-full bg-base-300 p-2 gap-2">
      <div className="flex-initial self-start flex flex-col bg-base-100 shadow-sm p-2 gap-3">
        {children}
        <input className="input" placeholder="Input text"/>
        {algorithm === Encryptions.Cesar ? (
          <input className="input" placeholder="Shift" type="number" min="0"/>
        ) : (
          <input className="input" placeholder="Input key"/>
        )}
        <input className="input" placeholder="Result" disabled/>
        <button className="btn btn-primary" type="submit">Encode</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="table table-xs bg-base-100 shadow-sm">
          <thead>
            <tr>
              <th>Step</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-base-200">
              <td>Step 1</td>
              <td>Text</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Cesar;
