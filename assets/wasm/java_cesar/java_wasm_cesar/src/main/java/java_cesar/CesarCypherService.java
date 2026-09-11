package java_cesar;

import java.util.ArrayList;
import java.util.List;

public class CesarCypherService {

    private static final String[] ALPHABET = {
        "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
        "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
        "u", "v", "w", "x", "y", "z"
    };

    // ---------- DTO ----------

    public static class CesarResponse {
        public String encryptedText;
        public int index;

        public CesarResponse(String encryptedText, int index) {
            this.encryptedText = encryptedText;
            this.index = index;
        }
    }

    public static class CesarWithKeyResponse {
        public String encryptedText;
        public List<String> key;
        public List<Integer> arrayKeyNumbers;
        public List<List<String>> arrayWords;

        public CesarWithKeyResponse(String encryptedText, List<String> key,
                                    List<Integer> arrayKeyNumbers,
                                    List<List<String>> arrayWords) {
            this.encryptedText = encryptedText;
            this.key = key;
            this.arrayKeyNumbers = arrayKeyNumbers;
            this.arrayWords = arrayWords;
        }
    }

    // ---------- Helpers ----------

    private int getWordPosition(String word) {
        String lower = word.toLowerCase();
        for (int i = 0; i < ALPHABET.length; i++) {
            if (ALPHABET[i].equals(lower)) {
                return i;
            }
        }
        return -1;
    }

    private String getEncryptedWord(int shift, String word) {
        int position = -1;
        boolean upperCaseFlag = false;

        String lower = word.toLowerCase();
        for (int i = 0; i < ALPHABET.length; i++) {
            if (ALPHABET[i].equals(word)) {
                position = i;
                break;
            } else if (ALPHABET[i].equals(lower)) {
                position = i;
                upperCaseFlag = true;
                break;
            }
        }

        if (position > -1) {
            int wordPosition = (getWordPosition(word) + shift) % ALPHABET.length;
            if (wordPosition < 0) {
                wordPosition += ALPHABET.length;
            }
            String result = ALPHABET[wordPosition];
            return upperCaseFlag ? result.toUpperCase() : result;
        }

        return word;
    }

    // ---------- Public API ----------

    public List<CesarResponse> partEncrypting(int shift, String text) {
        List<CesarResponse> results = new ArrayList<>();
        StringBuilder bufferText = new StringBuilder();

        for (int index = 0; index < text.length(); index++) {
            String word = String.valueOf(text.charAt(index));
            bufferText.append(getEncryptedWord(shift, word));

            String encryptedText = bufferText.toString()
                + text.substring(Math.min(index + 1, text.length()));

            results.add(new CesarResponse(encryptedText, index + 1));
        }

        return results;
    }

    public CesarWithKeyResponse getEncryptedWithKey(String key, String text) {
        int countColumns = key.length();
        int countRows = (int) Math.ceil((double) text.length() / key.length());

        List<List<String>> array = new ArrayList<>();
        List<String> keyAsArray = new ArrayList<>();
        for (char c : key.toCharArray()) {
            keyAsArray.add(String.valueOf(c));
        }

        int textIterator = 0;
        for (int i = 0; i < countRows; i++) {
            int end = Math.min(textIterator + countColumns, text.length());
            String chunk = text.substring(textIterator, end);

            List<String> partialArray = new ArrayList<>();
            for (char c : chunk.toCharArray()) {
                partialArray.add(String.valueOf(c));
            }

            if (partialArray.size() < countColumns) {
                int difference = countColumns - partialArray.size();
                for (int j = 0; j < difference; j++) {
                    partialArray.add(ALPHABET[j]);
                }
            }

            array.add(partialArray);
            textIterator += countColumns;
        }

        List<String> sortedKey = new ArrayList<>(keyAsArray);
        sortedKey.sort(String::compareTo);

        List<Integer> usedWordsById = new ArrayList<>();
        StringBuilder encryptedText = new StringBuilder();

        for (String item : sortedKey) {
            for (int i = 0; i < countColumns; i++) {
                if (keyAsArray.get(i).equals(item) && !usedWordsById.contains(i)) {
                    for (List<String> miniArray : array) {
                        encryptedText.append(miniArray.get(i));
                    }
                    usedWordsById.add(i);
                    break;
                }
            }
        }

        return new CesarWithKeyResponse(
            encryptedText.toString(),
            keyAsArray,
            usedWordsById,
            array
        );
    }
}