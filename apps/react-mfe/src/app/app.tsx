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
    <div>
      React MFE {algorithm}
      {algorithm === Encryptions.Cesar || algorithm === Encryptions.CesarKey ? (
        <Cesar algorithm={algorithm}/>
      ) : algorithm === Encryptions.Vigenere ? (
        <Vigenere />
      ) : (
        'No such widget'
      )}
      <button type="button" onClick={() => onClose(true)}>X</button>
    </div>
  );
}

export default App;
