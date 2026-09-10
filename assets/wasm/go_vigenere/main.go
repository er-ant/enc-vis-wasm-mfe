//go:build !js

package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	results := GetEncrypted("key", "hello")
	resultsCodes := GetEncryptedWithCodes("key", "hello")

	for _, r := range results {
		b, _ := json.MarshalIndent(r, "", "  ")
		fmt.Println(string(b))
	}

	for _, r := range resultsCodes {
		b, _ := json.MarshalIndent(r, "", "  ")
		fmt.Println(string(b))
	}
}
