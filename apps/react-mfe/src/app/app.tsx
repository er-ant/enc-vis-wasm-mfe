// Uncomment this line to use CSS modules
// import styles from './app.module.scss';

import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';

interface IAppProps {
  algorithm: Encryptions;
  onClose: (data: boolean) => void;
}

export function App({ algorithm, onClose }: IAppProps) {
  return (
    <div>
      React MFE {algorithm}
    </div>
  );
}

export default App;
