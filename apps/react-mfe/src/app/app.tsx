// Uncomment this line to use CSS modules
// import styles from './app.module.scss';

import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';
import Vigenere from './components/vigenere/vigenere';
import Cesar from './components/cesar/cesar';

interface IAppProps {
  algorithm: Encryptions;
  onClose: (data: boolean) => void;
}

export function App({ algorithm, onClose }: IAppProps) {
  return (
    <div className="w-full h-full">
      {algorithm === Encryptions.Cesar || algorithm === Encryptions.CesarKey ? (
        <Cesar algorithm={algorithm}>
          <div className="flex justify-between">
            React MFE {algorithm}
            <button className="cursor-pointer" type="button" onClick={() => onClose(true)}>✖</button>
          </div>
        </Cesar>
      ) : algorithm === Encryptions.Vigenere ? (
        <Vigenere>
          <div className="flex justify-between">
            React MFE {algorithm}
            <button className="cursor-pointer" type="button" onClick={() => onClose(true)}>✖</button>
          </div>
        </Vigenere>
      ) : (
        'No such widget'
      )}
    </div>
  );
}

export default App;
