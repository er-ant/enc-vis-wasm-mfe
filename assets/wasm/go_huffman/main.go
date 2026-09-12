//go:build !js

package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	result := HuffmanEncrypt("AABBBCCCCDDDDD")

	b, _ := json.MarshalIndent(result, "", "  ")
	fmt.Println(string(b))
}
