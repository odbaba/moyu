# ActionScript 3.0: `String` Class

The `String` class representing a sequence of characters. String indexes are zero-based. Strings are primitive but behave like objects with methods.

## Key Properties

- `length: int` (read-only): Number of characters in the string.

## Key Methods

- `charAt(index:Number): String`: Character at a specific index.
- `charCodeAt(index:Number): Number`: Unicode character code at an index.
- `concat(...args): String`: Appends arguments to the string.
- `indexOf(val:String, startIndex:Number = 0): int`: First occurrence of a substring.
- `lastIndexOf(val:String, startIndex:Number = 0x7FFFFFFF): int`: Last occurrence of a substring.
- `match(pattern:*): Array`: Matches a regular expression.
- `replace(pattern:*, repl:*): String`: Replaces matches of a pattern.
- `search(pattern:*): int`: Returns the index of a match.
- `slice(start:Number, end:Number): String`: Extracts a part of the string.
- `split(delimiter:*, limit:Number): Array`: Splits string into an array.
- `substr(start:Number, len:Number): String`: Extracts substring of a specific length.
- `substring(start:Number, end:Number): String`: Extracts substring between two indices.
- `toLowerCase() / toUpperCase(): String`
- `trim(): String` (AIR 2.0+)

## Static Methods

- `fromCharCode(...charCodes): String`: Creates a string from Unicode character codes.

## Verbatim Strings (AIR SDK 50+)

Precede a string literal with `@` to ignore escape characters:

```as3
var path:String = @"C:\Users\Name"; // Backslash is not an escape char
```
