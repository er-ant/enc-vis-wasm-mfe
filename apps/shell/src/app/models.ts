import { Frameworks, Encryptions } from '@enc-vis-wasm-mfe/shared-types';

export interface IAddCardConfig {
  framework: Frameworks;
  encryption: Encryptions;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
