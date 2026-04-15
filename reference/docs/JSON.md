# ActionScript 3.0: `JSON` Class

The `JSON` class provides static methods for parsing and stringifying JSON data.

## Static Methods

- `parse(text:String, reviver:Function = null): Object`:
  - Converts a internal JSON string into an ActionScript object.
  - `reviver` can be used to transform values during parsing.
- `stringify(value:Object, replacer:* = null, space:* = null): String`:
  - Converts an ActionScript value to a JSON string.
  - `replacer` can be an array of property names or a function.
  - `space` can be a Number or String for indentation (pretty-printing).

## Custom Encoding

Classes can define a `toJSON(k:String):*` method to customize how they are serialized by `JSON.stringify()`.

## Compatibility

- Supported in Flash Player 11+ and AIR 3.0+.
- For older versions, developers typically used the `com.adobe.serialization.json.JSON` library.
