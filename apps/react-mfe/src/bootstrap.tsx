import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { Encryptions } from '../../shell/src/app/models';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <App algorithm={Encryptions.Cesar} onClose={() => {}}/>
  </StrictMode>,
);
