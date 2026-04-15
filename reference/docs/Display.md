# flash.display Package Summary

Base classes for the ActionScript 3.0 display list and vector graphics.

## Hierarchy

`Object` -> `EventDispatcher` -> `DisplayObject` -> `InteractiveObject` -> `DisplayObjectContainer` -> `Sprite` -> `MovieClip`

---

## DisplayObject (Abstract)

The base class for all objects that can be placed on the display list.

### Key Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `x`, `y`, `z` | `Number` | Position coordinates. |
| `width`, `height` | `Number` | Dimensions in pixels. |
| `scaleX`, `scaleY`, `scaleZ` | `Number` | Scale factor (1.0 is default). |
| `rotation`, `rotationX`, `rotationY`, `rotationZ` | `Number` | Rotation in degrees. |
| `alpha` | `Number` | Transparency (0.0 to 1.0). |
| `visible` | `Boolean` | Whether the object is visible. |
| `mask` | `DisplayObject` | Masking object. |
| `parent` | `DisplayObjectContainer` | Containing object (read-only). |
| `root` | `DisplayObject` | Top-most display object in this SWF/file (read-only). |
| `stage` | `Stage` | The Stage object (read-only). Null if not on display list. |
| `filters` | `Array` | Array of filter objects (e.g., BlurFilter, DropShadowFilter). |
| `cacheAsBitmap` | `Boolean` | If true, caches a bitmap representation for performance. |

### Key Methods

- `getBounds(targetCoordinateSpace:DisplayObject):Rectangle`: Returns a rectangle that defines the area of the display object relative to the coordinate system of the target.
- `globalToLocal(point:Point):Point`: Converts Stage (global) coordinates to local coordinates.
- `localToGlobal(point:Point):Point`: Converts local coordinates to Stage (global) coordinates.
- `hitTestObject(obj:DisplayObject):Boolean`: Checks for collision with another display object.
- `hitTestPoint(x:Number, y:Number, shapeFlag:Boolean = false):Boolean`: Checks if a point overlaps the object.

---

## InteractiveObject (Abstract)

Base class for all display objects with which the user can interact (mouse/keyboard).

### Key Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `mouseEnabled` | `Boolean` | Whether object receives mouse messages. |
| `doubleClickEnabled` | `Boolean` | Enables `doubleClick` events. |
| `tabEnabled` | `Boolean` | Whether object is in the tab order. |
| `focusRect` | `Object` | Specifies if a focus rectangle is displayed. |

---

## DisplayObjectContainer (Abstract)

Base class for objects that can contain child display objects.

### Key Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `numChildren` | `int` | Number of children (read-only). |
| `mouseChildren` | `Boolean` | Whether children receive mouse messages. |

### Key Methods

- `addChild(child:DisplayObject):DisplayObject`: Adds a child to the top of the list.
- `addChildAt(child:DisplayObject, index:int):DisplayObject`: Adds a child at a specific index.
- `removeChild(child:DisplayObject):DisplayObject`: Removes a child.
- `getChildAt(index:int):DisplayObject`: Returns child at index.
- `getChildByName(name:String):DisplayObject`: Returns child by `name` property.
- `getChildIndex(child:DisplayObject):int`: Returns index of child.
- `setChildIndex(child:DisplayObject, index:int):void`: Changes child z-order.
- `contains(child:DisplayObject):Boolean`: Checks if object is a child or grandchild.

---

## Sprite

A basic display list building block: can display graphics and contain children. Unlike `MovieClip`, it has no timeline.

### Key Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `graphics` | `Graphics` | The Graphics object for vector drawing (read-only). |
| `buttonMode` | `Boolean` | If true, shows a hand cursor on mouseover. |

### Key Methods

- `startDrag(lockCenter:Boolean = false, bounds:Rectangle = null):void`
- `stopDrag():void`

---

## Graphics

Final class for creating vector shapes. Accessed via `sprite.graphics` or `shape.graphics`.

### Drawing Methods

- `clear():void`: Resets all drawing and styles.
- `lineStyle(thickness:Number, color:uint = 0, alpha:Number = 1.0, ...)`
- `beginFill(color:uint, alpha:Number = 1.0):void`
- `beginGradientFill(...)`, `beginBitmapFill(...)`
- `endFill():void`
- `moveTo(x:Number, y:Number):void`
- `lineTo(x:Number, y:Number):void`
- `curveTo(controlX:Number, controlY:Number, anchorX:Number, anchorY:Number):void`
- `drawRect(x:Number, y:Number, width:Number, height:Number):void`
- `drawCircle(x:Number, y:Number, radius:Number):void`
- `drawEllipse(x:Number, y:Number, width:Number, height:Number):void`
- `drawRoundRect(x:Number, y:Number, width:Number, height:Number, ellipseWidth:Number, ellipseHeight:Number):void`

---

## Stage

The main drawing area. Not globally accessible; access via `displayObject.stage`.

### Key Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `frameRate` | `Number` | Gets/sets the frame rate. |
| `scaleMode` | `String` | StageScaleMode (EXACT_FIT, SHOW_ALL, NO_BORDER, NO_SCALE). |
| `align` | `String` | StageAlign (TOP, LEFT, etc). |
| `stageWidth`, `stageHeight` | `int` | Current dimensions of the stage. |
| `focus` | `InteractiveObject` | Object with keyboard focus. |
| `displayState` | `String` | StageDisplayState (NORMAL, FULL_SCREEN, etc). |

### Key Methods

- `invalidate():void`: Forces a `render` event to be dispatched.

---

## Example: Basic Sprite and Drawing

```actionscript
var canvas:Sprite = new Sprite();
canvas.graphics.beginFill(0xFF0000); // Red
canvas.graphics.drawRect(0, 0, 100, 100);
canvas.graphics.endFill();

canvas.x = 50;
canvas.y = 50;
canvas.buttonMode = true;

addChild(canvas);
```
