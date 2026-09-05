// import styles from './cesar.module.scss';

import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';

interface ICesarProps {
  algorithm: Encryptions;
}

export function Cesar({ algorithm }: ICesarProps) {
  return (
    <div>
      <div>
        <p>cesar works!</p>
        <input placeholder="Input text"/>
        {algorithm === Encryptions.Cesar ? (
          <input placeholder="Shift" type="number"/>
        ) : (
          <input placeholder="Input key"/>
        )}
        <input placeholder="Result" disabled/>
        <button type="submit">Encode</button>
      </div>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            <tr>
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
