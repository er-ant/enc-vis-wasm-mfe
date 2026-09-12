package main

import (
	"sort"
)

type HuffmanNode struct {
	ID      string `json:"id"`
	Freq    int    `json:"freq"`
	IsLeaf  bool   `json:"isLeaf"`
	Code    string `json:"code,omitempty"`
	LeftID  string `json:"-"`
	RightID string `json:"-"`
	Left    *HuffmanNode
	Right   *HuffmanNode
}

type HuffmanStep struct {
	Step int    `json:"step"`
	Sym  string `json:"symbol,omitempty"`
	Code string `json:"code,omitempty"`
	Text string `json:"text"`
}

type HuffmanResult struct {
	Input  string            `json:"input"`
	Result string            `json:"result"`
	Table  []HuffmanNode     `json:"table"`
	Steps  []HuffmanStep     `json:"steps"`
	Codes  map[string]string `json:"codes"`
}

func HuffmanEncrypt(text string) HuffmanResult {
	// 1. Frequencies
	freq := map[string]int{}
	order := []string{}
	for _, ch := range text {
		s := string(ch)
		if _, ok := freq[s]; !ok {
			order = append(order, s)
		}
		freq[s]++
	}

	// 2. Nodes-leafs
	nodes := []*HuffmanNode{}
	for _, s := range order {
		nodes = append(nodes, &HuffmanNode{
			ID:     s,
			Freq:   freq[s],
			IsLeaf: true,
		})
	}

	leaves := make([]*HuffmanNode, len(nodes))
	copy(leaves, nodes)

	// 3. Queues
	queue := nodes
	counter := 0

	for len(queue) > 1 {
		sort.SliceStable(queue, func(i, j int) bool {
			return queue[i].Freq < queue[j].Freq
		})

		left := queue[0]
		right := queue[1]
		queue = queue[2:]

		counter++
		merged := &HuffmanNode{
			ID:    left.ID + right.ID,
			Freq:  left.Freq + right.Freq,
			Left:  left,
			Right: right,
		}
		queue = append(queue, merged)
	}

	root := queue[0]

	// 4. Codes
	codes := map[string]string{}
	var walk func(n *HuffmanNode, prefix string)
	walk = func(n *HuffmanNode, prefix string) {
		if n.IsLeaf {
			codes[n.ID] = prefix
			n.Code = prefix
			return
		}
		walk(n.Left, prefix+"0")
		walk(n.Right, prefix+"1")
	}
	walk(root, "")

	// 5. Table (leafs and intermediate)
	table := []HuffmanNode{}
	for _, l := range leaves {
		table = append(table, *l)
	}

	intermediate := []*HuffmanNode{}
	var collect func(n *HuffmanNode)
	collect = func(n *HuffmanNode) {
		if n.IsLeaf {
			return
		}
		collect(n.Left)
		collect(n.Right)
		intermediate = append(intermediate, n)
	}
	collect(root)
	// sort values by frequence
	sort.SliceStable(intermediate, func(i, j int) bool {
		return intermediate[i].Freq < intermediate[j].Freq
	})
	for _, n := range intermediate {
		table = append(table, *n)
	}

	// 6. Step-by-step encoding based on frequency
	sortedLeaves := make([]*HuffmanNode, len(leaves))
	copy(sortedLeaves, leaves)
	sort.SliceStable(sortedLeaves, func(i, j int) bool {
		return sortedLeaves[i].Freq < sortedLeaves[j].Freq
	})

	steps := []HuffmanStep{}
	current := text

	stepNum := 0
	for _, leaf := range sortedLeaves {
		code := codes[leaf.ID]
		var next string
		for _, ch := range current {
			if string(ch) == leaf.ID {
				next += code
			} else {
				next += string(ch)
			}
		}
		current = next
		stepNum++
		steps = append(steps, HuffmanStep{
			Step: stepNum,
			Sym:  leaf.ID,
			Code: code,
			Text: current,
		})
	}

	return HuffmanResult{
		Input:  text,
		Result: current,
		Table:  table,
		Steps:  steps,
		Codes:  codes,
	}
}
