# ActionScript 3.0: `Function` Class

In ActionScript 3.0, both user-defined and built-in functions are objects (instances of the `Function` class).

## Bound Methods

When a method is extracted from a class instance, it becomes a "bound method," retaining its connection to the original instance. In a bound method, `this` always refers to the original object.

## Key Properties

- `length: int` (read-only): The number of parameters defined for the function.
- `prototype: Object`: The prototype object used for prototype-based inheritance.

## Key Methods

- `apply(thisArg:*, argArray:*): *`: Invokes the function with a specific `this` context and arguments passed as an array.
- `call(thisArg:*, ...args): *`: Invokes the function with a specific `this` context and individual arguments.

## Example

```as3
function greet(name:String):void {
    trace("Hello, " + name);
}
greet.call(null, "World"); // Hello, World
```
