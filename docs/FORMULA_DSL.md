# Kolibri Formula DSL Specification

## Overview

The Kolibri Formula DSL (Domain Specific Language) is a deterministic, pure functional language for expressing executable knowledge. Formulas are compiled to bytecode for efficient execution in the sandbox.

## Design Principles

1. **Deterministic**: Same inputs always produce same outputs
2. **Pure Functions**: No side effects
3. **Resource-Bounded**: Limited time and memory
4. **Type-Safe**: Static type checking
5. **Composable**: Formulas can reference other formulas

## Basic Syntax

### Formula Declaration

```kolibri
formula add_numbers {
  inputs: [x: number, y: number]
  outputs: [result: number]
  cost: 10
  
  compute {
    result = x + y
  }
}
```

### Data Types

- `number` - 64-bit floating point
- `integer` - 64-bit signed integer
- `boolean` - true/false
- `string` - UTF-8 text
- `array<T>` - Homogeneous arrays
- `tuple<T1, T2, ...>` - Heterogeneous tuples

### Operators

**Arithmetic:**
- `+`, `-`, `*`, `/`, `%` (modulo)
- `^` (power)

**Comparison:**
- `==`, `!=`, `<`, `>`, `<=`, `>=`

**Logical:**
- `and`, `or`, `not`

**Array:**
- `map`, `filter`, `reduce`, `fold`
- `length`, `head`, `tail`
- `concat`, `slice`

### Control Flow

```kolibri
if condition {
  // true branch
} else {
  // false branch
}

match value {
  pattern1 => expression1
  pattern2 => expression2
  _ => default_expression
}
```

### Functions

```kolibri
let square = fn(x: number) -> number {
  x * x
}

let result = square(5)  // 25
```

## Advanced Features

### Pattern Matching

```kolibri
match list {
  [] => 0
  [x] => x
  [x, ...rest] => x + sum(rest)
}
```

### Recursion (Bounded)

```kolibri
formula fibonacci {
  inputs: [n: integer]
  outputs: [result: integer]
  cost: 50
  max_depth: 100
  
  compute {
    result = match n {
      0 => 0
      1 => 1
      _ => fibonacci(n-1) + fibonacci(n-2)
    }
  }
}
```

### Array Operations

```kolibri
let numbers = [1, 2, 3, 4, 5]
let doubled = numbers.map(fn(x) { x * 2 })
let evens = numbers.filter(fn(x) { x % 2 == 0 })
let sum = numbers.reduce(0, fn(acc, x) { acc + x })
```

## Bytecode Format

Formulas are compiled to a stack-based bytecode:

### Instructions

```
// Stack operations
PUSH <value>      // Push constant
POP               // Pop and discard
DUP               // Duplicate top
SWAP              // Swap top two

// Arithmetic
ADD, SUB, MUL, DIV, MOD, POW

// Comparison
EQ, NE, LT, GT, LE, GE

// Logical
AND, OR, NOT

// Control flow
JUMP <offset>
JUMP_IF <offset>
JUMP_IF_NOT <offset>

// Functions
CALL <formula_id>
RET

// Variables
LOAD <index>      // Load local variable
STORE <index>     // Store to local variable

// Arrays
ARRAY_NEW <size>
ARRAY_GET
ARRAY_SET
ARRAY_LEN
```

### Example Bytecode

```
// Formula: add(x, y) = x + y
LOAD 0    // Load x
LOAD 1    // Load y
ADD       // x + y
RET       // Return result
```

## Cost Model

Each operation has an associated cost:

| Operation | Cost |
|-----------|------|
| Arithmetic | 1 |
| Comparison | 1 |
| Logical | 1 |
| Array access | 2 |
| Function call | 10 + callee cost |
| Pattern match | 5 |

Total formula cost must be declared and enforced at runtime.

## Security Constraints

### Resource Limits

