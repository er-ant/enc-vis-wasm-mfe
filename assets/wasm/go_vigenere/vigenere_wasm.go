//go:build js && wasm
// +build js,wasm

package main

import (
	"encoding/json"
	"syscall/js"
)

func toJSValue(results []VigenereResponse) js.Value {
	arr := make([]interface{}, len(results))

	for i, r := range results {
		b, _ := json.Marshal(r)
		var obj map[string]interface{}
		_ = json.Unmarshal(b, &obj)
		arr[i] = obj
	}

	return js.ValueOf(arr)
}

func registerWasmExports() {
	js.Global().Set("vigenereEncrypt", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 2 {
			return "usage: vigenereEncrypt(key, text)"
		}

		key := args[0].String()
		text := args[1].String()

		return toJSValue(GetEncrypted(key, text))
	}))

	js.Global().Set("vigenereEncryptWithCodes", js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		if len(args) < 2 {
			return "usage: vigenereEncryptWithCodes(key, text)"
		}

		key := args[0].String()
		text := args[1].String()

		return toJSValue(GetEncryptedWithCodes(key, text))
	}))
}
