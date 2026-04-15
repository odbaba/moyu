---
name: ActionScript 3.0 Coding
description: This skill should be used when the user or agent asks to "edit .as files", "generate ActionScript code", "write AS3 code", "create ActionScript class", "fix AS3 syntax", "implement Flash code", "develop AIR application", or works with ActionScript 3.0 (.as) files. Also triggers on questions about AS3 syntax, ActionScript patterns, Flash/AIR development, or Adobe runtime APIs.
version: 1.0.0
---

# ActionScript 3.0 Coding Guide

This skill provides guidance for writing, editing, and generating ActionScript 3.0 code (.as files) using the comprehensive documentation available in this repository.

## Documentation Reference

This repository contains complete AS3 and Adobe AIR documentation in `/docs/`. Consult `references/docs-index.md` for a categorized index mapping topics to specific documentation files.

## AS3 File Structure

### Package and Class Declaration

```as3
package com.example.project {

    import flash.display.Sprite;
    import flash.events.Event;

    /**
     * Class description using ASDoc format.
     */
    public class MyClass extends Sprite {

        // Constants (UPPER_SNAKE_CASE)
        private static const MAX_COUNT:int = 100;

        // Instance variables (camelCase, prefixed with underscore for private)
        private var _name:String;
        protected var isActive:Boolean = false;
        public var data:Object;

        /**
         * Constructor
         */
        public function MyClass() {
            super();
            init();
        }

        private function init():void {
            addEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
        }

        // Getters/Setters
        public function get name():String { return _name; }
        public function set name(value:String):void { _name = value; }

        // Event handlers (prefixed with "on")
        private function onAddedToStage(e:Event):void {
            removeEventListener(Event.ADDED_TO_STAGE, onAddedToStage);
        }
    }
}
```

### Interface Declaration

```as3
package com.example.interfaces {

    public interface IDisposable {
        function dispose():void;
        function get isDisposed():Boolean;
    }
}
```

## Naming Conventions

| Element | Convention | Example |
| ------- | ---------- | ------- |
| Package | lowercase, dot-separated | `com.example.utils` |
| Class | PascalCase | `PlayerController` |
| Interface | PascalCase with "I" prefix | `IEventDispatcher` |
| Method | camelCase | `calculateScore()` |
| Variable | camelCase | `playerHealth` |
| Private var | underscore prefix | `_internalState` |
| Constant | UPPER_SNAKE_CASE | `MAX_SPEED` |
| Event type | UPPER_SNAKE_CASE | `Event.COMPLETE` |

## Type System

### Primitive Types

- `int` - 32-bit signed integer
- `uint` - 32-bit unsigned integer
- `Number` - 64-bit floating point (IEEE 754)
- `String` - immutable string
- `Boolean` - true/false
- `*` - untyped (any type)
- `void` - no return value

### Type Annotations

```as3
// Variable typing
var count:int = 0;
var name:String = "Player";
var data:* = anyValue;  // Untyped

// Function typing
function calculate(x:Number, y:Number):Number {
    return x + y;
}

// Vector (typed array)
var numbers:Vector.<int> = new Vector.<int>();
var sprites:Vector.<Sprite> = new <Sprite>[sprite1, sprite2];

// Dictionary (object keys)
var map:Dictionary = new Dictionary(true);  // weak keys
```

## Common Patterns

### Event Handling

```as3
// Add listener
dispatcher.addEventListener(MouseEvent.CLICK, onClick);

// Handler with weak reference (prevents memory leaks)
dispatcher.addEventListener(Event.COMPLETE, onComplete, false, 0, true);

// Remove listener
dispatcher.removeEventListener(MouseEvent.CLICK, onClick);

// Custom events
dispatchEvent(new Event("customEvent"));
dispatchEvent(new CustomEvent(CustomEvent.DATA_LOADED, data));
```

### Display Object Management

```as3
// Add to display list
addChild(sprite);
addChildAt(sprite, 0);

// Remove from display list
removeChild(sprite);
if (sprite.parent) sprite.parent.removeChild(sprite);

// Iterate children
for (var i:int = numChildren - 1; i >= 0; i--) {
    removeChildAt(i);
}
```

### Resource Cleanup Pattern

```as3
public function dispose():void {
    // Remove event listeners
    removeEventListener(Event.ENTER_FRAME, onEnterFrame);

    // Remove from display list
    if (parent) parent.removeChild(this);

    // Clear references
    _data = null;

    // Dispose children
    while (numChildren > 0) {
        var child:DisplayObject = removeChildAt(0);
        if (child is IDisposable) {
            IDisposable(child).dispose();
        }
    }
}
```

### Singleton Pattern

```as3
public class GameManager {
    private static var _instance:GameManager;

    public static function get instance():GameManager {
        if (!_instance) _instance = new GameManager(new SingletonEnforcer());
        return _instance;
    }

    public function GameManager(enforcer:SingletonEnforcer) {
        if (!enforcer) throw new Error("Use GameManager.instance");
    }
}
internal class SingletonEnforcer {}
```

## Error Handling

```as3
try {
    riskyOperation();
} catch (e:TypeError) {
    trace("Type error: " + e.message);
} catch (e:Error) {
    trace("General error: " + e.message);
} finally {
    cleanup();
}

// Throw errors
throw new Error("Something went wrong");
throw new ArgumentError("Invalid parameter");
```

## Metadata Tags

```as3
// Embed assets
[Embed(source="assets/image.png")]
private var ImageClass:Class;

// SWF metadata
[SWF(width="800", height="600", backgroundColor="#FFFFFF", frameRate="60")]

// Bindable (Flex)
[Bindable]
public var score:int;

// Event metadata (documentation)
[Event(name="complete", type="flash.events.Event")]
```

## Best Practices

### Memory Management

- Always remove event listeners when objects are disposed
- Use weak references for listeners when appropriate
- Nullify references to allow garbage collection
- Dispose BitmapData, Sounds, and other native resources
- Avoid circular references

### Performance

- Use `Vector.<T>` instead of `Array` for typed collections
- Cache frequently accessed properties in local variables
- Use object pooling for frequently created/destroyed objects
- Minimize display list operations
- Use `cacheAsBitmap` for static complex graphics

### Code Organization

- One class per file (filename matches class name)
- Group imports: flash.*, then third-party, then project
- Use interfaces for loose coupling
- Implement IDisposable pattern for cleanup
- Document public API with ASDoc comments

## Additional Resources

### Reference Files

Consult `references/docs-index.md` for the complete documentation index mapping topics to files in `/docs/`.

### Documentation Location

All API documentation is in the `/docs/` directory:

- Core language: Object, Array, Vector, String, etc.
- Display: Sprite, Stage, Bitmap, Graphics
- Events: Event system, keyboard, mouse, touch
- Networking: URLLoader, Socket, NetConnection
- AIR: File system, database, desktop features
