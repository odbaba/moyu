# ActionScript 3.0: `Number`, `int`, `uint` Classes

AS3 provides three primary numeric types for different performance and precision needs.

## `Number` Class

Represented as an IEEE-754 double-precision floating-point number. Use for values requiring fractions or very large integers (up to 53-bit precision).

- **Default Value**: `NaN`
- **Constants**: `MAX_VALUE`, `MIN_VALUE`, `NaN`, `NEGATIVE_INFINITY`, `POSITIVE_INFINITY`.
- **Methods**: `toFixed(fractionDigits)`, `toExponential(fractionDigits)`, `toPrecision(precision)`, `toString(radix)`.

## `int` Class

A 32-bit signed integer ranging from -2,147,483,648 to 2,147,483,647. Faster than `Number` for loop counters and integer math.

- **Default Value**: `0`
- **Constants**: `MAX_VALUE` (2,147,483,647), `MIN_VALUE` (-2,147,483,648).

## `uint` Class

A 32-bit unsigned integer ranging from 0 to 4,294,967,295. Ideal for pixel colors (0xFFFFFFFF) and positive-only counts.

- **Default Value**: `0`
- **Constants**: `MAX_VALUE` (4,294,967,295), `MIN_VALUE` (0).

## Summary Table

| Type | Bits | Sign | Default | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| `Number` | 64 | Signed | `NaN` | Decimals, large integers |
| `int` | 32 | Signed | `0` | Counters, general integers |
| `uint` | 32 | Unsigned| `0` | Colors, positive integers |
