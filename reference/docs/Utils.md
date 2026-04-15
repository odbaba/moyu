# flash.utils Package Summary

Utility classes and global functions for data structures, timing, and reflection.

## Classes

### Timer

Allows running code on a specified time sequence. Dispatches `TimerEvent.TIMER` and `TimerEvent.TIMER_COMPLETE`.

- `Timer(delay:Number, repeatCount:int = 0)`
- `start()`, `stop()`, `reset()`
- `currentCount:int` (read-only)
- `running:Boolean` (read-only)

---

### ByteArray

A packed array of bytes for binary data manipulation. Support for zlib/lzma compression and AMF serialization.

- **Properties**: `length`, `position`, `bytesAvailable`, `endian`.
- **Read Methods**: `readBoolean()`, `readByte()`, `readInt()`, `readUnsignedInt()`, `readFloat()`, `readDouble()`, `readUTF()`, `readObject()` (AMF).
- **Write Methods**: `writeBoolean()`, `writeByte()`, `writeInt()`, `writeFloat()`, `writeUTF()`, `writeObject()`.
- **Compression**: `compress(algorithm:String)`, `uncompress(algorithm:String)`. constants in `CompressionAlgorithm`.

---

### Dictionary

A collection of properties that uses strict equality (`===`) for key comparison. Allows using objects as keys.

- `Dictionary(weakKeys:Boolean = false)`: If `weakKeys` is true, entries are cleared if the key object is garbage collected.

---

## Global Functions (Reflection & Timing)

### Reflection

| Function | Description |
| :--- | :--- |
| `describeType(value:*):XML` | Returns an XML description of the object (methods, properties, traits). |
| `getDefinitionByName(name:String):Object` | Returns a class reference by its string name. |
| `getQualifiedClassName(value:*):String` | Returns the full class name (e.g., `"flash.display::Sprite"`). |
| `getQualifiedSuperclassName(value:*):String` | Returns the full name of the base class. |

### Timing

| Function | Description |
| :--- | :--- |
| `getTimer():int` | Returns milliseconds since the application started. Used for performance tracking. |
| `setTimeout(listener:Function, delay:Number, ...args):uint` | Runs a function after a delay. |
| `setInterval(listener:Function, delay:Number, ...args):uint` | Runs a function at intervals. |
| `clearTimeout(id:uint)`, `clearInterval(id:uint)` | Cancels the timer/interval. |

---

## Example: Reflection

```actionscript
var sprite:Sprite = new Sprite();
trace(getQualifiedClassName(sprite)); // "flash.display::Sprite"

var SpriteClass:Class = getDefinitionByName("flash.display.Sprite") as Class;
var instance:* = new SpriteClass();
```

## Example: Timer

```actionscript
var myTimer:Timer = new Timer(1000, 5); // 1 second, 5 times
myTimer.addEventListener(TimerEvent.TIMER, onTimer);
myTimer.start();

function onTimer(event:TimerEvent):void {
    trace("Timer fired " + myTimer.currentCount);
}
```
