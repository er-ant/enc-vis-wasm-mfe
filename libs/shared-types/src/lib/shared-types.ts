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

export interface IVigenereResponse {
  originalLetter: IVigenereLetter;
  keyLetter: IVigenereLetter;
  encryptedLetter: IVigenereLetter;
  encryptedText: string;
}

export interface IVigenereLetter {
  word: string;
  number: number;
}

export interface ICesarResponse {
  encryptedText: string;
  index: number;
}

export interface ICesarWithKeyResponse {
  encryptedText: string;
  key: Array<string>;
  arrayKeyNumbers: Array<number>;
  arrayWords: Array<string[]>;
}