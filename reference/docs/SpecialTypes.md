# ActionScript 3.0: Special Types and Language Constructs

This document covers special types and constructs in ActionScript 3.0 that don't fit into standard class categories.

## Class Type

### Class

The `Class` type represents the class object itself, not an instance of the class. Every class in ActionScript 3.0 is an object of type `Class`.

**Usage**:

```as3
var myClass:Class = Sprite;
var instance:Object = new myClass(); // Creates a new Sprite

// Type checking
if (obj is Sprite) {
    trace("obj is an instance of Sprite");
}

// Getting the class of an object
var objClass:Class = Object(obj).constructor as Class;
```

**Dynamic Class Creation**:

```as3
function createInstance(classRef:Class):* {
    return new classRef();
}

var sprite:Sprite = createInstance(Sprite) as Sprite;
```

## Namespace

### Namespace

The `Namespace` class contains methods and properties for defining and working with namespaces. Namespaces associate a prefix with a Uniform Resource Identifier (URI).

**Constructor**: `Namespace(prefix:String = "", uri:String = "")`

**Properties**:

- `prefix: String`: The namespace prefix.
- `uri: String`: The Uniform Resource Identifier (URI) of the namespace.

**Common Uses**:

1. **XML Namespaces**: Associate namespace prefixes with URIs in XML objects.
2. **Method Differentiation**: Differentiate methods with the same name but different purposes.
3. **Access Control**: Control access to groups of properties and methods.

**Example - XML Namespaces**:

```as3
var rss:Namespace = new Namespace("http://www.example.com/rss");
var xml:XML = 
    <rss:feed xmlns:rss="http://www.example.com/rss">
        <rss:item>Data</rss:item>
    </rss:feed>;

default xml namespace = rss;
trace(xml.item); // Access item without namespace prefix
```

**Example - Access Control**:

```as3
package {
    public namespace custom;
    
    public class MyClass {
        custom var hiddenData:String = "secret";
        
        custom function internalMethod():void {
            trace("Internal method");
        }
    }
}

// Usage
use namespace custom;
var obj:MyClass = new MyClass();
trace(obj.hiddenData); // Accessible with namespace
obj.internalMethod();  // Accessible with namespace
```

**Built-in Namespaces**:

- `public`: Standard public access.
- `private`: Accessible only within the defining class.
- `protected`: Accessible within the class and subclasses.
- `internal`: Accessible within the same package (default).

## QName

### QName

The `QName` (Qualified Name) class represents a qualified name of a property: a namespace and a local name.

**Constructor**:

- `QName(uri:Namespace, localName:String)`
- `QName(uri:String, localName:String)`

**Properties**:

- `localName: String`: The local name part.
- `uri: String`: The namespace URI.

**Example**:

```as3
var ns:Namespace = new Namespace("http://example.com");
var qname:QName = new QName(ns, "propertyName");

trace(qname.localName); // propertyName
trace(qname.uri);       // http://example.com

// Using with XML
var xml:XML = <root/>;
xml[qname] = "value";
trace(xml.toXMLString());
```

**Dynamic Property Access**:

```as3
var obj:Object = {name: "John", age: 30};
var propName:QName = new QName("", "name");
trace(obj[propName]); // John
```

## TimeZone

### TimeZone **[AIR Only]**

The `TimeZone` class provides information about time zones for use in date calculations and for finding out about different locations and their time zone offsets.

**Note**: Available only in Adobe AIR applications. Information varies by operating system.

**Static Properties**:

- `availableTimeZoneNames: Vector.<String>` (read-only): List of available time zone names from the OS.
- `default: TimeZone` (read-only): The default time zone for the system.

**Static Methods**:

- `getTimeZone(name:String): TimeZone`: Creates a TimeZone object for the specified time zone name.

**Instance Properties**:

- `displayName: String` (read-only): Human-readable name of the time zone.
- `id: String` (read-only): Unique identifier for the time zone.
- `rawOffset: int` (read-only): Offset from UTC in milliseconds (without DST).
- `useDaylightTime: Boolean` (read-only): Whether the time zone uses daylight saving time.

**Instance Methods**:

- `getOffset(date:Date): int`: Returns the time zone offset in milliseconds for a specific date.

**Example**:

```as3
// List available time zones
var zones:Vector.<String> = TimeZone.availableTimeZoneNames;
for each (var zoneName:String in zones) {
    trace(zoneName);
}

// Get specific time zone
var tokyo:TimeZone = TimeZone.getTimeZone("Asia/Tokyo");
trace(tokyo.displayName);  // Japan Standard Time
trace(tokyo.rawOffset);    // 32400000 (9 hours in ms)

// Get offset for a specific date
var date:Date = new Date(2024, 0, 1); // Jan 1, 2024
var offset:int = tokyo.getOffset(date);
trace("Offset: " + (offset / 3600000) + " hours"); // Offset in hours
```

## arguments Object

### arguments

The `arguments` object is an implicit local variable available within all function bodies. It contains an array of all arguments passed to the function.

**Properties**:

- `length: uint`: Number of arguments passed to the function.
- `callee: Function`: Reference to the currently executing function.
- `[index]`: Access individual arguments by index (0-based).

**Example**:

```as3
function sum(...rest):Number {
    var total:Number = 0;
    // Can use rest parameter
    for each (var num:Number in rest) {
        total += num;
    }
    return total;
    
    // Or use arguments object
    // for (var i:int = 0; i < arguments.length; i++) {
    //     total += arguments[i];
    // }
}

trace(sum(1, 2, 3, 4, 5)); // 15
```

**Variable Arguments**:

```as3
function log(message:String, ...values):void {
    trace(message);
    for (var i:int = 0; i < values.length; i++) {
        trace("  [" + i + "] = " + values[i]);
    }
}

log("Values:", 10, 20, 30);
// Output:
// Values:
//   [0] = 10
//   [1] = 20
//   [2] = 30
```

**Note**: Modern ActionScript 3.0 code typically uses rest parameters (`...rest`) instead of the `arguments` object for better type safety and clarity.

## Type Coercion and Checking

### Using Class Types

```as3
// Type checking with 'is'
if (obj is Sprite) {
    trace("obj is a Sprite");
}

// Type coercion with 'as'
var sprite:Sprite = obj as Sprite; // null if obj is not a Sprite

// Type casting (throws TypeError if invalid)
var sprite2:Sprite = Sprite(obj);
```

### Getting Class Type

```as3
import flash.utils.getQualifiedClassName;
import flash.utils.getDefinitionByName;

var className:String = getQualifiedClassName(obj);
trace(className); // e.g., "flash.display::Sprite"

// Get Class object from name
var ClassRef:Class = getDefinitionByName(className) as Class;
var newInstance:* = new ClassRef();
```

## Summary

| Type | Purpose | Common Use |
|------|---------|-----------|
| `Class` | Represents class objects | Dynamic instantiation, reflection |
| `Namespace` | Manages namespaces | XML processing, access control |
| `QName` | Qualified property names | Dynamic XML/object property access |
| `TimeZone` | Time zone information (AIR) | Date/time calculations across zones |
| `arguments` | Function arguments | Variable-length argument lists |

These special types provide the foundation for advanced ActionScript 3.0 features like reflection, dynamic programming, XML manipulation, and internationalization.
