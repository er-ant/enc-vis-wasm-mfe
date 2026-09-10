//go:build js && wasm

package main

func main() {
	registerWasmExports()
	select {}
}
