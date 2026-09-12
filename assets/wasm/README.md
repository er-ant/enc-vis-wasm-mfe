# WASM
> Better use Bash

> Done quickly and dirty for testing purpose

## GO
### Vigenere
Implemented Vigenere encryption with Golang.

Local launch:
```
go run .
```

Build for WASM:
```
GOOS=js GOARCH=wasm go build -o vigenere_go.wasm .
```

Structure:
- `main_wasm.go` - used for browser build
- `main.go` - used for local test
- `vigenere_go.wasm` - artifact after build
- `vigenere_wasm.go` - wrapper for WASM
- `vigenere.go` - encryption algorithm implementation
- `wasm_exec.js` - API for WASM in browser by Golang

### Huffman
Implemented Huffman encryption with Golang.

Local launch:
```
go run .
```

Build for WASM:
```
GOOS=js GOARCH=wasm go build -o huffman_go.wasm .
```

Structure:
- `main_wasm.go` - used for browser build
- `main.go` - used for local test
- `huffman_go.wasm` - artifact after build
- `huffman_wasm.go` - wrapper for WASM
- `huffman.go` - encryption algorithm implementation
- `wasm_exec.js` - API for WASM in browser by Golang

## Java
Implemented Cesar and Cesar with key with Java.

Build for WASM:
```
mvn clean package
```

Structure:
- `java_cesar\src\main\java\java_cesar\CesarCypherService.java` - encryption algorithm implementation
- `java_cesar\src\main\java\java_cesar\Main.java` - used for browser build
- `java_cesar\target\wasm-gc\classes.wasm` - used for browser build
- `java_cesar\target\wasm-gc\classes.wasm-runtime.js` - API for WASM in browser by Java