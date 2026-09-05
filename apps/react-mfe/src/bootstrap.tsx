import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import { Encryptions } from '@enc-vis-wasm-mfe/shared-types';

import App from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <StrictMode>
    <App algorithm={Encryptions.Cesar} onClose={() => {}}/>
  </StrictMode>,
);
