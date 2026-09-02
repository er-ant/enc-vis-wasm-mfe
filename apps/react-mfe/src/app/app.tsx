// Uncomment this line to use CSS modules
// import styles from './app.module.scss';

import { Encryptions } from '../../../shell/src/app/models';

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
