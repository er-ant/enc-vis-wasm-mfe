export enum Frameworks {
  None = '',
  Angular = 'Angular',
  React = 'React'
}

export enum Encryptions {
  None = '',
  Cesar = 'Cesar',
  CesarKey = 'CesarKey',
  Vigenere = 'Vigenere',
  Huffman = 'Huffman'
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

export interface IHuffmanNode {
  id: string;
  freq: number;
  isLeaf: boolean;
  code?: string;
}

export interface IHuffmanStep {
  step: number;
  symbol?: string;
  code?: string;
  text: string;
}

export interface IHuffmanResult {
  input: string;
  result: string;
  table: Array<IHuffmanNode>;
  steps: Array<IHuffmanStep>;
  codes: { [key: string]: string };
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