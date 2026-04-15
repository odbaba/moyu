# ActionScript 3.0: `Boolean` Class

The `Boolean` class represents a logical value: `true` or `false`.

## Initialization

All three forms are equivalent in AS3:

```as3
var flag:Boolean = true;
var flag:Boolean = new Boolean(true);
var flag:Boolean = Boolean(true);
```

## Methods

- `toString(): String`: Returns `"true"` or `"false"`.
- `valueOf(): Boolean`: Returns the primitive boolean value.

## Truthiness

In AS3, when converting to Boolean:

- **`true`**: Any non-zero number (for `Number`, `int`, `uint`), non-empty strings, and any non-null object.
- **`false`**: `0`, `NaN`, `null`, `undefined`, and empty strings (`""`).
