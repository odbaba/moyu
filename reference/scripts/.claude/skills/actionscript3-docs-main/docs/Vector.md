# ActionScript 3.0: `Vector` Class (Typed Arrays)

The `Vector` class is a typed array where all elements must be of the same base type.

## Key Features

- **Performance**: Much faster than `Array` for iteration and access.
- **Type Safety**: Enforced at compile-time (strict mode) and runtime.
- **Dense**: Always sequential; no "gaps" like in sparse `Array`s.
- **Fixed Length**: Can optionally be made constant length via the `fixed` property.

## Syntax

```as3
var v:Vector.<String> = new Vector.<String>();
v.push("one");
v[1] = "two";
```

## Key Properties

- `length: uint`: Number of elements.
- `fixed: Boolean`: If true, the length cannot be changed.

## Key Methods

Identical to `Array` methods: `push`, `pop`, `shift`, `unshift`, `splice`, `slice`, `concat`, `indexOf`, `lastIndexOf`, `sort`, `reverse`, `every`, `filter`, `forEach`, `map`, `some`.

## Differences from `Array`

- Base types must match exactly (even subclass assignments require the `Vector()` global function for conversion).
- Access is bounds-checked (reading/writing beyond bounds throws a `RangeError`).
