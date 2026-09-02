export enum Frameworks {
  None = '',
  Angular = 'Angular',
  React = 'React'
}

export enum Encryptions {
  None = '',
  Cesar = 'Cesar',
  CesarKey = 'CesarKey',
  Vigenere = 'Vigenere'
}

export interface IAddCardConfig {
  framework: Frameworks;
  encryption: Encryptions;
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
