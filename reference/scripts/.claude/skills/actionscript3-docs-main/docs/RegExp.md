# ActionScript 3.0: `RegExp` Class

The `RegExp` class provides regular expression pattern matching for strings.

## Creating a RegExp

- **Literal**: `/pattern/flags`
- **Constructor**: `new RegExp("pattern", "flags")`

### Flags

- `g` (global): Find all matches.
- `i` (ignoreCase): Case-insensitive.
- `m` (multiline): `^` and `$` match start/end of lines.
- `s` (dotall): `.` matches newline characters.
- `x` (extended): Ignore whitespace in the pattern.

## Key Properties

- `source: String`: The pattern string.
- `lastIndex: Number`: Index to start the next search (used with `g` flag).

## Key Methods

- `exec(str:String): Object`: Performs a search and returns an array of results or `null`.
- `test(str:String): Boolean`: Returns true if a match exists.

## String Integration

- `String.match(regexp)`
- `String.replace(regexp, replacement)`
- `String.search(regexp)`
- `String.split(regexp)`
