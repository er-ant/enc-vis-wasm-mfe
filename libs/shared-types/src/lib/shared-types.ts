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