//go:build js && wasm

package main

import (
	"encoding/json"
	"syscall/js"
)

func registerHuffmanExports() {
	js.Global().Set("huffmanEncrypt", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 1 {
			return "usage: huffmanEncrypt(text)"
		}

		text := args[0].String()
		result := HuffmanEncrypt(text)

		b, _ := json.Marshal(result)
		var obj map[string]interface{}
		_ = json.Unmarshal(b, &obj)

		return js.ValueOf(obj)
	}))
}
