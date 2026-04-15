# ActionScript 3.0: `Object` Class

The `Object` class is the root of the ActionScript class hierarchy. All classes that don't declare an explicit base class extend it. It is used to create associative arrays (hash maps).

## Key Properties

- `constructor: Object`: A reference to the class object or constructor function.
- `prototype: Object` (static): A reference to the prototype object of a class.

## Key Methods

- `hasOwnProperty(name: String): Boolean`: Returns true if the object has the specified property.
- `isPrototypeOf(theClass: Object): Boolean`: Checks if the object is in the prototype chain.
- `propertyIsEnumerable(name: String): Boolean`: Checks if the property is enumerable.
- `setPropertyIsEnumerable(name: String, isEnum: Boolean = true): void`: Sets property enumerability.
- `toString(): String`: Returns the string representation of the object.
- `valueOf(): Object`: Returns the primitive value of the object.

## Examples

### Associative Array (Object Literal)

```as3
var dict:Object = {firstName: "John", lastName: "Doe"};
trace(dict.firstName);    // John
trace(dict["lastName"]);  // Doe
dict.age = 30;            // Dynamic property
```
