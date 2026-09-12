//go:build js && wasm

package main

func main() {
	registerHuffmanExports()
	select {}
}
