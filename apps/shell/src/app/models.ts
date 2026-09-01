export enum Frameworks {
  Angular = 'Angular',
  React = 'React'
}

export enum Encryptions {
  Cesar = 'Cesar',
  CesarKey = 'CesarKey',
  Vigenere = 'Vigenere'
}

export interface IAddCardConfig {
  framework: string;
  encryption: string;
}