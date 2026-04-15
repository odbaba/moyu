# ActionScript 3.0: `Array` Class

The `Array` class provides access to and manipulation of zero-based indexed arrays. Arrays in AS3 are sparse and dynamic. For associative arrays, use `Object`.

## Key Properties

- `length: uint`: Non-negative integer specifying the number of elements.

## Key Methods

- `push(...args): uint`: Adds one or more elements to the end and returns new length.
- `pop(): *`: Removes the last element and returns it.
- `shift(): *`: Removes the first element and returns it.
- `unshift(...args): uint`: Adds elements to the beginning and returns new length.
- `concat(...args): Array`: Returns a new array combining this one with other arrays/values.
- `join(sep:*): String`: Concatenates elements into a string with a separator.
- `slice(startIndex:int = 0, endIndex:int = 16777215): Array`: Returns a shallow copy of a portion.
- `splice(startIndex:int, deleteCount:uint, ...values): Array`: Modifies the array by removing/replacing/adding elements.
- `indexOf(searchElement:*, fromIndex:int = 0): int`: Returns the first index of an item.
- `lastIndexOf(searchElement:*, fromIndex:int = 0x7FFFFFFF): int`: Returns the last index of an item.

### Functional Methods (ActionScript 3.0+)

- `every(callback:Function, thisObject:* = null): Boolean`
- `some(callback:Function, thisObject:* = null): Boolean`
- `forEach(callback:Function, thisObject:* = null): void`
- `filter(callback:Function, thisObject:* = null): Array`
- `map(callback:Function, thisObject:* = null): Array`

### Sorting

- `sort(...args): Array`: Sorts elements in place.
- `sortOn(fieldName:Object, options:Object = null): Array`: Sorts objects in an array by a field.

## Array Constants (Sorting Options)

- `CASEINSENSITIVE`, `DESCENDING`, `UNIQUESORT`, `RETURNINDEXEDARRAY`, `NUMERIC`.

## Usage

```as3
var list:Array = ["a", "b", "c"];
list.push("d");
var filtered:Array = list.filter(function(item:String, index:int, arr:Array):Boolean {
    return item != "b";
});
```