```kolibri
formula example {
  inputs: [data: array<number>]
  outputs: [result: number]
  
  // Resource constraints
  cost: 1000          // Max operations
  memory: 1024        // Max bytes
  time: 100           // Max milliseconds
  max_depth: 50       // Max recursion depth
  
  compute {
    // Implementation
  }
}
```

### Forbidden Operations

- System calls
- File I/O
- Network access
- Non-deterministic operations (random, time)
- Unbounded loops
- Unbounded recursion

## Formula Composition

Formulas can reference other formulas:

```kolibri
formula normalize {
  inputs: [values: array<number>]
  outputs: [normalized: array<number>]
  cost: 200
  
  compute {
    let mean_val = mean(values)
    let std_val = std_dev(values)
    
    normalized = values.map(fn(x) {
      (x - mean_val) / std_val
    })
  }
}

formula mean {
  inputs: [values: array<number>]
  outputs: [result: number]
  cost: 50
  
  compute {
    let sum = values.reduce(0, fn(acc, x) { acc + x })
    result = sum / values.length
  }
}
```

## Metadata

### Tags

```kolibri
formula image_classify {
  inputs: [pixels: array<number>]
  outputs: [class: string]
  
  tags: ["vision", "classification", "neural"]
  author: "kolibri-ai"
  version: 2
  license: "MIT"
  
  compute {
    // ...
  }
}
```

### Provenance

Automatically tracked when formulas are mutated or crossed:

```kolibri
// Parent formula
formula parent {
  id: 0x1234...
  version: 1
}

// Child formula (mutated)
formula child {
  id: 0x5678...
  version: 1
  provenances: [0x1234...]  // References parent
}
```

## Execution Model

1. **Parse**: Formula DSL → AST
2. **Type Check**: Verify type safety
3. **Compile**: AST → Bytecode
4. **Sign**: Add ed25519 signature
5. **Store**: Save to database
6. **Execute**: Run in sandbox with limits

### Sandbox Execution

```javascript
const result = await core.execute(formulaId, {
  inputs: [10, 20],
  limits: {
    time: 100,    // ms
    memory: 1024, // bytes
    cost: 1000    // operations
  }
});
```

## Best Practices

1. **Keep formulas small**: Prefer composition over monoliths
2. **Declare accurate costs**: Overestimate to avoid timeout
3. **Use pure functions**: No hidden state
4. **Tag appropriately**: Enable discovery
5. **Document inputs/outputs**: Clear contracts
6. **Test edge cases**: Empty arrays, zero, negative numbers

## Examples

### Mathematical Operations

```kolibri
formula pythagorean {
  inputs: [a: number, b: number]
  outputs: [c: number]
  cost: 10
  
  compute {
    c = sqrt(a^2 + b^2)
  }
}
```

### Data Processing

```kolibri
formula moving_average {
  inputs: [data: array<number>, window: integer]
  outputs: [smoothed: array<number>]
  cost: 100
  
  compute {
    smoothed = data.indices()
      .filter(fn(i) { i >= window - 1 })
      .map(fn(i) {
        let slice = data.slice(i - window + 1, i + 1)
        mean(slice)
      })
  }
}
```

### Classification

```kolibri
formula classify_sentiment {
  inputs: [text: string]
  outputs: [sentiment: string, score: number]
  cost: 500
  
  compute {
    let tokens = tokenize(text)
    let positive = count_matches(tokens, positive_words)
    let negative = count_matches(tokens, negative_words)
    
    score = (positive - negative) / tokens.length
    sentiment = match score {
      s if s > 0.2 => "positive"
      s if s < -0.2 => "negative"
      _ => "neutral"
    }
  }
}
```

## Future Extensions

- **JIT Compilation**: For hot formulas
- **GPU Acceleration**: For array operations
- **Streaming**: Process data in chunks
- **Persistence**: Memoization of pure functions
- **Versioning**: Automatic upgrade paths
