package java_cesar;

import org.teavm.jso.JSExport;

import java.util.List;

public class Main {

    public static void main(String[] args) {
    }

    @JSExport
    public static String cesarEncrypt(int shift, String text) {
        CesarCypherService service = new CesarCypherService();
        List<CesarCypherService.CesarResponse> steps = service.partEncrypting(shift, text);
        return toJsonCesar(steps);
    }

    @JSExport
    public static String cesarWithKeyEncrypt(String key, String text) {
        CesarCypherService service = new CesarCypherService();
        CesarCypherService.CesarWithKeyResponse res = service.getEncryptedWithKey(key, text);
        return toJsonCesarKey(res);
    }

    private static String escape(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static String toJsonCesar(List<CesarCypherService.CesarResponse> steps) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < steps.size(); i++) {
            CesarCypherService.CesarResponse r = steps.get(i);
            if (i > 0) sb.append(",");
            sb.append("{\"index\":").append(r.index)
              .append(",\"encryptedText\":\"").append(escape(r.encryptedText)).append("\"}");
        }
        sb.append("]");
        return sb.toString();
    }

    private static String toJsonCesarKey(CesarCypherService.CesarWithKeyResponse r) {
        StringBuilder sb = new StringBuilder();
        sb.append("{\"encryptedText\":\"").append(escape(r.encryptedText)).append("\",");
        sb.append("\"key\":[");
        for (int i = 0; i < r.key.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append("\"").append(escape(r.key.get(i))).append("\"");
        }
        sb.append("],");
        sb.append("\"arrayKeyNumbers\":[");
        for (int i = 0; i < r.arrayKeyNumbers.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append(r.arrayKeyNumbers.get(i));
        }
        sb.append("],");
        sb.append("\"arrayWords\":[");
        for (int i = 0; i < r.arrayWords.size(); i++) {
            if (i > 0) sb.append(",");
            sb.append("[");
            List<String> row = r.arrayWords.get(i);
            for (int j = 0; j < row.size(); j++) {
                if (j > 0) sb.append(",");
                sb.append("\"").append(escape(row.get(j))).append("\"");
            }
            sb.append("]");
        }
        sb.append("]}");
        return sb.toString();
    }
}
