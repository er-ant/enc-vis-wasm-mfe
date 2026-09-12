package main

import (
	"strings"
)

type VigenereLetter struct {
	Word   string `json:"word"`
	Number int    `json:"number"`
}

type VigenereResponse struct {
	OriginalLetter  VigenereLetter `json:"originalLetter"`
	KeyLetter       VigenereLetter `json:"keyLetter"`
	EncryptedLetter VigenereLetter `json:"encryptedLetter"`
	EncryptedText   string         `json:"encryptedText"`
	EncryptedBytes  []byte         `json:"encryptedBytes,omitempty"`
}

var englishAlphabet = []string{
	"a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
	"k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
	"u", "v", "w", "x", "y", "z",
}

func getWordPosition(alphabet []string, word string) int {
	word = strings.ToLower(word)

	for i, w := range alphabet {
		if w == word {
			return i
		}
	}

	return -1
}

func GetEncrypted(key, text string) []VigenereResponse {
	alphabet := englishAlphabet
	encryptedText := ""
	iterator := 0
	results := []VigenereResponse{}

	keyArray := []string{}
	for _, ch := range strings.Split(key, "") {
		if ch != " " && getWordPosition(alphabet, ch) >= 0 {
			keyArray = append(keyArray, ch)
		}
	}

	textArray := []string{}
	for _, ch := range strings.Split(text, "") {
		if ch != " " {
			textArray = append(textArray, ch)
		}
	}

	for index, textWord := range textArray {
		textWordPosition := getWordPosition(alphabet, textWord)
		response := VigenereResponse{}

		if textWordPosition >= 0 {
			if len(keyArray) <= iterator {
				iterator = 0
			}

			keyWordPosition := getWordPosition(alphabet, keyArray[iterator])

			shifted := textWordPosition + keyWordPosition + 1
			var encryptedLetter string
			if len(alphabet) > shifted {
				encryptedLetter = alphabet[shifted]
			} else {
				encryptedLetter = alphabet[shifted-len(alphabet)]
			}

			encryptedText += encryptedLetter

			response.OriginalLetter = VigenereLetter{
				Word:   textWord,
				Number: textWordPosition + 1,
			}
			response.KeyLetter = VigenereLetter{
				Word:   keyArray[iterator],
				Number: keyWordPosition + 1,
			}
			response.EncryptedLetter = VigenereLetter{
				Word:   encryptedLetter,
				Number: getWordPosition(alphabet, encryptedLetter) + 1,
			}
			response.EncryptedText = encryptedText + strings.Join(textArray[index+1:], "")

			iterator++
		} else {
			encryptedText += textWord

			response.OriginalLetter = VigenereLetter{Word: textWord}
			response.EncryptedLetter = VigenereLetter{Word: textWord}
			response.EncryptedText = encryptedText + strings.Join(textArray[index+1:], "")
		}

		results = append(results, response)
	}

	return results
}

func GetEncryptedWithCodes(key, text string) []VigenereResponse {
	alphabet := englishAlphabet
	iterator := 0
	maxSymbols := 256
	results := []VigenereResponse{}
	encryptedBytes := []byte{}

	keyArray := []string{}
	for _, ch := range strings.Split(key, "") {
		if ch != " " && getWordPosition(alphabet, ch) >= 0 {
			keyArray = append(keyArray, ch)
		}
	}

	textArray := []string{}
	for _, ch := range strings.Split(text, "") {
		if ch != " " {
			textArray = append(textArray, ch)
		}
	}

	for index, textWord := range textArray {
		textWordPosition := int(textWord[0])
		response := VigenereResponse{}

		if len(keyArray) <= iterator {
			iterator = 0
		}

		keyWordPosition := int(keyArray[iterator][0])

		shifted := textWordPosition + keyWordPosition
		var encryptedByte byte
		if maxSymbols > shifted {
			encryptedByte = byte(shifted)
		} else {
			encryptedByte = byte(shifted - maxSymbols)
		}

		encryptedBytes = append(encryptedBytes, encryptedByte)

		response.OriginalLetter = VigenereLetter{
			Word:   textWord,
			Number: textWordPosition,
		}
		response.KeyLetter = VigenereLetter{
			Word:   keyArray[iterator],
			Number: keyWordPosition,
		}
		response.EncryptedLetter = VigenereLetter{
			Word:   "",
			Number: int(encryptedByte),
		}
		encryptedTextLatin1 := make([]rune, len(encryptedBytes))
		for i, b := range encryptedBytes {
			encryptedTextLatin1[i] = rune(b)
		}
		response.EncryptedText = string(encryptedTextLatin1) + strings.Join(textArray[index+1:], "")
		response.EncryptedBytes = append([]byte(nil), encryptedBytes...)

		iterator++
		results = append(results, response)
	}

	return results
}
